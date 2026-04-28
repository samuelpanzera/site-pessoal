package api

import (
	"encoding/json"
	"net/http"

	"github.com/samuel/pdipessoal/backend/internal/models"
)

func GetProjectsHandler(w http.ResponseWriter, r *http.Request) {
	projects := []models.Project{
		{
			ID:          "1",
			Title:       "DEV_VOID Portfolio",
			Description: "Ultra-fast monorepo portfolio using Bun, Go, and React.",
			TechStack:   []string{"Bun", "Go", "React", "Tailwind"},
			Link:        "#",
		},
		{
			ID:          "2",
			Title:       "Distributed Ledger",
			Description: "A high-concurrency event-sourcing engine built with Go and Kafka.",
			TechStack:   []string{"Go", "Kafka", "PostgreSQL"},
			Link:        "#",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}
