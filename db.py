import sqlite3
from pathlib import Path

import click
from flask import current_app, g
from flask.cli import with_appcontext


def get_db():
    """Open one connection per Flask application context."""
    if "db" not in g:
        connection = sqlite3.connect(current_app.config["DATABASE"])
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        g.db = connection
    return g.db


def close_db(_error=None):
    connection = g.pop("db", None)
    if connection is not None:
        connection.close()


def init_db():
    Path(current_app.config["DATABASE"]).parent.mkdir(parents=True, exist_ok=True)
    with current_app.open_resource("schema.sql", mode="r") as schema:
        connection = get_db()
        with connection:
            connection.executescript(schema.read())


@click.command("init-db")
@with_appcontext
def init_db_command():
    """Create missing database tables while preserving existing data."""
    init_db()
    click.echo("Initialized the Pomio database.")


def init_app(app):
    app.config.setdefault("DATABASE", Path(app.instance_path) / "pomio.sqlite3")
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
