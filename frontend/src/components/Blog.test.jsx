import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import NewBlogForm from "./newBlogForm";

describe("blog renders", () => {
  const blog = {
    id: "1",
    title: "Testing title",
    likes: 0,
    author: "Testing author",
    url: "Testing url",
    user: { id: "u1", name: "Test user" },
  };
  const mockUser = { token: "fake-token", name: "Logged in user" };

  test("renders title and author", async () => {
    render(
      <Blog
        blog={blog}
        user={mockUser}
        setSuccessMessage={() => {}}
        setErrorMessage={() => {}}
        onDelete={() => {}}
      />,
    );

    const element = screen.getByText("Testing title by Testing author");
    expect(element).toBeDefined();
  });

  test("renders everything after button is pressed", async () => {
    render(
      <Blog
        blog={blog}
        user={mockUser}
        setSuccessMessage={() => {}}
        setErrorMessage={() => {}}
        onDelete={() => {}}
      />,
    );

    const user = userEvent.setup();
    const button = screen.getByText("View");
    await user.click(button);

    const urlelement = screen.getByText("URL: Testing url");
    const likeselement = screen.getByText("Likes: 0");
    const userelement = screen.getByText("User: Test user");

    expect(urlelement).toBeDefined();
    expect(likeselement).toBeDefined();
    expect(userelement).toBeDefined();
  });

  test("like button works", async () => {
    const mockHandler = vi.fn();

    render(
      <Blog
        blog={blog}
        user={mockUser}
        setSuccessMessage={() => {}}
        setErrorMessage={() => {}}
        onDelete={() => {}}
        onLike={mockHandler}
      />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByText("View"));
    const likeButton = screen.getByText("Like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler).toHaveBeenCalledTimes(2);
  });

  test("new blog form is called correctly", async () => {
    const mockHandler = vi.fn();
    render(<NewBlogForm createBlog={mockHandler}></NewBlogForm>);

    const user = userEvent.setup();

    const titleinput = screen.getAllByRole("textbox")[0];
    const authorinput = screen.getAllByRole("textbox")[1];
    const urlinput = screen.getAllByRole("textbox")[2];

    await user.type(titleinput, "test title");
    await user.type(authorinput, "test author");
    await user.type(urlinput, "test url");
    await user.click(screen.getByText("create"));

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler.mock.calls[0][0].title).toBe("test title");
    expect(mockHandler.mock.calls[0][0].author).toBe("test author");
    expect(mockHandler.mock.calls[0][0].url).toBe("test url");
  });
});
