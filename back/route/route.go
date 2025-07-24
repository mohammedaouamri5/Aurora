package route

import (
	"net/http"

	"github.com/gin-gonic/gin"
	api "github.com/mohammedaouamri5/Aurora/API"
)

func Routers(router *gin.Engine) {

	// Handle OPTIONS preflight request
	router.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(204)
	})



	router.GET("/conversations", api.JWTauth, api.SELECTALLConversation)

	router.POST("/create-conversation", api.JWTauth, api.NewChat)

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
		router.POST("/audio", api.Audio)
		router.POST("/create-user", api.CreateUser)
		router.GET("/users", api.GetAllUsers)
	}

}
