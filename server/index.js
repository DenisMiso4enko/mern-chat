const express = require('express');
const cors = require('cors');
const { chats } = require('./data/data');
const connectDB = require('./config/db');
const colors = require('colors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);
app.use(express.json());
connectDB();
const PORT = process.env.PORT || 5500;

app.get('/api/chat', (req, res) => {
  res.send(chats);
});

app.listen(PORT, () => {
  console.log(`server work ${PORT}`.yellow.bold);
});
