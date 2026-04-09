import { useRef, useState } from "react";
import { useBlogpostsContext } from "../hooks/useBlogpostsContext.tsx";
import { Button, Typography, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuthContext } from "../hooks/useAuthContext.tsx";

const BlogpostForm = () => {
  const { dispatch } = useBlogpostsContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [IsPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

  const authorRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const enteredAuthor = authorRef.current!.value;
    // const enteredTitle = titleRef.current!.value;
    // const enteredBody = bodyRef.current!.value;

    if (!user) {
      setError("You must be logged in");
      return;
    }
    const blogpost = { title, body, author };

    setIsPending(true);
    const response = await fetch(
      "https://gentle-plateau-25780.herokuapp.com/api/blogpost/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(blogpost),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields || []);
    }
    if (response.ok) {
      setTitle("");
      setBody("");
      setAuthor("");
      setError(null);
      setEmptyFields([]);
      console.log("new blogpost added", json);
      dispatch({ type: "CREATE_BLOGPOST", payload: json });
      setIsPending(false);
    }
  };

  return (
    <div className="create">
      <Typography variant="h5">Create New Blogpost</Typography>
      <form onSubmit={handleSubmit}>
        <div className="textfield-container">
          <TextField
            color="secondary"
            variant="outlined"
            fullWidth
            sx={{ pr: 2 }}
            type="text"
            value={title}
            label="Enter Blog Title"
            onChange={(e) => setTitle(e.target.value)}
            className={emptyFields.includes("title") ? "error" : ""}
            ref={titleRef}
          />
          <TextField
            color="secondary"
            label="Enter Author Name"
            type="text"
            fullWidth
            variant="outlined"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={emptyFields.includes("author") ? "error" : ""}
            ref={authorRef}
          />
        </div>
        <TextField
          color="secondary"
          value={body}
          fullWidth
          variant="outlined"
          label="Write up Blogpost here..."
          multiline
          minRows={4}
          onChange={(e) => setBody(e.target.value)}
          className={emptyFields.includes("body") ? "error" : ""}
          ref={bodyRef}
        />
        {!IsPending && (
          <Button type="submit" color="secondary" variant="contained">
            <AddIcon fontSize="small" />
            Add Blogpost
          </Button>
        )}
        {error && <div className="error">{error}</div>}
        {IsPending && (
          <Button color="secondary" variant="outlined" disabled>
            Adding Blogpost...
          </Button>
        )}
      </form>
    </div>
  );
};

export default BlogpostForm;
