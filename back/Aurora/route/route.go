package route

import (
	log "github.com/mohammedaouamri5/go-log/log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	api "github.com/mohammedaouamri5/Aurora/API"
	"github.com/mohammedaouamri5/Aurora/constant"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func Routers(router *gin.Engine) {

	// Handle OPTIONS preflight request
	router.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(204)
	})

	{
		router.GET("/ws/messages", func(c *gin.Context) {
			conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
			if err != nil {
				c.String(500, "WebSocket upgrade failed")
				return
			}

			url := "/ws/messages"
			constant.WSmessages.Open(url, conn, time.Millisecond) // AutoClose = true
		})

		router.GET("/ws/titles", func(c *gin.Context) {
			conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
			if err != nil {
				log.WithErr(err).Error("WebSocket upgrade failed")
				c.String(500, "WebSocket upgrade failed")
				return
			}

			url := "/ws/titles"
			constant.WSmessages.Open(url, conn, time.Millisecond) // AutoClose = true
		})
	}

	{
		router.GET("/conversations", api.JWTauth, api.SELECTALLConversation)
		router.POST("/create-conversation", api.JWTauth, api.NewChat)
	}

	{
		router.GET("/Messages", api.JWTauth, api.GetMessage)
		router.POST("/Messages", api.JWTauth, api.SendTextMessage)
	}
	// PING
	{
		router.GET("/ping", func(ctx *gin.Context) { ctx.String(http.StatusOK, "https://100.84.234.49:1420/") })
	}

	/* Auth */
	{
		router.POST("/auth/register", api.Register)
		router.POST("/auth/login", api.Login)
		router.GET("/auth/user", api.JWTauth, api.User)
		router.POST("/auth/logout", api.Logout)
		router.POST("/auth/RegisterLogin", api.RegisterLogin)
	}

	{
		router.POST("/RAG/upload-file", api.JWTauth, api.UpdateFiles)
		router.GET("/RAG/my-docs", api.JWTauth, api.GetUsersFilesHeader)
		router.POST("/RAG/:id/update-file", api.Audio)
		router.POST("/RAG/:id/update-", api.Audio)
	}

	{
		router.POST("/audio", api.Audio)
		router.POST("/create-user", api.CreateUser)
		router.GET("/users", api.GetAllUsers)
	}

}
