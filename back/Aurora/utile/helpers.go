package utile

import (
	"encoding/json"
	"crypto/md5"
	"fmt"
	"io"
	"strings"
)

func FileMD5UUID(file io.Reader) (string, error) {
	hasher := md5.New()
	if _, err := io.Copy(hasher, file); err != nil {
		return "", err
	}

	hash := hasher.Sum(nil) // 16 bytes
	if len(hash) != 16 {
		return "", fmt.Errorf("unexpected hash length")
	}

	// Convert MD5 hash to UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
	uuid := fmt.Sprintf("%x-%x-%x-%x-%x",
		hash[0:4],
		hash[4:6],
		hash[6:8],
		hash[8:10],
		hash[10:16],
	)

	// Optionally set the version to 4 and variant bits to match UUIDv4 format
	// Version (4 bits) = 4, Variant (2 bits) = 10
	uuidBytes := []byte(uuid)
	uuidBytes[14] = '4' // version 4
	uuidBytes[19] = 'a' // variant 10xx

	return string(uuidBytes), nil
}

func main() {
	// Example usage with a string as file
	r := strings.NewReader("Hello World")
	uuid, err := FileMD5UUID(r)
	if err != nil {
		panic(err)
	}
	fmt.Println(uuid)
}

func ToJSONBytes[T any](data T) ([]byte, error) {
	return json.Marshal(data)
}
