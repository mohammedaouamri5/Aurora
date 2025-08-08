package utile

import (
	"github.com/mohammedaouamri5/Aurora/models"
	"sync"
)

type Syncmessages struct {
	messeges []models.Message
	lock     sync.RWMutex
}

func (s *Syncmessages) Set(msg models.Message) []models.Message {
	s.lock.Lock()
	defer s.lock.Unlock()

	s.messeges = append(s.messeges, msg)

	copySlice := make([]models.Message, len(s.messeges))
	copy(copySlice, s.messeges)
	return copySlice
}

func (s *Syncmessages) Get() []models.Message {
	s.lock.RLock()
	defer s.lock.RUnlock()

	copySlice := make([]models.Message, len(s.messeges))
	copy(copySlice, s.messeges)
	return copySlice
}

func (s *Syncmessages) Clear() {
	s.lock.Lock()
	defer s.lock.Unlock()
	s.messeges = nil
}
