package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"text/template"

	"github.com/gobuffalo/packr/v2"

	"github.com/cdreier/golang-snippets/snippets"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

var fileRoot = "./"
var gameFolder = "game"

// go build && ./api -port 8082 -dev -root ../../

func main() {

	port := flag.String("port", "8081", "the port to start weltmeister on")
	igserver := flag.String("igserver", "http://localhost:8080", "impact webpack server url")
	root := flag.String("root", "./", "the file root you start weltmeister")
	game := flag.String("game", "game", "the name of the game-folder")
	shouldBootstrap := flag.Bool("new", false, "start with --new flag to bootstrap new game")
	booxtrapBox2d := flag.Bool("b2d", false, "only works with new flag, bootstraps a box2d game instead default impact game")
	flag.Parse()
	fileRoot = *root
	gameFolder = *game

	if *shouldBootstrap {
		bootstrapImpact(*booxtrapBox2d)
		log.Println("succesfully bootstrapped new game!")
		log.Println("now run npm install")
		return
	}

	type indexTemplateData struct {
		IGServer string
	}
	indexData := indexTemplateData{
		IGServer: *igserver,
	}

	r := chi.NewRouter()

	// r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Route("/weltmeister/api/", func(rr chi.Router) {
		rr.Use(corsMiddleware())
		rr.Get("/browse", browse)
		rr.Get("/glob", glob)
		rr.Post("/save", save)
	})

	assetbox := packr.New("root", "./assets")
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		content, _ := assetbox.FindString("index.html")
		t, _ := template.New("index").Parse(content)
		t.Execute(w, indexData)
	})
	snippets.ChiFileServer(r, "/assets", assetbox)
	snippets.ChiFileServer(r, "/game", http.Dir(fileRoot+gameFolder))
	snippets.ChiFileServer(r, "/media", http.Dir(fileRoot+"media"))

	entities, err := collectEntities()
	if err != nil {
		log.Panic("cannot collect entities on startup", err.Error())
	}
	writeEntitiesFile(entities)

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

func writeEntitiesFile(entities []IGEntity) {
	assetbox := packr.New("root", "./assets")
	t, _ := assetbox.FindString("entities.template")

	tmpl, err := template.New("startwm").Parse(t)
	if err != nil {
		log.Panic("cannot parse embedded entities template", err.Error())
	}

	file, err := os.OpenFile(fileRoot+"entities.generated.js", os.O_CREATE|os.O_RDWR|os.O_TRUNC, 0644)
	if err != nil {
		log.Panic("cannot open entities.generated.js file", err.Error())
	}

	tmpl.Execute(file, entities)
}
