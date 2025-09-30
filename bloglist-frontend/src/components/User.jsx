import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText } from "@mui/material";

const User = () => {
  const users = useSelector((state) => state.users.userlist);
  const id = useParams().id;
  const user = users.find((user) => user.id === id);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h4>Blogs written:</h4>
      <List>
      {user.blogs.map((blog) => (
        <ListItem key={blog.id}>
          <ListItemText primary={blog.title} />
        </ListItem>
      ))}
    </List>
      <Link to="/users">Back</Link>
    </div>
  );
};

export default User;
