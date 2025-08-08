package main

import (
	"context"
	"io"
	"net/http"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/mattn/go-colorable"
	"github.com/mohammedaouamri5/Aurora/constant"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/route"
	"github.com/mohammedaouamri5/Aurora/utile"
	log "github.com/sirupsen/logrus"
)

func InitLog() {
	log.SetOutput(io.MultiWriter(colorable.NewColorableStdout()))
	log.SetReportCaller(true)
	log.SetFormatter(&log.TextFormatter{
		FullTimestamp:          true,
		ForceColors:            true,
		ForceQuote:             true,
		PadLevelText:           true,
		DisableLevelTruncation: false,
		FieldMap: log.FieldMap{
			log.FieldKeyMsg:  "@message",
			log.FieldKeyFunc: "@caller",
		},
		TimestampFormat: time.RFC3339,
	})
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Replace with proper origin validation in production
	},
}

func WebSocketHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Error("WebSocket upgrade failed: ", err)
		return
	}
	log.Info("WebSocket client connected")
	defer conn.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	var writeMu sync.Mutex

	conn.SetPongHandler(func(appData string) error {
		log.Debug("Received pong")
		return nil
	})

	// Goroutine: Ping the client every 30 seconds
	go func() {
		ticker := time.NewTicker(30 * time.Second)
		defer ticker.Stop()

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				writeMu.Lock()
				err := conn.WriteMessage(websocket.PingMessage, nil)
				writeMu.Unlock()
				if err != nil {
					log.Warn("Ping failed: ", err)
					cancel()
					return
				}
			}
		}
	}()

	// Goroutine: Listen for client disconnects
	go func() {
		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				log.Warn("Client disconnected: ", err)
				cancel()
				return
			}
		}
	}()

	// Main loop: Send messages from the channel
	for {
		select {
		case <-ctx.Done():
			log.Info("WebSocket handler shutting down")
			return
		case msg := <-constant.TheMassegeChanel:
			writeMu.Lock()
			err := conn.WriteJSON(msg)
			writeMu.Unlock()
			if err != nil {
				log.Warn("Write error: ", err)
				cancel()
				return
			}
		}
	}
}

func main() {
	InitLog()

	// Initialize the global chat channel
	constant.TheMassegeChanel = make( chan utile.MessageStreem, 1)

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
	router.GET("/ws", WebSocketHandler)
	route.Routers(router)

	// Start the HTTPS server
	log.Println("Server running on https://100.84.234.49:8443")
	if err := router.RunTLS(":8443", "cert.pem", "key.pem"); err != nil {
		log.Fatal("Failed to start HTTPS server: ", err)
	}
}

