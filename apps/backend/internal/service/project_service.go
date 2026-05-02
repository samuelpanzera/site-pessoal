package service

import (
	"github.com/samuel/pdipessoal/backend/internal/models"
	"github.com/samuel/pdipessoal/backend/internal/repository"
)

type ProjectService interface {
	GetProjects() ([]models.Project, error)
}

type projectService struct {
	repo repository.ProjectRepository
}

func NewProjectService(repo repository.ProjectRepository) ProjectService {
	return &projectService{repo: repo}
}

func (s *projectService) GetProjects() ([]models.Project, error) {
	return s.repo.GetAll()
}
