package main

import (
	"log"

	"github.com/cdreier/golang-snippets/snippets"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
)

const FILE_ROOT = "../../"

func main() {

	r := chi.NewRouter()

	addCors(r)

	r.Route("/weltmeister/api/", func(r chi.Router) {
		r.Get("/browse", browse)
		r.Post("/save", save)
	})

	log.Println("starting api on port", "8082")
	s := snippets.CreateHTTPServer(":8082", r)
	if err := s.ListenAndServe(); err != nil {
		log.Fatal("cannot start server", err)
	}
}

func addCors(router *chi.Mux) {
	cors := cors.New(cors.Options{
		// AllowedOrigins: []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})
	router.Use(cors.Handler)
}
