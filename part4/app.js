require('express-async-errors')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require("./controllers/users.js")
const loginRouter = require("./controllers/login.js")
const logger = require('./utils/logger.js')
const config = require('./utils/config.js')
const { errorHandler, unknownEndpoint, requestLogger, tokenExtractor, userExtractor} = require('./utils/middleware')

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)

logger.info('connecting to:', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, {
    autoIndex: true
  })
  .then(() => {
    logger.info('Connected to database')
  })
  .catch((error) => {
    logger.error('Failed to connect:', error.message)
  })

app.use('/api/blogs', blogsRouter)
app.use('/api', usersRouter)
app.use("/api/login", loginRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app