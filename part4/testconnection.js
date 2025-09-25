require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connection successful!')
    mongoose.connection.close()
  })
  .catch(err => console.error('Connection failed:', err))