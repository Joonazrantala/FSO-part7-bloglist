const bcrypt = require("bcrypt")
const userRouter = require("express").Router()
const User = require("../models/user")
const { error } = require('../utils/logger')

userRouter.get("/users", async (req, res) => {
    const users = await User.find({}).populate("blogs", {title: 1, author: 1, url: 1, likes: 1})
    res.json(users)
})

userRouter.post("/users", async (req, res) => {
    const { username, password, name } = req.body

    if (!password || !username || username.length < 3 || password.length < 3) {
        res.status(400).json({ error: "invalid username or password"} )
    }
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        passwordHash,
        name
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
})

module.exports = userRouter