# Pomio

Pomio is a free, open-source Pomodoro productivity web app being developed
for a Senior Design capstone. This foundation displays a static 25:00 timer.
Timer logic, authentication, tasks, settings, and database features are not
implemented yet.

## Technology stack

- Frontend: HTML, CSS, and vanilla JavaScript
- Backend: Python and Flask
- Planned database: SQLite, later PostgreSQL through Supabase
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

## Project structure

```text
pomio/
├── app.py                 # Flask application and homepage route
├── requirements.txt       # Python dependencies
├── .gitignore             # Files Git should leave out
├── README.md              # Project and setup instructions
├── templates/
│   └── index.html         # Homepage markup
└── static/
    ├── css/style.css      # Homepage styling
    └── js/
        ├── timer.js       # Future timer functionality placeholder
        └── app.js         # Preserved original starter script (unused)
```

The local `.venv/` directory holds installed Python packages and is ignored by Git.
