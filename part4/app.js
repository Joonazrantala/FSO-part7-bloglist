const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs.js')
const logger = require('./utils/logger.js')
const config = require('./utils/config.js')
app.use(cors())
app.use(express.json())

logger.info('connecting to:', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to database')
  })
  .catch((error) => {
    logger.error('Failed to connect:', error.message)
  })

app.use('/api', blogsRouter)

module.exports = app