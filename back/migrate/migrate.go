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
	initializers.DB.Orm.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
	initializers.DB.Orm.Exec("CREATE EXTENSION IF NOT EXISTS \"fuzzystrmatch\"")
	initializers.DB.Orm.AutoMigrate(models.User{})
	initializers.DB.Orm.AutoMigrate(models.Conversation{})
	fmt.Println("👍 Migration complete")
}
