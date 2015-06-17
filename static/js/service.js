function ServiceClass() {

}

ServiceClass.prototype.pong = function (clientRequest) {
    var requestPong = clientRequest.requestPong;
    console.log('requestPong', requestPong);
    console.log("pong test", requestPong.text);
};

var Service = new ServiceClass();
