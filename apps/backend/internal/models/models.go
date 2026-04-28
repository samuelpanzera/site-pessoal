package models

import "time"

type Project struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	TechStack   []string `json:"techStack"`
	Link        string   `json:"link"`
}

type ExecutionLogEntry struct {
	ID          string    `json:"id"`
	Date        time.Time `json:"date"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
}

type Skill struct {
	Name     string `json:"name"`
	Category string `json:"category"`
	Level    int    `json:"level"`
}
