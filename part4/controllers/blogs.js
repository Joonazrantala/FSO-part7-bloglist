const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { error } = require('../utils/logger')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {userExtractor} = require("../utils/middleware")

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate("user", {username: 1, name: 1})
  res.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  let { title, author, url, likes} = request.body
  likes = likes ?? 0
  const user = request.user

  if (!title || !author || !url)
    return response.status(400).json({error: "incorrect body"})

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  const savedblog = await blog.save()
  user.blogs = user.blogs.concat(savedblog._id)
  await user.save()
  response.status(201).json(savedblog)
})

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  const user = request.user

  if (!(blog.user.toString() === user.id.toString())) {
    return response.status(401).json({ error: 'token invalid'})
  }
  
  await Blog.findByIdAndDelete(id)

  user.blogs = user.blogs.filter(objectid => objectid.toString() !== id)
  await user.save()

  response.status(204).end()
})

blogsRouter.patch("/:id", async (request, response) => {
  const id = request.params.id
  const infotoupdate = request.body
  const blogtoupdate = await Blog.findByIdAndUpdate(id, infotoupdate, {new: true})

  response.status(200).json(blogtoupdate)
})

module.exports = blogsRouter