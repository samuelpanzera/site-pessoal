package service

import (
	"github.com/samuel/pdipessoal/backend/internal/models"
	"github.com/samuel/pdipessoal/backend/internal/repository"
)

type LogService interface {
	GetLogs() ([]models.ExecutionLogEntry, error)
}

type logService struct {
	repo repository.LogRepository
}

func NewLogService(repo repository.LogRepository) LogService {
	return &logService{repo: repo}
}

func (s *logService) GetLogs() ([]models.ExecutionLogEntry, error) {
	return s.repo.GetAll()
}
