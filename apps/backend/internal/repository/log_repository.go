package repository

import (
	"time"

	"github.com/samuel/pdipessoal/backend/internal/models"
)

type LogRepository interface {
	GetAll() ([]models.ExecutionLogEntry, error)
}

type mockLogRepository struct{}

func NewMockLogRepository() LogRepository {
	return &mockLogRepository{}
}

func (r *mockLogRepository) GetAll() ([]models.ExecutionLogEntry, error) {
	return []models.ExecutionLogEntry{
		{
			ID:          "1",
			Date:        time.Now().Add(-24 * time.Hour),
			Title:       "Setup de Monorepo",
			Description: "Finalizada a orquestração com Turborepo e Bun. Estrutura escalável pronta.",
		},
		{
			ID:          "2",
			Date:        time.Now().Add(-12 * time.Hour),
			Title:       "Backend Go Integrado",
			Description: "Endpoints base configurados e testados com middleware de CORS.",
		},
		{
			ID:          "3",
			Date:        time.Now(),
			Title:       "UI Components: Phase 1",
			Description: "Hero e TechStack implementados seguindo a estética Obsidian Pulse.",
		},
	}, nil
}
