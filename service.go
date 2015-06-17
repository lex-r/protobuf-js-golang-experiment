package main

import (
	"github.com/lex-r/protobuf-js-golang-experiment/messages"
	"github.com/golang/protobuf/proto"
	"log"
)

type Service struct {
	functions map[string]func(*connection, *messages.ServerRequest)
}

func (this *Service) handle(c *connection, message []byte) {
	serverRequest := &messages.ServerRequest{}
	err := proto.Unmarshal(message, serverRequest);
	if err != nil {
		log.Fatal("unmarshaling error: ", err)
	}

	method := serverRequest.Method

	this.call(*method, c, serverRequest)
}

func (this *Service) register(name string, f func(*connection, *messages.ServerRequest)) {
	this.functions[name] = f
}

func (this *Service) call(name string, c *connection, req *messages.ServerRequest) {
	log.Printf("Call %v function", name)
	f, ok := this.functions[name]
	if !ok {
		log.Printf("Function %v not exists", name)
		return
	}

	f(c, req)
}