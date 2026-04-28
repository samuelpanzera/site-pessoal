# Portfolio API Contract

## `GET /api/projects`
Returns a list of projects for the "Projects Section".
```json
[
  {
    "id": "1",
    "title": "PDI Portfolio",
    "description": "Ultra-fast monorepo portfolio.",
    "techStack": ["React", "Go"],
    "link": "https://github.com/..."
  }
]
```

## `GET /api/logs`
Returns the execution log entries.
```json
[
  {
    "id": "1",
    "date": "2026-04-27T00:00:00Z",
    "title": "Project Init",
    "description": "Started the DEV_VOID portfolio."
  }
]
```
