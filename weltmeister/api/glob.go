package main

import (
	"log"
	"net/http"

	zglob "github.com/mattn/go-zglob"
)

func glob(w http.ResponseWriter, r *http.Request) {

	matches, err := zglob.Glob("./game/**/*Entity*.js")

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	log.Println(matches)

}
