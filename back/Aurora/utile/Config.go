package utile

import (
	"github.com/mohammedaouamri5/Aurora/constant"
	"github.com/mohammedaouamri5/Aurora/models"
)

// TODO :
// this function should get __ID of a user check a local stored map (the map is of a fixed lenght) if not exist check redis if not exist check DB
func GetUserConfi(__ID string) models.UserConfig {
	return constant.DefaultUserConfig
}
