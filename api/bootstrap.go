package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/cdreier/golang-snippets/snippets"

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

	gameBox := packr.New("gameDump", "./game")
	wmBox := packr.New("gameDump", "./weltmeister")
	libBox := packr.New("libDump", "./lib")
	mediaBox := packr.New("mediaDump", "./media")
	rootBox := packr.New("rootDump", "./rootDump")

	snippets.EnsureDir(fileRoot + "media")
	snippets.EnsureDir(fileRoot + "game")
	snippets.EnsureDir(fileRoot + "lib")
	snippets.EnsureDir(fileRoot + "weltmeister")

	dumpBox(rootBox, fileRoot)
	dumpBox(libBox, fileRoot+"lib")
	dumpBox(mediaBox, fileRoot+"media")
	dumpBox(wmBox, fileRoot+"weltmeister")
	dumpBox(gameBox, fileRoot+"game")
}

func dumpBox(box *packr.Box, folder string) {
	box.Walk(func(path string, packrFile packd.File) error {
		folder = strings.TrimSuffix(folder, "/")
		absPath := fmt.Sprintf("%s/%s", folder, path)

		snippets.EnsureDir(filepath.Dir(absPath))

		file, err := os.OpenFile(absPath, os.O_CREATE|os.O_RDWR, 0644)
		if err != nil {
			log.Println("cannot write", absPath, err.Error())
			return nil
		}
		defer file.Close()
		file.WriteString(packrFile.String())
		return nil
	})
}
