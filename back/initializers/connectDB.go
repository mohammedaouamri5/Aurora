package initializers

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"sync"
	"time"
)

var Mutx = &sync.Mutex{}

type Connaction struct {
	Orm   *gorm.DB
	Raw   *sql.DB
	Mongo *mongo.Database
	Redis *redis.Client
}

var DB Connaction

func ConnectDB(config *Config) {
	var err error

	// --- PostgreSQL ---
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		"localhost", 
		// config.DBHost,
		config.DBUserName,
		config.DBUserPassword,
		config.DBName,
		"6500",
		// config.DBPort,
	)

	DB.Orm, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to PostgreSQL:", err)
	}
	fmt.Println("✅ Connected to PostgreSQL")

	DB.Raw, err = DB.Orm.DB()
	if err != nil {
		log.Fatal("❌ Failed to extract raw PostgreSQL connection:", err)
	}
	fmt.Println("✅ Extracted raw SQL DB connection")

	// --- MongoDB ---
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	Mongo, err := mongo.Connect(ctx, options.Client().ApplyURI(config.MONGO_URI))
	if err != nil {
		log.Fatal("❌ Failed to connect to MongoDB:", err)
	}
	DB.Mongo = Mongo.Database("Aurora")
	fmt.Println("✅ Connected to MongoDB")
	// --- Redis ---
	DB.Redis = redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:%s", config.REDIS_HOST, config.REDIS_PORT),
	})
	_, err = DB.Redis.Ping(context.Background()).Result()
	if err != nil {
		log.Fatal("❌ Failed to connect to Redis:", err)
	}
	fmt.Println("✅ Connected to Redis")
}
