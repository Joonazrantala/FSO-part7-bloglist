import { useState } from "react";
import blogService from "../services/blogs"

const NewBlogForm = ({ handleCreateBlog, user }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleNewBlog = (event) => {
    event.preventDefault();
    handleCreateBlog({
      title,
      author,
      url,
    });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>CREATE NEW</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
      <button onClick={ async () => {
                if (!window.confirm("Are you sure you want to delete all blogs?")) return
                await blogService.deleteAll(user.token)
              }
      }>Delete all user blogs</button> 
    </div>
  );
};

export default NewBlogForm;
