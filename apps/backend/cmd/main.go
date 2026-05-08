package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/recover"

	"github.com/samuel/pdipessoal/backend/internal/handler"
	"github.com/samuel/pdipessoal/backend/internal/repository"
	"github.com/samuel/pdipessoal/backend/internal/service"
)

func addr() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	return ":" + port
}

func main() {
	// --- Camada de dependências (DIP) ---
	projectRepo := repository.NewMockProjectRepository()
	logRepo := repository.NewMockLogRepository()

	projectService := service.NewProjectService(projectRepo)
	logService := service.NewLogService(logRepo)

	projectHandler := handler.NewProjectHandler(projectService)
	logHandler := handler.NewLogHandler(logService)

	// --- Fiber App ---
	app := fiber.New(fiber.Config{
		AppName: "Backend PDI",
	})

	// Middlewares
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "OPTIONS"},
		AllowHeaders: []string{"Content-Type"},
	}))

	// --- Rotas ---
	api := app.Group("/api")

	api.Get("/health", func(c fiber.Ctx) error {
		return c.SendString("OK")
	})

	api.Get("/projects", projectHandler.GetProjects)
	api.Get("/logs", logHandler.GetLogs)

	// Rota raiz para teste rápido no browser
	app.Get("/", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":   "online",
			"protocol": c.Protocol(),
			"message":  "🚀 Backend PDI online (Fiber v3)",
		})
	})

	// --- Iniciar Servidor ---
	a := addr()
	log.Printf("Servidor rodando em http://localhost%s\n", a)
	if err := app.Listen(a); err != nil {
		log.Fatalf("Erro ao iniciar o servidor: %v", err)
	}
}
