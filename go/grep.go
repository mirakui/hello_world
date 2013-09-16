package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
)

func grep(pattern string, infile *os.File) {
	scanner := bufio.NewScanner(infile)
	for scanner.Scan() {
		line := scanner.Text()
		matched, err := regexp.MatchString(pattern, line)
		if err != nil {
			panic(err)
		}
		if matched {
			fmt.Println(line)
		}
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "reading standard input:", err)
	}
}

func main() {
	var pattern string
	var infile *os.File
	var err error

	switch count := len(os.Args); {
	case count > 2:
		pattern = os.Args[1]
		infile, err = os.Open(os.Args[2])
		if err != nil {
			panic(err)
		}
	case count > 1:
		infile = os.Stdin
	default:
		fmt.Fprintln(os.Stderr, "usage: grep pattern [file]")
		os.Exit(1)
	}

	grep(pattern, infile)
}
