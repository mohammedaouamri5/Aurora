package initializers

import (
	"github.com/spf13/viper"
)

type Config struct {
	DBHost         string `mapstructure:"POSTGRES_HOST"`
	DBUserName     string `mapstructure:"POSTGRES_USER"`
	DBUserPassword string `mapstructure:"POSTGRES_PASSWORD"`
	DBName         string `mapstructure:"POSTGRES_DB"`
	DBPort         string `mapstructure:"POSTGRES_PORT"`
	ServerPort     string `mapstructure:"PORT"`
	POSTGRES_URL   string `mapstructure:"POSTGRES_URL"`
	ClientOrigin   string `mapstructure:"CLIENT_ORIGIN"`
	TIME_FORMAT    string `mapstructure:"TIME_FORMAT"`
	TIME_NULL      string `mapstructure:"TIME_NULL"`
	JWT            string `mapstructure:"JWT"`
	NULL_UUID      string `mapstructure:"NULL_UUID"`
	ALL_UUID       string `mapstructure:"ALL_UUID"`
	ACCESS_TOKEN   string `mapstructure:"ACCESS_TOKEN"`
	MONGO_URI      string `mapstructure:"MONGO_URI"`
	REDIS_HOST      string `mapstructure:"REDIS_HOST"`
	REDIS_PORT      string `mapstructure:"REDIS_PORT"`

}

var Cfg *Config

func LoadConfig(path string) (config Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigType("env")
	viper.SetConfigName("app")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)
	Cfg = &config
	return
}
