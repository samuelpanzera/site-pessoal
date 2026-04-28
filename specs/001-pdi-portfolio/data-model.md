# Phase 1: Data Model

## Entities

### Project
- `ID` (string): Unique identifier
- `Title` (string): Project name
- `Description` (string): Short description
- `TechStack` (array of strings): Technologies used
- `Link` (string): URL to project/repo

### ExecutionLogEntry
- `ID` (string): Unique identifier
- `Date` (datetime): When the log was created
- `Title` (string): Log title
- `Description` (string): Detailed text

### Skill
- `Name` (string): Name of the skill (e.g., Go, React)
- `Category` (string): Category (e.g., Language, Tool)
- `Level` (integer): Proficiency level (e.g., 1 to 5)
