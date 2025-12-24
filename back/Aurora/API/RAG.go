package api

import (

	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/mohammedaouamri5/go-log/log"
)

func UpdateFiles(ctx *gin.Context) {
	log.Info("UpdateFiles")
	ctx.Status(http.StatusOK)
}
