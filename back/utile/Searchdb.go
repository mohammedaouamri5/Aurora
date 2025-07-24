package utile

import (
	"errors"
	"fmt"
	"net/http"

	sq "github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/mohammedaouamri5/Aurora/initializers"
	log "github.com/sirupsen/logrus"
	"gorm.io/gorm/schema"
)

func NameOfTable(name string) string {

	table := name
	if len(table) > 0 && string(table[len(table)-1]) != "s" {
		table += "s"
	}
	return table
}

/*
@param __id string
@param table string : should be without s
*/
func uUIDExist(__id string, __table string) (bool, error) {

	__colomn := __table + "_id"

	// Create a GORM naming strategy instance
	namingStrategy := schema.NamingStrategy{}

	__table = namingStrategy.TableName(__table) // Becomes "statuses"

	Query := func(__id string) string {
		return fmt.Sprintf("SELECT COUNT(*)  as count  FROM %s WHERE %s = '%s';", __table, __colomn, __id)
	}
	log.Error(Query(__id))

	result, err := initializers.DB.Raw.Query(Query(__id))

	if err != nil {
		log.Error(err.Error())
		return true, err
	}

	for result.Next() {
		var __row bool
		if err := result.Scan(&__row); err != nil {
			log.Error(err.Error())
			return false, err
		}
		return __row, nil

	}
	return false, errors.New("There is a problem but i dont know why ")

}

func IsExist(p_table string, condition string) (bool, error) {
	p_table = NameOfTable(p_table)

	sql, args, err := sq.
		Select("COUNT(*)").
		From(p_table).
		Where(condition).
		ToSql()
	if err != nil {
		log.Error(err.Error())
		return false, err
	}
	var count int
	if err := initializers.
		DB.Raw.
		QueryRow(sql, args...).
		Scan(&count); err != nil {
		log.Error(err.Error())
		return false, err
	}

	return count > 0, nil
}

func UUIDIsExist(p_uuid string, p_table string, err error) (int, error) {
	status := http.StatusOK
	if _, __err := uuid.Parse(p_uuid); __err != nil {
		__err = errors.New(fmt.Sprintf("'%s' Is Invelid", p_uuid))
		log.Error(__err.Error())
		err = errors.Join(err, __err)
		status = http.StatusBadRequest
	} else if IsExist, __err := uUIDExist(p_uuid, p_table); __err != nil {
		log.Error(__err.Error())
		return http.StatusInternalServerError, __err
	} else if !IsExist {
		__err = errors.New(fmt.Sprintf("'%s' dose not exist in '%s'", p_uuid, p_uuid))
		log.Error(__err.Error())
		err = errors.Join(err, __err)
		status = http.StatusBadRequest
	}
	return status, err
}

