var ws = null;
var wsurl = "ws://127.0.0.1:8090/ws";

window.onload = function() {
    ws = new WebSocket(wsurl);

    ws.onopen = function() {
        //ws.send('ping');
        console.log("connected to " + wsurl);
        init();
    };

    ws.onclose = function(e) {
        console.log("connection closed (" + e.code + ")");
    };

    ws.onmessage = function(e) {
        var data = e.data;
        console.log("message received: " + e.data);
    };
};

function init() {
    var ProtoBuf = dcodeIO.ProtoBuf;
    var file = ProtoBuf.loadProtoFile("/proto/server_request.proto");
    console.log(file);
    var ServerRequest = file.build("messages.ServerRequest");
    var ServerRequestPing = file.build("messages.ServerRequestPing");
    var requestPing = new ServerRequestPing('ping request');
    var request = new ServerRequest('pingmethod', requestPing);
    console.log(request);
    console.log(requestPing);
    var buf = request.toArrayBuffer();

    ws.send(buf);
};