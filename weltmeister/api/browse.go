package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"
)

type BrowseDTO struct {
	Parent string   `json:"parent"`
	Dirs   []string `json:"dirs"`
	Files  []string `json:"files"`
}

func isImage(name string) bool {
	images := []string{
		".png",
		".gif",
		".jpg",
		".jpeg",
	}

	for _, i := range images {
		if strings.HasSuffix(name, i) {
			return true
		}
	}

	return false
}

func browse(w http.ResponseWriter, r *http.Request) {

	currentDir := fileRoot
	urlDir := r.URL.Query().Get("dir")
	fileType := r.URL.Query().Get("type")
	if urlDir != "" {
		currentDir = fileRoot + urlDir
	}

	data, err := ioutil.ReadDir(currentDir)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	dirs := make([]string, 0)
	files := make([]string, 0)
	for _, fi := range data {
		if fi.IsDir() {
			dirs = append(dirs, urlDir+"/"+fi.Name())
		} else {
			if fileType == "images" && isImage(fi.Name()) {
				files = append(files, urlDir+"/"+fi.Name())
			} else if fileType == "scripts" && strings.HasSuffix(fi.Name(), ".js") {
				files = append(files, urlDir+"/"+fi.Name())
			}
		}
	}

	json.NewEncoder(w).Encode(BrowseDTO{
		Parent: "",
		Dirs:   dirs,
		Files:  files,
	})
}
