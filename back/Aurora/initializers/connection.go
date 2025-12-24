package initializers

import (
	"context"
	"database/sql"
	"fmt"
	"sync"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/mohammedaouamri5/go-log/log"
	ollama "github.com/ollama/ollama/api"
	"github.com/qdrant/go-client/qdrant"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Mutx = &sync.Mutex{}

type Connaction struct {
	Orm    *gorm.DB
	Raw    *sql.DB
	Mongo  *mongo.Database
	Redis  *redis.Client
	Qdrant *qdrant.Client
	Ollama *ollama.Client
	MinIO  *minio.Client
}

var Clients Connaction

func ConnectDB(config *Config) {
	var err error

	// --- Ollama ---

	Clients.Ollama, err = ollama.ClientFromEnvironment()

	if err != nil {
		log.Fatal("❌ Failed to connect to Ollama:", err)
	}
	log.Info("✅ Connected to Ollama")

	// --- Qdrant ---

	Clients.Qdrant, err = qdrant.NewClient(&qdrant.Config{
		Host: "localhost",
		Port: 6334,
	})

	if err != nil {
		log.Fatal("❌ Failed to connect to Qdrant:", err)
	}
	log.Info("✅ Connected to Qdrant")

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

	Clients.Orm, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to PostgreSQL:", err)
	}
	log.Info("✅ Connected to PostgreSQL")

	Clients.Raw, err = Clients.Orm.DB()
	if err != nil {
		log.Fatal("❌ Failed to extract raw PostgreSQL connection:", err)
	}
	log.Info("✅ Extracted raw SQL DB connection")

	// --- MongoDB ---

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	Mongo, err := mongo.Connect(ctx, options.Client().ApplyURI(config.MONGO_URI))
	if err != nil {
		log.Fatal("❌ Failed to connect to MongoDB:", err)
	}
	Clients.Mongo = Mongo.Database("Aurora")
	log.Info("✅ Connected to MongoDB")

	// --- Redis ---

	Clients.Redis = redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:%s", config.REDIS_HOST, config.REDIS_PORT),
	})
	_, err = Clients.Redis.Ping(context.Background()).Result()
	if err != nil {
		log.Fatal("❌ Failed to connect to Redis:", err)
	}
	log.Info("✅ Connected to Redis")

	// --- MinIO ---

	minioClient, err := minio.New("localhost:9000", &minio.Options{
		Creds:  credentials.NewStaticV4(Cfg.MINIO_ROOT_USER, Cfg.MINIO_ROOT_PASSWORD, ""),
		Secure: false, // use true if HTTPS is enabled
	})
	if err != nil {
		log.Fatal("❌ Failed to connect to MinIO:", err)
	}
	Clients.MinIO = minioClient
	log.Info("✅ Connected to MinIO")

	// Optional: create a default bucket if it doesn’t exist
	bucketName := "data"
	ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	exists, err := Clients.MinIO.BucketExists(ctx, bucketName)
	if err != nil {
		log.Fatal("❌ Failed to check MinIO bucket:", err)
	}
	if !exists {
		err = Clients.MinIO.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			log.Fatal("❌ Failed to create MinIO bucket:", err)
		}
		log.Info("✅ Created MinIO bucket:", bucketName)
	} else {
		log.Info("✅ MinIO bucket already exists:", bucketName)
	}
}
