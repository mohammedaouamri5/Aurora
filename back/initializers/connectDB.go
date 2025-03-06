package initializers

import (
	"database/sql"
	"fmt"
	"log"
	"sync"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Mutx = &sync.Mutex{}
type Connaction struct {
	Orm *gorm.DB
	Raw *sql.DB
}
var DB Connaction
func ConnectDB(config *Config) {
	var err error
	// FIXME : fix the host 
	dsn := fmt.Sprintf("host=0.0.0.0 user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		// config.DBHost,
		config.DBUserName,
		config.DBUserPassword,
		config.DBName,
		"6500",
	)

	DB.Orm, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the Database")
	}
	fmt.Println("  Connected Successfully to the Database")

	DB.Raw, err = DB.Orm.DB()
	if err != nil {
		log.Fatal("Failed to extract raw DB connection:", err)
	}
	fmt.Println("  Extracted raw SQL DB connection successfully")

}
