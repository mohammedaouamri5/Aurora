package main

import (
	"io"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mattn/go-colorable"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/route"
	log "github.com/sirupsen/logrus"
)

func InitLog() {
	// Set custom formatter
	// Set output to both stdout and the log file
	multiWriter := io.MultiWriter(colorable.NewColorableStdout())
	log.SetOutput(multiWriter)

	fieldMap := log.FieldMap{
		log.FieldKeyMsg:  "@message",
		log.FieldKeyFunc: "@caller",
	}

	// Set the formatter to include timestamp and caller information
	textFormatter := log.TextFormatter{
		FullTimestamp:          true,
		ForceColors:            true,
		ForceQuote:             true,
		PadLevelText:           true,
		DisableLevelTruncation: false,
		FieldMap:               fieldMap,
		TimestampFormat:        time.RFC3339,
	}

	log.SetFormatter(&textFormatter)

	// Enable reporting caller information
	log.SetReportCaller(true)
}

func main() {
	InitLog()

	cfg, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal(err.Error())
	}

	initializers.ConnectDB(&cfg)

	router := gin.Default()

	// Allow all origins, methods, and headers
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Allow all origins
		AllowMethods:     []string{"*"}, // Allow all methods
		AllowHeaders:     []string{"*"}, // Allow all headers
		ExposeHeaders:    []string{"*"},
		AllowCredentials: true,
	}))



	route.Routers(router)


	// Start HTTPS server
	log.Println("Server running on https://100.84.234.49:8443")
	err = router.RunTLS(":8443", "cert.pem", "key.pem")
	if err != nil {
		log.Fatal("Failed to start HTTPS server: ", err)
	}
}
