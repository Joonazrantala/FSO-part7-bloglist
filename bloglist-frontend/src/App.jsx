import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/notification";
import Togglable from "./components/togglable";
import NewBlogForm from "./components/newBlogForm";
import Blog from "./components/Blog";
import { clearNotification, setNotification } from "./reducers/notificationReducer";
import { setBlogs, createBlog, deleteBlog } from "./reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./reducers/userReducer";

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll();
      blogs.sort((a, b) => b.likes - a.likes)
      dispatch(setBlogs(blogs));
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON && loggedUserJSON !== "undefined") {
      const loggedUser = JSON.parse(loggedUserJSON);
      console.log("logged user", loggedUser)
      dispatch(setUser(loggedUser));
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(response));
      dispatch(setUser(response))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification({message: "Unauthorized login", type: "error"}));
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(setUser(null));
  };

  const handleCreateBlog = async (blogObject) => { // create new blog
    try {
      const newBlog = await blogService.postBlog(blogObject, user.token);
      newBlog.user = { ...user };
      dispatch(createBlog(newBlog))


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
    dispatch(deleteBlog(idtodelete))
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
            <NewBlogForm handleCreateBlog={handleCreateBlog} user={user}/>
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
