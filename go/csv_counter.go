package main

import (
	"os"
	"io"
	"fmt"
	"encoding/csv"
)

func readCsv(infile *os.File) {
	reader := csv.NewReader(infile)
	sum_lines := 0
	sum_cols := 0
	for {
		cols, err := reader.Read()
		if err != nil {
			switch err {
			case io.EOF:
				break
			default:
				panic(err)
			}
		}
		if len(cols)==0 { break }
		sum_cols += len(cols)
		sum_lines++
	}
	fmt.Printf("lines: %d\n", sum_lines)
	fmt.Printf("columns: %d\n", sum_cols)
}

func main() {
	var infile *os.File
	var err error

	switch count := len(os.Args); {
	case count >= 1:
		infile, err = os.Open(os.Args[1])
		if err != nil {
			panic(err)
		}
	default:
		infile = os.Stdin
	}

	if err != nil { panic(err) }

	readCsv(infile)
}
