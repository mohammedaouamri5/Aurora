package main

import (
	"fmt"
	"log"

	"github.com/mohammedaouamri5/CuraHealth-back/initializers"
	"github.com/mohammedaouamri5/CuraHealth-back/models"
)

func init() {
	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("   Could not load environment variables", err)
	}

	initializers.ConnectDB(&config)
}

func main() {
	initializers.DB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
	initializers.DB.Exec("CREATE EXTENSION IF NOT EXISTS \"fuzzystrmatch\"")
	initializers.DB.AutoMigrate(models.Type{})
	initializers.DB.AutoMigrate(models.Permition{})
	initializers.DB.AutoMigrate(models.UserPermition{})
	initializers.DB.AutoMigrate(models.EtatCivile{})
	initializers.DB.AutoMigrate(models.Patient{})
	initializers.DB.AutoMigrate(models.User{})
	initializers.DB.AutoMigrate(models.Appointmnt{})
	initializers.DB.AutoMigrate(models.ApponmentCategory{})
	initializers.DB.AutoMigrate(models.Status{})
	initializers.DB.AutoMigrate(models.StatusPatient{})
	initializers.DB.AutoMigrate(models.StatusAppointmnt{})
	initializers.DB.AutoMigrate(models.Unite{})
	initializers.DB.AutoMigrate(models.GeneralInstraction{})
	initializers.DB.AutoMigrate(models.Prescription{})
	initializers.DB.AutoMigrate(models.DWA{})
	initializers.DB.AutoMigrate(models.DWAPrescription{})
	initializers.DB.AutoMigrate(models.SubTask{})
	initializers.DB.AutoMigrate(models.Task{})
	initializers.DB.AutoMigrate(models.TaskSubTask{})
	initializers.DB.AutoMigrate(models.DID{})
	initializers.DB.AutoMigrate(models.Motifs{})
	initializers.DB.AutoMigrate(models.MotifsAppointmnt{})
	initializers.DB.AutoMigrate(models.MotifsPatient{})
	initializers.DB.AutoMigrate(models.SingeFunctionnal{})
	initializers.DB.AutoMigrate(models.SingeFunctionnalAppointmnt{})
	initializers.DB.AutoMigrate(models.SingeFunctionnalPatient{})
	initializers.DB.AutoMigrate(models.SingePhysic{})
	initializers.DB.AutoMigrate(models.SingePhysicAppointmnt{})
	initializers.DB.AutoMigrate(models.SingePhysicPatient{})
	initializers.DB.AutoMigrate(models.Diagnostic{})
	initializers.DB.AutoMigrate(models.DiagnosticAppointmnt{})
	initializers.DB.AutoMigrate(models.DiagnosticPatient{})
	initializers.DB.AutoMigrate(models.ContuitsATenir{})
	initializers.DB.AutoMigrate(models.ContuitsATenirAppointmnt{})
	initializers.DB.AutoMigrate(models.ContuitsATenirPatient{})
	initializers.DB.AutoMigrate(models.FileAditionnal{})
	initializers.DB.AutoMigrate(models.FileAditionnalAppointmnt{})
	initializers.DB.AutoMigrate(models.FileAditionnalPatient{})
	fmt.Println("👍 Migration complete")
}
