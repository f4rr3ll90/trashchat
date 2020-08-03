let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const axios = require("axios");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());




app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.get('/news', (req, res) => {
    axios
        .get('https://meduza.io/api/v3/search?chrono=articles&locale=ru&page=0&per_page=10')
        .then((data) => {
            res.send(data.data.documents)
        });

});

app.post('/post', function(req, res) {
    axios
        .get('https://meduza.io/api/v3/' + req.body.post.url)
        .then((data) => {
            res.send(data.data)
        });
});

chatHistory = [];
app.get('/history', (req, res) => {
    res.send(JSON.stringify(chatHistory));
});


http.listen(port, () => {
    console.log('Listening on port *: '+port);
});

io.on('connection', (socket) => {

    socket.emit('connections', Object.keys(io.sockets.connected).length);

    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });

    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', (data));
        if (chatHistory.length >= 9) {
            chatHistory.shift()
        }
        chatHistory.push(data);
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    socket.on('joined', (data) => {
        socket.broadcast.emit('joined', (data));
        console.log(data);
    });

    socket.on('leave', (data) => {
        socket.broadcast.emit('leave', (data));
    });

});