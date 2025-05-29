const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/blogs', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/blogs', async (request, response) => {
  let { title, author, url, likes} = request.body
  likes = likes ?? 0

  if (!title || !author || !url)
    return response.status(400).json({error: "incorrect body"})

  const blog = new Blog({title, author, url, likes})
  const savedblog = await blog.save()
  response.status(201).json(savedblog)
})

blogsRouter.delete("/blogs/:id", async (request, response) => {
  const id = request.params.id

  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

module.exports = blogsRouter