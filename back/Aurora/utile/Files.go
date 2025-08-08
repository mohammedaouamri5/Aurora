package utile

import (
	"io"
	"os"
)




func MoveFile(src, dst string) error {
	inputFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer inputFile.Close()

	outputFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer outputFile.Close()

	_, err = io.Copy(outputFile, inputFile) // Copy file contents
	if err != nil {
		return err
	}

	return os.Remove(src) // Delete original file after copying
}
