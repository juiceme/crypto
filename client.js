<!DOCTYPE html>
<html>
<head>
<style>
  table, th, td { border:1px solid black; border-collapse: collapse; }
  th, td { padding: 10px; }
</style>
</head>
<body>
Client AES: <textarea rows="8" cols="120" id="myStatusField_1"></textarea>
<br>
Server AES: <textarea rows="8" cols="120" id="myStatusField_2"></textarea>
<br>

<script language="javascript" type="text/javascript">

var site = window.location.hostname;
var mySocket = new WebSocket("ws://" + site + ":8081/");

// normally the key would be asked from the user of course...
var aesKey = "t0ps3cr3t";
var clientClearText = "This is a message from the CLIENT...";

mySocket.onopen = function (event) {
    var clientCipherText = Aes.Ctr.encrypt(clientClearText, aesKey, 128);
    mySocket.send(clientCipherText);
    document.getElementById("myStatusField_1").value = "clientClearText:  " + clientClearText + "\n\n" +
	"clientCipherText: " + clientCipherText;
};

mySocket.onmessage = function (event) {
    var serverCipherText = event.data;
    var serverClearText = Aes.Ctr.decrypt(serverCipherText, aesKey, 128);
    document.getElementById("myStatusField_2").value = "serverCipherText: " + serverCipherText + "\n\n" +
	"serverClearText:  " + serverClearText;
};

