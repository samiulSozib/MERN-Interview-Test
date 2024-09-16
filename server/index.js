require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors')

const setMiddleware=require('./middleware/middleware')
const setRoute=require('./route/route')

const app = express();
app.use(express.json());
app.use(cors())

// Connect to MongoDB
mongoose.connect(process.env.mongo_url);

setMiddleware(app)
setRoute(app)


// Start the server
app.listen(1000, () => {
  console.log('Server running on port 1000');
});
