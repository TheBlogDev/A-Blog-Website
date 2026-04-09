import { useBlogpostsContext } from "../hooks/useBlogpostsContext";
import { useMemo } from "react";
import useFetch from "../useFetch.ts";
import { Button, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { motion } from "framer-motion";
import { useAuthContext } from "../hooks/useAuthContext";

// date fns
import { formatDistanceToNow } from "date-fns";
import Loader from "./Loader";

export interface Blogpost {
  _id: string;
  title: string;
  author?: { _id: string; email: string };
  blogpost: string;
  createdAt: string;
}


interface BlogPostProps {
  blogpost: Blogpost;
  setShowModal?: (value: boolean) => void;
}

const BlogDetails = ({ blogpost }: BlogPostProps ) => {
  const { title, author, createdAt } = blogpost;
  const { user } = useAuthContext();
  const { dispatch } = useBlogpostsContext();
  const headers = useMemo(() => {
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  }, [user?.token]);
  const fetchUrl = "https://gentle-plateau-25780.herokuapp.com/api/blogpost/";
  const { data: blog, error, isPending } = useFetch(fetchUrl, headers);

  const detailsBlogPost = async () => {
    if (!user) {
      return;
    }
    const response = await fetch(
      "https://gentle-plateau-25780.herokuapp.com/api/blogposts/" +
        blogpost._id,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "SET_BLOGPOSTS", payload: json });
    }
  };

  const deleteBlogPost = async () => {
    if (!user) {
      return;
    }
    const response = await fetch(
      "https://gentle-plateau-25780.herokuapp.com/api/blogposts/" +
        blogpost._id,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_BLOGPOST", payload: json });
    }
  };

  return (
    <motion.div
      className="blogpost-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {isPending && (
        <div>
          <Loader />
        </div>
      )}
      {error && <div>{error}</div>}
      {blog && (
        <article>
          <Typography variant="h3" align="left">
            {title}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Written by {author?.email}</strong> 
          </Typography>
          <Typography variant="subtitle2">
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
            })}
          </Typography>
          <span>
            <Button
              className="seemore-btn"
              color="secondary"
              variant="contained"
              aria-label="see-more"
              onClick={detailsBlogPost}
            >
              <MoreHorizIcon fontSize="small" />
              See More
            </Button>
          </span>
          {user && (
            <span>
              <Button
                color="secondary"
                variant="contained"
                aria-label="delete"
                onClick={deleteBlogPost}
              >
                <RemoveIcon fontSize="small" />
                Delete
              </Button>
            </span>
          )}
        </article>
      )}
    </motion.div>
  );
};

export default BlogDetails;
