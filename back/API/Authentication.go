package api

import (
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	. "github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/models"
	"github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var data struct {
		Name     string    `json:"name" binding:"required"`
		Email    string    `json:"email" binding:"required"`
		Password string    `json:"password,omitempty" binding:"required"`
	}
	if err := c.ShouldBindJSON(&data); err != nil {
		logrus.Error(err.Error())
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data.Password), 14)

	user := models.User{
		Name:     data.Name,
		Email:    data.Email,
		Password: password,
	}

	if err := initializers.DB.Orm.Create(&user).Error; err != nil {
		logrus.Error(err.Error())
		c.JSON(http.StatusInternalServerError, H{"error": err.Error()})
		return
	}
	// Crcceate the user and preload the Type information in a single step
	c.JSON(http.StatusCreated, user)
}

type UserClaime struct {
	UserID uuid.UUID
	Name   string
	Email  string
}

type Claime struct {
	User UserClaime
	jwt.StandardClaims
}

func GetTheClaime(user models.User) Claime {
	return Claime{
		User: UserClaime{
			UserID: user.UserID,
			Name:   user.Name,
			Email:  user.Email,
		},

		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), // Token expires in 1 day
			Issuer:    user.UserID.String(),                  // Issuer of the token (optional)
		},
	}
}

func Login(c *gin.Context) {
	var data struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := initializers.DB.Orm.Where("email = ?", data.Email).First(&user).Error; err != nil {
		logrus.Error(err.Error())
		c.JSON(401, gin.H{"message": err.Error()})
		return
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data.Password)); err != nil {
		c.JSON(400, gin.H{"message": "incorrect password"})
		return
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, GetTheClaime(user))

	token, err := claims.SignedString([]byte(initializers.Cfg.JWT))
	if err != nil {
		logrus.Error(err.Error())
		c.JSON(500, gin.H{"message": "could not generate token"})
		return
	}

	c.JSON(200, gin.H{"message": "success", "token": token})
}

func RegisterLogin(c *gin.Context) {
	var data struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required"`
		Password string `json:"password,omitempty" binding:"required"`
	}
	if err := c.ShouldBindJSON(&data); err != nil {
		logrus.Error(err.Error())
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data.Password), 14)

	user := models.User{
		Name:     data.Name,
		Email:    data.Email,
		Password: password,
	}

	if err := initializers.DB.Orm.Create(&user).Error; err != nil {
		logrus.Error(err.Error())
		c.JSON(http.StatusInternalServerError, H{"error": err.Error()})
		return
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data.Password)); err != nil {
		c.JSON(400, gin.H{"message": "incorrect password"})
		return
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    user.UserID.String(),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), // 1 day
	})

	token, err := claims.SignedString([]byte(initializers.Cfg.JWT))
	if err != nil {
		logrus.Error(err.Error())
		c.JSON(500, gin.H{"message": "could not generate token"})
		return
	}

	c.JSON(200, gin.H{"message": "success", "token": token})
}

func User(c *gin.Context) {
	id, DoseExist := c.Get("id")
	if !DoseExist {
		c.JSON(401, gin.H{"message": "unauthorized"})
		return
	}
	var user models.User

	if err := initializers.DB.Orm.Where("user_id = ?", id).First(&user).Error; err != nil {
		logrus.Error(err.Error())
		c.JSON(401, gin.H{"message": "user not found"})
		return
	}

	c.JSON(200, user)
}

func Logout(c *gin.Context) {
	c.SetCookie("jwt", "", -1, "/", "", false, true)
	c.JSON(200, gin.H{"message": "success"})
}

func JWTauth(c *gin.Context) {
	tokenString := c.Request.Header.Get("Authorization")

	token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(initializers.Cfg.JWT), nil
	})


	if err != nil {
		logrus.Error(err.Error())
		c.JSON(401, gin.H{"message": "unauthenticated"})
		c.Abort()
		return
	}

	claims := token.Claims.(*jwt.StandardClaims)

	c.Set("id", claims.Issuer)

	if claims.Issuer == initializers.Cfg.NULL_UUID {
		c.JSON(401, gin.H{"message": "unauthorized"})
		c.Abort()
		return
	}

	c.Next()
}
