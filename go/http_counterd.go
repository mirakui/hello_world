package main

import (
	"log"
	"net/http"
	"fmt"
)

type Counter struct {
	n int
}

func (ctr *Counter) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	ctr.n++
	fmt.Fprintf(w, "counter = %d\n", ctr.n)
}

func start() {
	counter := new(Counter)
	http.Handle("/counter", counter)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func main() {
	start()
}
