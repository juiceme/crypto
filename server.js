var websocket = require("websocket");
var http = require("http");
var fs = require("fs");

var Aes = require('./aes.js');
Aes.Ctr = require('./aes-ctr.js');

function serveClientPage() {
    http.createServer(function(request,response){
	var clientjs = fs.readFileSync("./client.js", "utf8");
	var aesjs = fs.readFileSync("./aes.js", "utf8");
	var aesctrjs = fs.readFileSync("./aes-ctr.js", "utf8");
	var sendable = clientjs + aesjs + aesctrjs + "</script></body></html>";
	response.writeHeader(200, {"Content-Type": "text/html"});
	response.write(sendable);
	response.end();
	console.log();
	console.log("Clientscript sent");
    }).listen(8080);
}

var server = http.createServer(function(request, response) {
});

server.listen(8081, function() {});

wsServer = new websocket.server({
    httpServer: server
});

console.log();
console.log("Waiting for connection to port 8080...");
serveClientPage();

var aesKey = "t0ps3cr3t";
var clearText = "This is a message from the SERVER...";

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    console.log("connected");

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var clientCipherText = message.utf8Data;
	    var clientClearText = Aes.Ctr.decrypt(clientCipherText, aesKey, 128);
	    console.log("clientCipherText: " + clientCipherText);
	    console.log("clientClearText:  " + clientClearText);
	    var serverCipherText = Aes.Ctr.encrypt(clearText, aesKey, 128);
	    console.log("serverCipherText: " + serverCipherText);
	    connection.send(serverCipherText);
	    console.log("serverClearText:  " + Aes.Ctr.decrypt(serverCipherText, aesKey, 128));
        }
    });

    connection.on('close', function(connection) {
	console.log("disconnected");
    });

});
