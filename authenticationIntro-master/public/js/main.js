$(document).ready(function () {
        var socket = io.connect('http://' + document.domain + ':'+ location.port);
        //var socket = io.on();
        chatForm = $('.chat-form'),
        messageField = chatForm.find("#message-field"),
        messsagesList = $(".meassages-list");

    chatForm.on("submit", function(e){
        e.preventDefault();
        var message = messageField.val();
        messsagesList.append("<li>"+message+"</li>");
        socket.emit("message", message);
    });
    socket.on("message", function(message){
        messsagesList.append("<li>"+message+"</li>");
    });
});