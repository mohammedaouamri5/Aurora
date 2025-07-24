package utile

func IsOK(__err error) bool {
	if __err == nil {
		return true
	}
	for _, c := range __err.Error() {
		if c != '\n' {
			return false
		}
	}
	return true
}


