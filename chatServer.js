/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an origi$
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//

//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  var feeling;
  var name;
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer',"Hey, hello there~ I am Dr.Smita a placebo-therapy bot. I'm not a replacement for a licensed therapist but you can think of me like$
    setTimeout(timedQuestion, 11000, socket, "What is your name?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer = 'Hello ' + input + ' its wonderful to meet you'; // output response
    name = data;
    waitTime = 5000;
    question = 'No presure, but remember that what you put in is what you get out. So what brings you here?'; // load next question
  } else if (questionNum == 1) {
    answer = 'I see.'; // output response
    waitTime = 3000;
    question = 'Can you describe your current mood in one word?'; // load next question
  } else if (questionNum == 2) {
    answer = input + ' huh? Alright.';
    feeling = input;
    waitTime = 2000;
    question = 'How long have you been feeling ' + input.toLowerCase() + '?'; // load next question
  } else if (questionNum == 3) {
    answer = 'So you have been feeling ' +feeling+ ' for ' + input ;
    waitTime = 3000;
    question = 'Why do you think you are feeling ' + feeling + '?';
  } else if (questionNum == 4) {
    answer = 'I see, so thats why you are feeling ' + feeling+ '. Remember that you are entitled to feel whatever you want; your feelings are valid. I am no$
    waitTime = 5000;
    question = 'Well I am glad that you felt you could talk to me about this. What are you looking to get out of this session?';
  } else if (questionNum == 5){
    answer = 'I understand. Remember, these sessions are for you -- it is entirely up to you what you want to do'
    waitTime = 5000;
    question = 'Lets try a exercise, whats your favorite color right now? Remember there are no wrong answers';
  } else if (questionNum == 6){
        answer = 'Ok, ' + input + ' it is. Close your eyes. I want you to imagine ' +input+' all around you. Really concentrate on it. You are surrounded by$
        waitTime = 13000;
        question = 'Now write whatever comes to your mind. Just write without thinking -- let your thoughts flow.';
 }else {
    answer = 'Well, we are out of time now, but remember '+name+', you deserve to be happy! I shall see you next week.'; // output response
    waitTime = 0;
  }


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);  
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//




//----------------------------------------------------------------------------//
