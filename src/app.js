import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io"

const app = express();
const httpServer = app.listen(8080, () => console.log("It's alive!"));

const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);

let messages = [];
io.on('connection', socket => {
    console.log('New client found.')

    socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages)
    })

    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data);
    })
})
