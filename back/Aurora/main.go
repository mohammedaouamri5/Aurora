package main

import (
	"net/http"
	"os"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/route"
	"github.com/mohammedaouamri5/go-log/log"
)


var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Replace with proper origin validation in production
	},
}


func main() {
	log.INIT(
		os.Stdout, 
		log.NewStructuredLoggerFormatter(log.MonokaiTheme()),
		)

	// Load environment variables
	cfg, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("Failed to load config: ", err)
	}

	// Connect to the database
	initializers.ConnectDB(&cfg)

	// Set up Gin with CORS
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"*"},
		AllowCredentials: true,
	}))

	// Register routes
	route.Routers(router)

	if err := router.RunTLS(":8443", "certs/cert.pem", "certs/key.pem"); err != nil {
		log.Fatal("Failed to start HTTPS server: ", err)
	}
}

