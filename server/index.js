const express = require('express')
const cors = require('cors')
const { chats } = require('./data/data')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
app.use(
	cors({
		origin: 'http://localhost:5173',
	})
)
app.use(express.json())
const PORT = process.env.PORT || 5500

app.get('/api/chat', (req, res) => {
	res.send(chats)
})

app.listen(PORT, () => {
	console.log(`server work ${PORT}`)
})
