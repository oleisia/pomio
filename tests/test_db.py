import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from app import app
from db import get_db


class DatabaseTests(unittest.TestCase):
    def setUp(self):
        temporary_directory = tempfile.TemporaryDirectory()
        self.addCleanup(temporary_directory.cleanup)
        self.database = Path(temporary_directory.name) / "instance" / "pomio.sqlite3"
        config_patch = patch.dict(app.config, {"DATABASE": self.database})
        config_patch.start()
        self.addCleanup(config_patch.stop)

    def initialize_database(self):
        result = app.test_cli_runner().invoke(args=["init-db"])
        self.assertEqual(result.exit_code, 0, result.exception)

    def test_cli_initializes_schema_and_preserves_existing_data(self):
        self.initialize_database()
        self.assertTrue(self.database.is_file())
        with app.app_context():
            connection = get_db()
            tables = connection.execute(
                "SELECT name FROM sqlite_master WHERE type = 'table'"
            ).fetchall()
            self.assertEqual(
                {row["name"] for row in tables},
                {"profiles", "labels", "tasks", "sessions", "settings"},
            )
            with connection:
                profile_id = connection.execute("INSERT INTO profiles DEFAULT VALUES").lastrowid
                connection.execute("INSERT INTO settings (profile_id) VALUES (?)", (profile_id,))

        self.initialize_database()
        with app.app_context():
            connection = get_db()
            self.assertEqual(connection.execute("SELECT count(*) FROM profiles").fetchone()[0], 1)
            lengths = connection.execute(
                "SELECT focus_length, short_break, long_break FROM settings WHERE profile_id = ?",
                (profile_id,),
            ).fetchone()
            self.assertEqual(tuple(lengths), (25, 5, 15))

    def test_connection_enforces_foreign_keys_and_closes_on_teardown(self):
        self.initialize_database()
        with app.app_context():
            connection = get_db()
            self.assertIs(connection, get_db())
            self.assertEqual(connection.execute("PRAGMA foreign_keys").fetchone()[0], 1)
            with self.assertRaises(sqlite3.IntegrityError):
                connection.execute("INSERT INTO settings (profile_id) VALUES (?)", (999,))

            first_profile = connection.execute("INSERT INTO profiles DEFAULT VALUES").lastrowid
            second_profile = connection.execute("INSERT INTO profiles DEFAULT VALUES").lastrowid
            label_id = connection.execute(
                "INSERT INTO labels (profile_id, name, color) VALUES (?, ?, ?)",
                (first_profile, "Study", "#ffffff"),
            ).lastrowid
            with self.assertRaises(sqlite3.IntegrityError):
                connection.execute(
                    "INSERT INTO tasks (profile_id, label_id, title) VALUES (?, ?, ?)",
                    (second_profile, label_id, "Review notes"),
                )

        with self.assertRaises(sqlite3.ProgrammingError):
            connection.execute("SELECT 1")
