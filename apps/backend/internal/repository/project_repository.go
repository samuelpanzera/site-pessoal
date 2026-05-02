package repository

import "github.com/samuel/pdipessoal/backend/internal/models"

type ProjectRepository interface {
	GetAll() ([]models.Project, error)
}

type mockProjectRepository struct{}

func NewMockProjectRepository() ProjectRepository {
	return &mockProjectRepository{}
}

func (r *mockProjectRepository) GetAll() ([]models.Project, error) {
	return []models.Project{
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
	}, nil
}
