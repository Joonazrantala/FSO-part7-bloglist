import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/notification";
import Togglable from "./components/togglable";
import NewBlogForm from "./components/newBlogForm";
import Blog from "./components/Blog";
import { useContext } from "react";
import NotificationContext from "../context/notificationContext";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const { notification, setNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (user) {
      fetchAllBlogs();
    }
  }, [user]);

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
      setNotification("Wrong credentials", "error");
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
      setNotification(
        `A new blog "${blogObject.title}" by ${blogObject.author} added!`,
        "success",
      );
    } catch {
      setNotification("Failed to add blog", "error");
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

  const fetchAllBlogs = async () => {
    try {
      const allBlogs = await blogService.getAll();
      allBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(allBlogs);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
  };

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
      <Notification message={notification.message} type={notification.type} />
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
