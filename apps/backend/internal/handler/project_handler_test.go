package handler

import (
	"encoding/json"
	"io"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v3"
	"github.com/samuel/pdipessoal/backend/internal/models"
	"github.com/samuel/pdipessoal/backend/internal/repository"
	"github.com/samuel/pdipessoal/backend/internal/service"
)

func TestGetProjects(t *testing.T) {
	// Setup das dependências
	repo := repository.NewMockProjectRepository()
	svc := service.NewProjectService(repo)
	projectHandler := NewProjectHandler(svc)

	// Setup do App Fiber
	app := fiber.New()
	app.Get("/projects", projectHandler.GetProjects)

	// Fazer a requisição simulada
	req := httptest.NewRequest("GET", "/projects", nil)
	resp, err := app.Test(req)
	
	if err != nil {
		t.Fatalf("Erro ao testar endpoint: %v", err)
	}

	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("Status code esperado %d, obtido %d", fiber.StatusOK, resp.StatusCode)
	}

	// Validar payload
	body, _ := io.ReadAll(resp.Body)
	var projects []models.Project
	if err := json.Unmarshal(body, &projects); err != nil {
		t.Fatalf("Falha ao decodificar JSON: %v", err)
	}

	if len(projects) == 0 {
		t.Error("A lista de projetos não deve estar vazia")
	}
}
