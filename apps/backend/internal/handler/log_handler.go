package handler

import (
	"github.com/gofiber/fiber/v3"
	"github.com/samuel/pdipessoal/backend/internal/service"
)

type LogHandler struct {
	service service.LogService
}

func NewLogHandler(s service.LogService) *LogHandler {
	return &LogHandler{service: s}
}

func (h *LogHandler) GetLogs(c fiber.Ctx) error {
	logs, err := h.service.GetLogs()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}
	return c.Status(fiber.StatusOK).JSON(logs)
}
