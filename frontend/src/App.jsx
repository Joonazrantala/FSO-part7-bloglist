import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/notification";
import Togglable from "./components/togglable";
import NewBlogForm from "./components/newBlogForm";
import Blog from "./components/Blog";
import { useContext } from "react";
import NotificationContext from "../context/notificationContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserContext from "../context/UserContext";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, userDispatch] = useContext(UserContext);
  const queryClient = useQueryClient();
  const { notification, setNotification } = useContext(NotificationContext);

  const newBlogMutation = useMutation({
    mutationFn: ({ blog, token }) => blogService.postBlog(blog, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setNotification("A new blog added", "success");
    },
    onError: () => {
      setNotification("Can't add blog", "error");
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: ({ id, token }) => blogService.deleteBlog(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setNotification("Blog deleted", "success");
    },
    onError: () => {
      setNotification("Can't delete blog", "error");
    },
  });

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const data = await blogService.getAll();
      return data.sort((a, b) => b.likes - a.likes);
    },
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "SET", payload: user });
    }
  }, []);

  if (isLoading) {
    return <div>loading data...</div>;
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      console.log(user);
      userDispatch({ type: "SET", payload: user });

      setUsername("");
      setPassword("");
    } catch (exception) {
      setNotification("Wrong credentials", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    userDispatch({ type: "CLEAR" });
  };

  const createBlog = async (blogObject) => {
    blogObject.user = { ...user };
    newBlogMutation.mutate({
      blog: blogObject,
      token: user.token,
    });
  };

  const handleDelete = (blog) => {
    console.log(blog);
    deleteBlogMutation.mutate({ id: blog.id, token: user.token });
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
