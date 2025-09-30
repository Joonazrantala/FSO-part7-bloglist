import { useState } from "react";
import blogService from "../services/blogs";
import { useDispatch, useSelector } from "react-redux";
import {
  setNotification,
  clearNotification,
  newNotification,
} from "../reducers/notificationReducer";
import { likeBlog, deleteBlog, addComment } from "../reducers/blogReducer";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const Blog = (props) => {
  const [comment, setComment] = useState("");
  const id = useParams().id;
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (!blog) return <div>Blog not found</div>;
  const likes = blog.likes;
  const canDelete = blog.user.id === props.user.id;

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(`Delete "${blog.title}"?`);
    if (!confirmDelete) return;

    try {
      const response = await blogService.deleteBlog(blog.id, props.user.token);
      dispatch(deleteBlog(blog.id));
      dispatch(newNotification(`Blog ${blog.title} deleted`, "success", 5000));
      navigate("/");
    } catch {
      dispatch(newNotification("Can't delete blog", "error", 5000));
    }
  };

  const handleLikeClick = async () => {
    const blogObject = {
      user: blog.user.id,
      title: blog.title,
      likes: likes + 1,
      author: blog.author,
      url: blog.url,
    };

    try {
      const update = await blogService.updateBlog(
        blog.id,
        blogObject,
        props.user.token,
      );
      dispatch(likeBlog(blog.id));
      dispatch(newNotification("Blog liked", "success", 5000));
    } catch (exception) {
      dispatch(newNotification("Can't like blog", "error", 5000));
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();
    await blogService.postComment(blog.id, comment);
    dispatch(addComment({ id: blog.id, comment }));
    setComment("");
  };

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>URL</strong>
              </TableCell>
              <TableCell>{blog.url}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Likes</strong>
              </TableCell>
              <TableCell>
                {likes} <Button variant="contained" color="primary" type="submit" onClick={handleLikeClick}>Like</Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>User</strong>
              </TableCell>
              <TableCell>{blog.user.name}</TableCell>
            </TableRow>

            {canDelete && (
              <TableRow>
                <TableCell>
                  <strong>Delete</strong>
                </TableCell>
                <TableCell>
                  <Button onClick={handleDeleteClick}>Delete</Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div>
        <h3>Comments</h3>
        <form onSubmit={handleComment}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button variant="contained" color="primary" type="submit" >Post comment</Button>
        </form>

        <ul>
          {blog.comments.map((c, i) => (
            <li key={i}>{c.comment}</li>
          ))}
        </ul>
      </div>

      <div>
        <Button variant="contained" color="primary" type="submit" onClick={() => navigate("/")}>Back to bloglist</Button>
      </div>
    </div>
  );
};

export default Blog;
