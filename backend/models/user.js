const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: String,
    name: String,
    blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model("User", userSchema)

User.syncIndexes().then(() => {
  console.log('Indexes synced')
})

module.exports = User