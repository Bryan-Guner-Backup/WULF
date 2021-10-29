package main

import (
	"bufio"
	"encoding/hex"
	"fmt"
	"github.com/btcsuite/btcutil/base58"
	"log"
	"os"
)

const hash160Length = 40

func main() {

	if len(os.Args) < 2 {
		log.Fatal("Please provide filename with one hash160 hex strings on each line")
	}
	arg := os.Args[1]

	// Open the file.
	file, err := os.Open(arg)
	if err != nil {
		log.Fatal(err)
	}

	// Create a new Scanner for the file.
	scanner := bufio.NewScanner(file)

	// Loop over all lines in the file
	for scanner.Scan() {
		line := scanner.Text()

		// Check if length is correct
		if len(line) != hash160Length {
			continue
		}

		// Decode, and ignore errors
		decoded, err := hex.DecodeString(line)
		if err != nil {
			//log.Fatal(err)
			continue
		}

		base58 := base58.CheckEncode(decoded, 0x00)

		fmt.Printf("%s\n", base58)

	}

}
