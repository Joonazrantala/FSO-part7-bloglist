import { useState } from "react";
import blogService from "../services/blogs";
import { useDispatch, useSelector } from "react-redux";
import { setNotification, clearNotification } from "../reducers/notificationReducer";
import { likeBlog, deleteBlog } from "../reducers/blogReducer";

const Blog = (props) => {
  const [showAll, setShowAll] = useState(false);
  const likes = useSelector(state => state.blogs.find(b => b.id === props.blog.id)?.likes)
  const dispatch = useDispatch()

  const containerStyle = {
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
    maxWidth: 400,
    backgroundColor: showAll ? "#f9f9f9" : "#fff",
    color: "#333",
    fontFamily: "Arial, sans-serif",
  };

  const titleStyle = {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    color: "#222",
  };

  const infoStyle = {
    margin: "4px 0",
    fontSize: 14,
  };

  const buttonStyle = {
    marginTop: 10,
    padding: "6px 12px",
    backgroundColor: showAll ? "#c00" : "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(`Delete "${props.blog.title}"?`);
    if (!confirmDelete) return;

    try {
      const response = await blogService.deleteBlog(
        props.blog.id,
        props.user.token,
      );
      dispatch(deleteBlog(props.blog.id))
      dispatch(setNotification({
        message: `Blog ${props.blog.title} deleted`
      }));
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
      props.onDelete(props.blog.id);
    } catch {
      dispatch(setNotification({
        message: "Can't delete blog",
        type: "error"
      }));
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
    }
  };

  const handleLikeClick = async () => {
    if (props.onLike) {
      props.onLike();
    }

    const blogObject = {
      user: props.blog.user.id,
      title: props.blog.title,
      likes: likes + 1,
      author: props.blog.author,
      url: props.blog.url,
    };

    try {
      const update = await blogService.updateBlog(
        props.blog.id,
        blogObject,
        props.user.token,
      );
      dispatch(likeBlog(props.blog.id))

      dispatch(setNotification({
        message: "Blog liked",
        type: "success"
      }))
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
    } catch (exception) {
      dispatch(setNotification({
        message: "Can't handle blog likes",
        type: "error"
      }))
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const canDelete = props.blog.user.username === props.user.username;

  if (!showAll) {
    return (
      <div style={containerStyle}>
        <div style={titleStyle} className="blog">
          {props.blog.title} by {props.blog.author}
        </div>
        <button style={buttonStyle} onClick={toggleShowAll}>
          View
        </button>
      </div>
    );
  } else {
    return (
      <div style={containerStyle}>
        <div>
          {props.blog.title} by {props.blog.author}
        </div>
        <button style={buttonStyle} onClick={toggleShowAll}>
          View
        </button>
        <div style={infoStyle}>URL: {props.blog.url}</div>
        <div style={infoStyle}>
          Likes: {likes}
          <button onClick={handleLikeClick}>Like</button>
        </div>
        <div style={infoStyle}>User: {props.blog.user.name}</div>
        <div>
          {canDelete && <button onClick={handleDeleteClick}>Delete</button>}
        </div>
      </div>
    );
  }
};

export default Blog;
