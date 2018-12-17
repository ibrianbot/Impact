package main

import (
	"encoding/json"
	"log"
	"net/http"
	"path/filepath"
	"strings"

	zglob "github.com/mattn/go-zglob"
)

// so... this gets mad.
// problem: we need to compile all the entites from the game, to a global place, without the weltmeister webpack running

func glob(w http.ResponseWriter, r *http.Request) {

	matches, err := zglob.Glob(fileRoot + "/game/**/*Entity*.js")

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	result := make([]string, 0)

	for _, r := range matches {
		name := filepath.Base(r)
		name = strings.TrimSuffix(name, ".js")
		log.Println("found entity: ", name)
		result = append(result, name)
	}
	json.NewEncoder(w).Encode(result)
}
