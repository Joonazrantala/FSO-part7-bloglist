import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/notification";
import Togglable from "./components/togglable";
import NewBlogForm from "./components/newBlogForm";
import Blog from "./components/Blog";
import { clearNotification, setNotification } from "./reducers/notificationReducer";
import { setBlogs } from "./reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  
  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll();
      blogs.sort((a, b) => b.likes - a.likes)
      console.log(blogs)
      dispatch(setBlogs(blogs));
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification({message: "Unauthorized login", type: "error"}));
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.postBlog(blogObject, user.token);
      newBlog.user = { ...user };
      setBlogs(blogs.concat(newBlog));
      dispatch(setNotification({
        message: `A new blog "${blogObject.title}" by ${blogObject.author} added!`,
        type: "success"
      }))
      setTimeout(() => dispatch(clearNotification()), 5000);
    } catch {
      dispatch(setNotification({
        message: "Failed to create blog",
        type: "error"
      }))
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };

  const handleDelete = (idtodelete) => {
    setBlogs(blogs.filter((blog) => blog.id !== idtodelete));
  };

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
  );

  /*const fetchMyBlogs = async () => {
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
  }*/

  

  const logoutButton = (props) => {
    return (
      <button type="button" onClick={handleLogout}>
        LOG OUT
      </button>
    );
  };

  return (
    <div>
      <h1>Blogs</h1>
      <Notification/>
      {!user && <h2>Log in to application</h2>}

      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in {logoutButton()}
          </p>
          <Togglable buttonLabel="New blog">
            <NewBlogForm createBlog={createBlog} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
