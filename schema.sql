BEGIN;

CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS labels (
    id INTEGER PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (length(trim(name)) > 0),
    color TEXT NOT NULL,
    UNIQUE (profile_id, id)
);

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    label_id INTEGER,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (profile_id, id),
    FOREIGN KEY (profile_id, label_id) REFERENCES labels (profile_id, id)
);

CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    task_id INTEGER,
    duration INTEGER NOT NULL CHECK (typeof(duration) = 'integer' AND duration > 0),
    completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id, task_id) REFERENCES tasks (profile_id, id)
);

CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY,
    profile_id INTEGER NOT NULL UNIQUE REFERENCES profiles (id) ON DELETE CASCADE,
    focus_length INTEGER NOT NULL DEFAULT 25 CHECK (typeof(focus_length) = 'integer' AND focus_length > 0),
    short_break INTEGER NOT NULL DEFAULT 5 CHECK (typeof(short_break) = 'integer' AND short_break > 0),
    long_break INTEGER NOT NULL DEFAULT 15 CHECK (typeof(long_break) = 'integer' AND long_break > 0),
    background TEXT,
    ambient_sound TEXT
);

COMMIT;
