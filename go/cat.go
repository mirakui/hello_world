package main

import(
	"os"
	"io"
)

const(
	BufSize = 4096
)

func cat(infile *os.File) {
	outbuf := make([]byte, BufSize)
	for {
		n, err := infile.Read(outbuf)
		if err != nil {
			switch err {
				case io.EOF: break
				default: panic(err)
			}
		}
		if n > 0 {
			os.Stdout.Write(outbuf)
		}
	}
	os.Stdout.Sync()
}

func main() {
	var infile *os.File
	if len(os.Args) > 1 {
		var err error
		infile, err = os.Open(os.Args[1])
		if err != nil {
			panic(err)
		}
	} else {
		infile = os.Stdin
	}
	cat(infile)
}
