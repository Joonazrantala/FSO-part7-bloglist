import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

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

  const Notification = ({ message, type }) => {
    if (!message) return null // Don’t show anything if there's no message

    const style = {
      color: type === 'error' ? 'red' : 'green',
      backgroundColor: type === 'error' ? '#fdd' : '#dfd',
      border: `1px solid ${type === 'error' ? 'red' : 'green'}`,
      fontSize: 20,
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
  }

    return (
      <div style={style}className="notification">
        {message}
      </div>
    )
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
      setBlogs(myBlogs)

    } catch (error) {
      console.error('Failed to fetch user blogs', error)
    }
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    try {
      const newblog = await blogService.postBlog(blogObject, user.token)
      setSuccessMessage(`A new blog ${title} by ${author} has been added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000);
    }
    catch (exception) {
      setErrorMessage("Can't add new blog")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    }
  }

  const newBlogForm = () => (
    <div>
    <h2>CREATE NEW</h2>
    <form onSubmit={handleNewBlog}>
      <div>
        title:
        <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div>
        author:
        <input
        type="text"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
        />
        </div>
        <div>
        url:
        <input
        type="text"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
    </div>
  )
  const Blog = (props) => {
    return (
        <p style={{ margin: 0, lineHeight: 1, color: 'red'}}>{props.blog.title} by {props.blog.author}</p>
    )
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
      {newBlogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog}/>
      )}
    </div>
    }
    </div>
  )
}

export default App