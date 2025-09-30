const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const User = require('../models/user')

const api = supertest(app)

const initialuser = {
    username: "Zezima",
    password: "Secret",
    name: "Mikael Kaaronen"
}

describe.only("user API tests", () => {
    before(async () => {
    await mongoose.connect(MONGODB_URI)
    await mongoose.connection.db.dropDatabase()
})
    beforeEach(async () => {
        await User.deleteMany({})
        const usersAfterDelete = await User.find({})
        console.log("Users after deleteMany:", usersAfterDelete)
        await api.post("/api/users").send(initialuser)
    })

    test("users are returned as json", async () => {
        const response = await api.get("/api/users").expect(200).expect('Content-Type', /application\/json/)
        console.log(response.body)
        assert.strictEqual(response.body.length, 1)
    })

    test("successful POST", async () => {
        const newuser = {
            username: "käyttäjänimi",
            password: "salasana",
            name: "Tolppa Kaaronen"
        }

        const users = await api.get("/api/users")

        const response = await api.post("/api/users").send(newuser).expect(201)

        const newusers = await api.get("/api/users")

        assert.strictEqual(newusers.body.length, users.body.length + 1)
    })

    test("username and password have to be unique", async () => {
        const newuser = {
            username: "käyttäjänimi",
            password: "salasana",
            name: "Tolppa Kaaronen"
        }
        await api.post("/api/users").send(newuser).expect(201)
        await api.post("/api/users").send(newuser).expect(400)
    })

    test("not able to create user without username or password", async () => {
        const newuser = {
            password: "salasana",
            name: "Tolppa Kaaronen"
        }
        await api.post("/api/users").send(newuser).expect(400)
        const newuser2 = {
            username: "käyttäjänimi",
            name: "Tolppa Kaaronen"
        }
        await api.post("/api/users").send(newuser2).expect(400)

        const usersAtEnd = await api.get("/api/users")
        assert.strictEqual(usersAtEnd.body.length, 1)
    })

    test("not able to create user with less than 3 characters", async () => {
        const newuser = {
            username: "12",
            password: "sanasana",
            name: "Jee Jee"
        }

        await api.post("/api/users").send(newuser).expect(400)
    })

    after(async () => {
    await mongoose.connection.close()
    })

})

