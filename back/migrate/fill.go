package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"strings"

	"github.com/mohammedaouamri5/CuraHealth-back/initializers"
)

func init() {
	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("   Could not load environment variables", err)
	}

	initializers.ConnectDB(&config)
}

func main() {
	sqlFile := "migrate/fill.sql"

	// Read SQL file
	content, err := ioutil.ReadFile(sqlFile)
	if err != nil {
		log.Fatal("Error reading SQL file:", err)
	}

	// Split and execute each SQL statement
	statements := strings.Split(string(content), ";")
	for _, stmt := range statements {
		stmt = strings.TrimSpace(stmt)
		if stmt == "" {
			continue
		}

		// Execute SQL command
		if err := initializers.DB.Exec(stmt).Error; err != nil {
			log.Fatalf("Error executing statement: %s\n%v", stmt, err)
		}
		fmt.Println("Executed:", stmt)
	}

	fmt.Println("SQL file executed successfully")
}
