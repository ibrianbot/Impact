package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"
)

type SaveResponse struct {
	Error string `json:"error,omitempty"`
	Msg   string `json:"msg,omitempty"`
}

func save(w http.ResponseWriter, r *http.Request) {

	err := r.ParseForm()
	if err != nil {
		json.NewEncoder(w).Encode(SaveResponse{
			Error: "1",
			Msg:   "Error in parsing form data",
		})
		return
	}

	data := r.Form.Get("data")
	path := r.Form.Get("path")

	if data == "" || path == "" {
		json.NewEncoder(w).Encode(SaveResponse{
			Error: "1",
			Msg:   "No Data or Path specified",
		})
		return
	}

	if !strings.HasSuffix(path, ".js") {
		json.NewEncoder(w).Encode(SaveResponse{
			Error: "3",
			Msg:   "File must have a .js suffix",
		})
		return
	}

	err = ioutil.WriteFile(FILE_ROOT+path, []byte(data), 0755)
	if err != nil {
		json.NewEncoder(w).Encode(SaveResponse{
			Error: "2",
			Msg:   err.Error(),
		})
		return
	}

	err = ioutil.WriteFile(FILE_ROOT+path+"on", []byte(data), 0755)
	if err != nil {
		json.NewEncoder(w).Encode(SaveResponse{
			Error: "2",
			Msg:   err.Error(),
		})
		return
	}

	success := make(map[string]bool)
	success["error"] = false
	json.NewEncoder(w).Encode(success)

}
