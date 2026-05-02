package handler

import (
	"github.com/gofiber/fiber/v3"
	"github.com/samuel/pdipessoal/backend/internal/service"
)

type ProjectHandler struct {
	service service.ProjectService
}

func NewProjectHandler(s service.ProjectService) *ProjectHandler {
	return &ProjectHandler{service: s}
}

func (h *ProjectHandler) GetProjects(c fiber.Ctx) error {
	projects, err := h.service.GetProjects()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}
	return c.Status(fiber.StatusOK).JSON(projects)
}
