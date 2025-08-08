package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/models"
	log "github.com/sirupsen/logrus"
)

func CreateUser(ctx *gin.Context) {
	type Request struct {
		 Name string
	}
	type Response struct {
	}
	var request Request
	if err := ctx.ShouldBindJSON(&request); err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	User := models.User{
		Name: request.Name,
	}
	if err := initializers.DB.Orm.Create(&User).Error; err != nil {
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}
	ctx.Status(http.StatusCreated)


}


func GetAllUsers(ctx * gin.Context) { 

	response := make( []models.User, 0)

	if err := initializers.DB.Orm.Find(&response).Error ; err != nil { 
		log.Error(err.Error())
		ctx.JSON(http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}
	ctx.JSON(http.StatusOK , gin.H{"users" : response})
}




