import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/notification'
import Togglable from './components/togglable'
import NewBlogForm from './components/newBlogForm'
import Blog from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    if (user) {
      fetchMyBlogs()
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      setUser(user)
      setUsername("")
      setPassword("")
    }
    catch (exception) {
      setErrorMessage("Wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);

    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.postBlog(blogObject, user.token)
      setBlogs(blogs.concat(newBlog))
      setSuccessMessage(`A new blog "${blogObject.title}" by ${blogObject.author} added!`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch {
      setErrorMessage('Failed to create blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleDelete = (idtodelete) => {
    setBlogs(blogs.filter(blog => blog.id !== idtodelete))
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
  )
  
  const fetchMyBlogs = async () => {
    try {
      const myBlogs = await blogService.getUserBlogs(user.token)
      console.log(myBlogs)
      myBlogs.sort((a,b) => {
        if (a.likes > b.likes) {
          return -1
        } 
        if (a.likes < b.likes) {
          return 1
        }
        return 0
      })

      setBlogs(myBlogs)

    } catch (error) {
      console.error('Failed to fetch user blogs', error)
    }
  }

  const logoutButton = (props) => {
    return (
      <button type="button" onClick={handleLogout}>LOG OUT</button>
    )
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={successMessage} type="success"/>
      <Notification message={errorMessage} type="error"/>
      {!user && <h2>Log in to application</h2>}
      
    {!user && loginForm()}
    {user && 
    <div>
      <p>{user.name} logged in {logoutButton()}</p>
      <Togglable buttonLabel="New blog">
        <NewBlogForm
          createBlog={createBlog}
              />
      </Togglable>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog} 
          user={user} 
          onDelete={handleDelete}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
          />
      )}
    </div>
    }
    </div>
  )
}

export default App