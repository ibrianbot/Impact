package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gobuffalo/packd"
	zglob "github.com/mattn/go-zglob"

	packr "github.com/gobuffalo/packr/v2"
)

func bootstrapImpact() {

	matches, err := zglob.Glob(fileRoot + "/**/*.js")
	if err != nil {
		log.Fatal("cannot check for empty dir...", err.Error())
	}

	if len(matches) > 0 {
		log.Fatal("target folder has already javascript files, to initialize new game, please choose an empty folder")
	}

	distBox := packr.New("dist", "../../dist")
	gameBox := packr.New("dist", "../../game")
	mediaBox := packr.New("dist", "../../media")
	rootBox := packr.New("dist", "../../rootDump")

	dumpBox(rootBox, fileRoot)
	dumpBox(mediaBox, fileRoot+"media")
	dumpBox(gameBox, fileRoot+"game")
	dumpBox(distBox, fileRoot+"dist")
}

func dumpBox(box *packr.Box, folder string) {
	box.Walk(func(path string, packrFile packd.File) error {
		absPath := fmt.Sprintf("%s/%s", folder, path)
		file, err := os.OpenFile(absPath, os.O_CREATE|os.O_RDWR, 0644)
		if err != nil {
			log.Println("cannot write", path, err.Error())
			return err
		}
		defer file.Close()
		file.WriteString(packrFile.String())
		return nil
	})
}
