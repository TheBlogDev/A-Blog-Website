import { useBlogpostsContext } from "../hooks/useBlogpostsContext.tsx";
import { useAuthContext } from "../hooks/useAuthContext.tsx";

// components
import BlogDetails, { Blogpost } from "../components/BlogpostDetails.tsx";
import BlogpostForm from "../components/BlogpostForm.tsx";
import { Container } from "@mui/material";

interface DashboardProps {
  setShowModal: (value: boolean) => void;
}

const Dashboard = ({ setShowModal }: DashboardProps) => {
  const { blogposts } = useBlogpostsContext();
  const { user } = useAuthContext();
  if (user) {
    // @todo the types say the user can be null.
    // IF user is null at this point we need to handle that
    // with an error boundary ideally and let the app handle it
    // as we can't show blog posts if we have no user!
    const usersBlogposts = blogposts?.filter(
      (post) => post.author.email === user?.email
    );
    return (
      <Container className="home">
        <Container className="usersBlogposts">
          {usersBlogposts &&
            usersBlogposts?.map((blogpost: Blogpost) => {
              const { title, author, createdAt, _id } = blogpost;
              return (
                <BlogDetails
                  key={_id}
                  title={title}
                  author={author}
                  createdAt={createdAt}
                  blogpost={blogpost}
                  setShowModal={setShowModal}
                />
              );
            })}
        </Container>
        <BlogpostForm />
      </Container>
    );
  } else {
    return <>NO USER!</>;
  }
};

export default Dashboard;
