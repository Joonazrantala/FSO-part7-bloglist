import Blog from "./Blog";
import Togglable from "./togglable";
import NewBlogForm from "./newBlogForm";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

const Bloglist = ({ user, handleCreateBlog, handleDelete }) => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <div>
      <Togglable buttonLabel="New blog">
        <NewBlogForm handleCreateBlog={handleCreateBlog} user={user} />
      </Togglable>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} by {blog.author}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Bloglist;
