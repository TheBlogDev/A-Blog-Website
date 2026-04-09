import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useLogout } from "../hooks/useLogout.tsx";
import { useAuthContext } from "../hooks/useAuthContext.tsx";
import SideBar from "./SideBar.tsx";
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';

const leftNavVariants = {
  hidden: {
    x: -550, 
    opacity: 0,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.25,
      type: "spring",
      mass: 0.4,
      damping: 8,
      stiffness: 90,
      staggerDirection: -1,
    },
  },
};

const rightNavVariants = {
  hidden: {
    x: 550,
    opacity: 0,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.25,
      type: "spring",
      mass: 0.4,
      damping: 8,
      stiffness: 90,
      staggerDirection: -1,
    },
  },
};

const imgVariant = {
  hidden: { opacity: 0, y: -200 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.25,
    },
  },
};

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [isSideBarVisible, setIsSideBarVisible] = useState(false);

  const handleClick = () => {
    logout();
  };

  function toggleSideBar() {
    setIsSideBarVisible(!isSideBarVisible);
  }

  useEffect(() => {
    if (!isMobileOrTablet && isSideBarVisible) {
      setIsSideBarVisible(false);
    }
  }, [isMobileOrTablet, isSideBarVisible]);

  return (
    <nav className="navbar">
      <div
        style={{ display: "flex", alignItems: "center", paddingRight: "1rem" }}
      >
        <motion.ul variants={imgVariant} initial="hidden" animate="visible">
        <Link to="/">
          <Avatar
            id="avatar"
            alt="Logo of Coffee Cup"
          ><EmojiFoodBeverageIcon fontSize="large"/></Avatar>
        </Link>
        </motion.ul>
        <motion.div
          variants={leftNavVariants}
          initial="hidden"
          animate="visible"
          style={{ paddingLeft: "1.25rem" }}
        >
          <Typography variant="h1">A Developer's Blog</Typography>

          <Typography variant="h6" className="date">
            A space for helping others in the tech industry.
          </Typography>
          <Typography variant="subtitle1" className="date">
            {format(new Date(), "MMMM do y")}
          </Typography>
        </motion.div>
      </div>
      <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
        <motion.div
          className="links"
          variants={rightNavVariants}
          initial="hidden"
          animate="visible"
        >
          {user && (
            <Container>
              <span
                style={{
                  fontWeight: "600",
                  color: "white",
                  opacity: "0.8",
                }}
              >
                {user.email}
              </span>
              <Link to="/dashboard" style={{ paddingRight: "1.25rem" }}>
                Dashboard
              </Link>
              <Button
                onClick={handleClick}
                color="secondary"
                variant="outlined"
                to="/"
                component={Link}
              >
                Logout
              </Button>
            </Container>
          )}
          {!user && (
            <span>
              <Link to="/login">Login</Link>
              <Link to="/subscribe">Subscribe</Link>
            </span>
          )}
          <Link to="/faq">Faq</Link>
          <Link to="/contact">Contact</Link>
        </motion.div>
      </Box>
      {isMobileOrTablet && !isSideBarVisible && (
        <Button
          color="secondary"
          variant="contained"
          aria-label="Sidebar button"
          onClick={toggleSideBar}
          sx={{ display: { xs: "block", sm: "block", md: "none" } }}
        >
          <div
            style={{
              height: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <div
              style={{ backgroundColor: "black", width: 35, height: 3 }}
            ></div>
            <div
              style={{ backgroundColor: "black", width: 35, height: 3 }}
            ></div>
            <div
              style={{ backgroundColor: "black", width: 35, height: 3 }}
            ></div>
          </div>
        </Button>
      )}
      {isMobileOrTablet && isSideBarVisible && (
        <SideBar toggleSideBar={toggleSideBar} />
      )}
    </nav>
  );
};

export default Navbar;
