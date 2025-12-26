package api

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"github.com/mohammedaouamri5/Aurora/constant"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/models"
	"github.com/mohammedaouamri5/Aurora/utile"
	"github.com/mohammedaouamri5/go-log/log"
)

func UpdateFiles(ctx *gin.Context) {

	__userID, __exist := ctx.Get("UserID")
	if !__exist {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "unauthorized"})
		return
	}
	log.Info("received data")

	__request, __err := ctx.MultipartForm()
	if __err != nil {
		log.Error(__err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"error": __err.Error()})
		return
	}
	log.
		WithField("UserID", __userID).
		WithField("request", __request).Info("received data")

	for _, fileHeaders := range __request.File {
		for _, fileHeader := range fileHeaders {
			file, err := fileHeader.Open()
			if err != nil {
				log.WithErr(err).Error("Failed to open file")
				continue
			}
			defer file.Close()

			// Define custom path in the bucket
			__uuid, _ := utile.FileMD5UUID(file)

			if __exist , __err := utile.IsExist("files" , "file_id = '" + __uuid + "'") ; __exist {
				log.Warn("File already exists, skipping insert")
				continue
			}else if __err != nil {
				log.WithErr(__err).Error("Failed to generate file name")
				continue
			}





			file.Seek(0, 0)
			if __err != nil {
				log.WithErr(__err).Error("Failed to generate file name")
				continue
			}

			_, err = initializers.Clients.MinIO.PutObject(
				context.Background(),
				constant.DefaultBucket(),
				__uuid,
				file,
				fileHeader.Size,
				minio.PutObjectOptions{ContentType: fileHeader.Header.Get("Content-Type")},
			)
			if err != nil {
				log.WithErr(err).Error("Failed to upload to MinIO")
				continue
			}

			log.WithField("object", __uuid).Info("File uploaded successfully")

			if __err = initializers.Clients.Orm.Create(&models.File{
				FileID:   uuid.MustParse(__uuid),
				OwnerID:  uuid.MustParse(__userID.(string)),
				FileName: fileHeader.Filename,
			}).Error; __err != nil {
				if strings.Contains(__err.Error(), "duplicate key value") {
					log.Warn("File already exists, skipping insert")
				} else {
					log.Error(__err.Error())
					ctx.JSON(http.StatusInternalServerError, gin.H{"error": __err.Error()})
					return
				}

			}
		}
	}

	ctx.Status(http.StatusOK)
}
