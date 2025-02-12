const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const friendRoutes = require('./routes/friendRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chat-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/users', userRoutes);

// Socket.io
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinRoom', ({ userId, friendId }) => {
        socket.join(`${userId}-${friendId}`);
        socket.join(`${friendId}-${userId}`);
    });

    socket.on('sendMessage', (message) => {
        io.to(`${message.receiver}-${message.sender}`).emit('receiveMessage', message);
    });

    socket.on('typing', ({ sender, receiver }) => {
        socket.to(`${receiver}-${sender}`).emit('typing', { sender });
    });

    socket.on('stopTyping', ({ sender, receiver }) => {
        socket.to(`${receiver}-${sender}`).emit('stopTyping', { sender });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.use('/api/profile', profileRoutes);


// Start server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});