require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors')
const path = require('path');

const setMiddleware=require('./middleware/middleware')
const setRoute=require('./route/route')

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
}));

// Connect to MongoDB
mongoose.connect(process.env.mongo_url);
//mongoose.connect('mongodb://localhost:27017/whiteboardApp');

setMiddleware(app)
// setRoute(app)
app.use('/api',require('./route/drawingRoute'))

app.use(express.static(path.join(__dirname, '../client/dist')));

// For any other requests, serve the React index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Start the server
app.listen(2000, () => {
  console.log('Server running on port 2000');
});
