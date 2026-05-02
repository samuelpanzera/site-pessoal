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

func TestGetLogs(t *testing.T) {
	// Setup das dependências
	repo := repository.NewMockLogRepository()
	svc := service.NewLogService(repo)
	logHandler := NewLogHandler(svc)

	// Setup do App Fiber
	app := fiber.New()
	app.Get("/logs", logHandler.GetLogs)

	// Fazer a requisição simulada
	req := httptest.NewRequest("GET", "/logs", nil)
	resp, err := app.Test(req)
	
	if err != nil {
		t.Fatalf("Erro ao testar endpoint: %v", err)
	}

	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("Status code esperado %d, obtido %d", fiber.StatusOK, resp.StatusCode)
	}

	// Validar payload
	body, _ := io.ReadAll(resp.Body)
	var logs []models.ExecutionLogEntry
	if err := json.Unmarshal(body, &logs); err != nil {
		t.Fatalf("Falha ao decodificar JSON: %v", err)
	}

	if len(logs) == 0 {
		t.Error("A lista de logs não deve estar vazia")
	}
}
