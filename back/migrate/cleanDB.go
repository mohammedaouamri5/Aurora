package main

import (
	"github.com/mohammedaouamri5/Aurora/initializers"
	"log"
)

func init() {
	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("   Could not load environment variables", err)
	}

	initializers.ConnectDB(&config)
}

func main() {
	// Loop to continuously drop tables until none are left
	for {
		// Get the list of tables)
		tables, err := initializers.DB.Orm.Migrator().GetTables()
		if err != nil {
			log.Fatal("failed to get tables:", err)
		}

		// Exit if no tables are left
		if len(tables) == 0 {
			log.Println("No tables left to drop. Exiting.")
			break
		}
		// Drop each table
		for _, table := range tables {
			log.Printf("Dropping table: %s\n", table)
			if err := initializers.DB.Orm.Migrator().DropTable(table); err != nil {
				log.Printf("Failed to drop table %s: %v\n", table, err)
			}
		}
	}
}
