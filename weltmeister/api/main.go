package main

import (
	"flag"
	"html/template"
	"log"
	"net/http"

	"github.com/gobuffalo/packr/v2"

	"github.com/cdreier/golang-snippets/snippets"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

var fileRoot = "./"

// go build && ./api -port 8082 -dev -root ../../

func main() {

	port := flag.String("port", "8081", "the port to start weltmeister on")
	dev := flag.Bool("dev", false, "dev server?")
	root := flag.String("root", "./", "the file root you start weltmeister")
	flag.Parse()
	fileRoot = *root

	type indexTemplateData struct {
		DevServer string
	}

	indexData := indexTemplateData{}

	if *dev {
		indexData.DevServer = "http://localhost:8081"
	}

	r := chi.NewRouter()

	// r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Route("/weltmeister/api/", func(rr chi.Router) {
		rr.Use(corsMiddleware())
		rr.Get("/browse", browse)
		rr.Post("/save", save)
	})

	rootbox := packr.New("root", "../")
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		content, _ := rootbox.FindString("api/index.html")
		t, _ := template.New("index").Parse(content)
		t.Execute(w, indexData)
	})
	snippets.ChiFileServer(r, "/assets", rootbox)

	log.Println("starting api on port", *port)
	s := snippets.CreateHTTPServer(":"+*port, r)
	if err := s.ListenAndServe(); err != nil {
		log.Fatal("cannot start server", err)
	}
}

func corsMiddleware() func(h http.Handler) http.Handler {
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
	return cors.Handler
}
