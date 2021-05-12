/*********************************/
/* Set up the static file server */
let static = require('node-static');

/* Set up the http server lbirary */
let http = require('http');

/* Assume that we are running on Heroku */
let port = process.env.PORT;
let directory = __dirname + '/public';

/* If not on Heroku, adjust port and directory */
if((typeof port == 'undefined') || (port === null)) {
    port = 8080;
    directory = './public';
}

/* Set up our static file web server to deliver files form the filesystem */
let file = new static.Server(directory);

let app = http.createServer(
    function(request, response) {
        request.addListener('end',
            function() {
                file.serve(request,response);
            }
        ).resume();
    }
).listen(port);

console.log('The server is running');

/*********************************/
/* Set up the web socket server */

const { Server } = require("socket.io");
const io = new Server(app);

io.on('connection', (socket) => {

    /* Output log message and send to clients */
    function serverLog(...messages){
        io.emit('log',['**** Message from the server:\n']);
        messages.forEach((item) => {
            io.emit('log',['****\t'+item]);
            console.log(item);
        });
    }

    serverLog('a page connected to the server: ' + socket.id);
    
    socket.on('disconnect', () => {
        serverLog('a page disconnected from the server: ' + socket.id);
    });
});