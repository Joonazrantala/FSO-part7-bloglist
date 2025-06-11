const { test, after, beforeEach, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require("../models/blog")
const User = require('../models/user')
const { MONGODB_URI } = require('../utils/config')
const api = supertest(app)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

describe("blog API tests", () => {

    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const passwordHash = await bcrypt.hash('testpass', 10)
        const user = new User({ username: 'testuser', name: 'Test User', passwordHash })
        const savedUser = await user.save()

        const userId = savedUser._id.toString()

        // create a token
        token = jwt.sign({ username: savedUser.username, id: savedUser._id }, process.env.SECRET)

        const blog = new Blog({
            title: "test blog",
            author: "tester",
            url: "http://example.com",
            likes: 5,
            user: savedUser._id,
        })
        await blog.save()

        await User.findByIdAndUpdate(savedUser._id, { blogs: [blog._id] }, { new: true })
        })

    test("blogs are returned as json", async () => {
        const response = await api.get("/api/blogs")
                                    .expect(200)
                                    .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.length, 1)
    })

    test("unique identifier is named id, not _id", async () => {
        const response = await api.get("/api/blogs")
        const first_blog = response.body[0]
        assert.ok(first_blog.id)
        assert.strictEqual(first_blog._id, undefined)
    })

    test("successful POST", async () => {
        const newpost = {
            title: "mäxä",
            author: "pekka",
            url: "www.tiini.com",
            likes: 10,
        }
        
        const response = await api.get("/api/blogs")
        const length = response.body.length

        await api.post("/api/blogs")
                    .set("Authorization", `Bearer ${token}`)
                    .send(newpost)
                    .expect(201)

        const newresponse = await api.get("/api/blogs")
        const newlength = newresponse.body.length

        assert.strictEqual(length + 1, newlength)
    })

    test("likes default to 0", async () => {
        const newpost = {
            title: "mäxä",
            author: "pekka",
            url: "www.tiini.com",
        }

        const response = await api.post("/api/blogs")
                                    .set("Authorization", `Bearer ${token}`)
                                    .send(newpost)
                                    .expect(201)
        assert.strictEqual(response.body.likes, 0)
    })

    test("missing title or url gets 400 bad request response", async () => {
        const postnotitle = {
            author: "pekka",
            url: "www.tiini.com",
            likes: 0
        }
        await api.post("/api/blogs")
                    .set("Authorization", `Bearer ${token}`)
                    .send(postnotitle)
                    .expect(400)

        const postnourl = {
            title: "tolppa",
            author: "pekka",
            likes: 0
        }
        await api.post("/api/blogs")
                    .set("Authorization", `Bearer ${token}`)
                    .send(postnourl)
                    .expect(400)
    })

    test("delete request deletes the blog", async () => {
        const blogs = await api.get("/api/blogs")
        const id = blogs.body[0].id
        await api.delete(`/api/blogs/${id}`)
                    .set("Authorization", `Bearer ${token}`)
                    .expect(204)

        const newblogs = await api.get("/api/blogs")
        const all_ids = newblogs.body.map(blog => blog.id)

        assert(!all_ids.includes(id))
        assert.strictEqual(newblogs.body.length, blogs.body.length - 1)
    })

    test("patch updates likes", async () => {
        const blogs = await api.get("/api/blogs")
        const id = blogs.body[0].id
        const response = await api.patch(`/api/blogs/${id}`).send({likes: 13}).expect(200)

        assert.strictEqual(response.body.likes, 13)
    })

    after(async () => {
    await mongoose.connection.close()
    })


})

