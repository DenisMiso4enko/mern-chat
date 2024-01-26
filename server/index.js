const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const colors = require('colors')
const dotenv = require('dotenv')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
dotenv.config()

connectDB()
const app = express()
const PORT = process.env.PORT || 5500
app.use(
	cors({
		origin: 'http://localhost:5173',
	})
)
app.use(express.json())

app.get('/', (req, res) => {
	res.send('API is running successful')
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

// Error Handling middlewares
app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT, () => {
	console.log(`server work ${PORT}`.yellow.bold)
})

const io = require('socket.io')(server, {
	pingTimeout: 60000,
	cors: {
		origin: 'http://localhost:5173',
	},
})

// io.on('connection', (socket) => {
//   // console.log("socket io connected");
//   socket.on('setup', (userData) => {
//     // создание комнаты для конкретного пользователя
//     socket.join(userData._id);
//     console.log(`User - ${userData._id} connected`);
//     socket.emit('connected');
//   });
//
//   socket.on('join-chat', (room) => {
//     socket.join(room);
//     console.log(`User joined room ${room}`);
//   });
//
//   socket.on('new-message', (message) => {
//     let chat = message.chat;
//     if (!chat.users) return console.log('chat.user is not defined');
//
//
//     chat.users.forEach((user) => {
//       if (user._id == message.sender._id) return;
//
//       // отправляем конкретному пользователю свообщение
//       socket.in(user._id).emit('message-received', message);
//     });
//   });
// });

io.on('connection', socket => {
	// console.log('Connected to socket.io');
	socket.on('setup', userData => {
		socket.join(userData._id)
		socket.emit('connected')
	})

	socket.on('join chat', room => {
		socket.join(room)
		// console.log('User Joined Room: ' + room);
	})
	socket.on('typing', room => socket.in(room).emit('typing'))
	socket.on('stop typing', room => socket.in(room).emit('stop typing'))

	socket.on('new message', newMessageRecieved => {
		let chat = newMessageRecieved.chat

		if (!chat.users) return console.log('chat.users not defined')

		chat.users.forEach(user => {
			if (user._id == newMessageRecieved.sender._id) return

			socket.in(user._id).emit('message recieved', newMessageRecieved)
		})
	})

	socket.off('setup', () => {
		console.log('USER DISCONNECTED')
		socket.leave(userData._id)
	})
})