package utile

import "encoding/json"



func ToJSONBytes[T any](data T) ([]byte, error) {
    return json.Marshal(data)
}
