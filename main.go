package main

import (
	"net/http"
	"github.com/gorilla/websocket"
	"log"
	"github.com/lex-r/protobuf-js-golang-experiment/messages"
	"github.com/golang/protobuf/proto"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func handler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	c := &connection{send: make(chan []byte, 256), ws: conn}
	h.register <- c
	go c.writePump()

	log.Printf("New connection");
	log.Printf("Count connections: %s", len(h.connections));

	c.readPump()
}

var service = Service{functions:make(map[string]func(*connection, *messages.ServerRequest))}

func main() {

	service.register("ping", func(c *connection, req *messages.ServerRequest) {
		resp := &messages.ClientRequest{}
		resp.Method = proto.String("pong")
		resp.RequestPong = &messages.ClientRequestPong{Text:proto.String("Pong")}

		response, err := proto.Marshal(resp)
		if err != nil {
			log.Print("Marshal error: ", err)
			return
		}

		c.send <- response
	})

	go h.run()
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/ws", handler)

	err := http.ListenAndServe(":8090", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
