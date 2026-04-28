package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/samuel/pdipessoal/backend/internal/api"
	"github.com/samuel/pdipessoal/backend/internal/models"
)

func main() {
	mux := http.NewServeMux()

	// Mock Data

	// Routes
	mux.HandleFunc("GET /api/projects", api.GetProjectsHandler)

	mux.HandleFunc("GET /api/logs", api.GetLogsHandler)

	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "OK")
	})

	// Apply Middleware
	handler := api.CorsMiddleware(mux)

	port := ":8080"
	fmt.Printf("Backend running on http://localhost%s\n", port)
	if err := http.ListenAndServe(port, handler); err != nil {
		log.Fatal(err)
	}
}
