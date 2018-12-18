package main

import (
	"log"

	"github.com/gobuffalo/packd"

	packr "github.com/gobuffalo/packr/v2"
)

func bootstrapImpact() {
	// distBox := packr.New("dist", "../../dist")
	// gameBox := packr.New("dist", "../../game")
	// mediaBox := packr.New("dist", "../../media")
	rootBox := packr.New("dist", "../../rootDump")

	dumpBox(rootBox)
}

func dumpBox(box *packr.Box) {
	box.Walk(func(path string, file packd.File) error {
		log.Println(path)
		return nil
	})
}
