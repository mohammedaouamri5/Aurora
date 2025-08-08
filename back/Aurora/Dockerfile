FROM golang

WORKDIR /app

COPY . .

RUN go get -u 

RUN go build -o main

CMD [ "./main" ]
