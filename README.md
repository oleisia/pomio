# Pomio

Pomio is a free, open-source Pomodoro productivity web app being developed
for a Senior Design capstone. It includes a browser-based Pomodoro timer
and a local SQLite database schema.

## Technology stack

- Frontend: HTML, CSS, and vanilla JavaScript
- Backend: Python and Flask
- Local database: SQLite via Python's built-in `sqlite3` module
- Planned deployment: Render
- Version control: Git and GitHub

## Installation

Install Python 3.10 or newer, then open a terminal in the project directory.
On Windows PowerShell:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

On macOS or Linux:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
```

If `.venv` already exists, skip its creation. These commands use the virtual
environment directly, so activation is optional.

## Run locally

Windows PowerShell:

```powershell
.\.venv\Scripts\python.exe app.py
```

macOS or Linux:

```sh
.venv/bin/python app.py
```

Open http://127.0.0.1:5000 in your browser. Press Ctrl+C to stop the server.
Debug mode is enabled for local development; do not use this server for production.

## Initialize the local database

From the project directory on Windows PowerShell:

```powershell
.\.venv\Scripts\python.exe -m flask --app app init-db
```

On macOS or Linux:

```sh
.venv/bin/python -m flask --app app init-db
```

The command creates `instance/pomio.sqlite3`. You can rerun it to create
missing tables while preserving existing rows. Changes to existing tables will
require migrations. Git ignores the instance directory. The browser timer
works before database setup and does not read or write database records.

Run the database tests with your virtual environment's Python:

```sh
python -m unittest discover -s tests
```

## Project structure

```text
pomio/
├── app.py                 # Flask application and homepage route
├── db.py                  # SQLite connection lifecycle and CLI command
├── schema.sql             # SQLite tables and constraints
├── tests/test_db.py       # Database initialization tests
├── requirements.txt       # Python dependencies
├── .gitignore             # Files Git should leave out
├── README.md              # Project and setup instructions
├── templates/
│   └── index.html         # Homepage markup
└── static/
    ├── css/style.css      # Homepage styling
    └── js/
        ├── timer.js       # Pomodoro timer and session cycle
        └── app.js         # Preserved original starter script (unused)
```

The local `.venv/` directory holds installed Python packages and is ignored by Git.
