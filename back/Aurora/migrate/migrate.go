package main

import (
	"fmt"
	"log"

	"github.com/mohammedaouamri5/Aurora/models"
	"github.com/mohammedaouamri5/Aurora/initializers"

)

func init() {
	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("   Could not load environment variables", err)
	}

	initializers.ConnectDB(&config)


}

func main() {
	initializers.Clients.Orm.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
	initializers.Clients.Orm.Exec("CREATE EXTENSION IF NOT EXISTS \"fuzzystrmatch\"")
	initializers.Clients.Orm.AutoMigrate(models.User{})
	initializers.Clients.Orm.AutoMigrate(models.Conversation{})
	fmt.Println("👍 Migration complete")
}
