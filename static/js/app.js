var ws = null;
var wsurl = "ws://127.0.0.1:8090/ws";

var builder;

window.onload = function() {
    ws = new WebSocket(wsurl);
    ws.binaryType = "arraybuffer";

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

        clientRequest = builder.build("messages.ClientRequest");
        msg = clientRequest.decode(e.data, 'utf8');
        var method = msg.method;

        if (typeof Service[method] == "function") {
            Service[method](msg);
        }
    };
};

function init() {
    var ProtoBuf = dcodeIO.ProtoBuf;
    builder = ProtoBuf.newBuilder();
    ProtoBuf.loadProtoFile("/proto/server_request.proto", builder);
    ProtoBuf.loadProtoFile("/proto/client_request.proto", builder);
    var ServerRequest = builder.build("messages.ServerRequest");
    var ServerRequestPing = builder.build("messages.ServerRequestPing");
    var requestPing = new ServerRequestPing('ping request');
    var request = new ServerRequest('ping', requestPing);
    console.log(request);
    console.log(requestPing);
    var buf = request.toArrayBuffer();

    ws.send(buf);
};