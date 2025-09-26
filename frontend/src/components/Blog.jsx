import { useState } from "react";
import blogService from "../services/blogs";
import { useContext } from "react";
import NotificationContext from "../../context/notificationContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Blog = (props) => {
  const queryClient = useQueryClient();
  const [showAll, setShowAll] = useState(false);
  const { notification, setNotification } = useContext(NotificationContext);

  const likeMutation = useMutation({
    mutationFn: ({ id, blog, token }) =>
      blogService.updateBlog(id, blog, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setNotification("Blog liked", "success");
    },
    onError: () => setNotification("Can't like blog", "error"),
  });

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

  const handleDeleteClick = () => {
    if (window.confirm(`Delete "${props.blog.title}"?`)) {
      props.onDelete(props.blog);
    }
  };

  const handleLikeClick = () => {
    const blogToUpdate = { ...props.blog, likes: props.blog.likes + 1 };
    likeMutation.mutate({
      id: blogToUpdate.id,
      blog: blogToUpdate,
      token: props.user.token,
    });
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
          Likes: {props.blog.likes}
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
