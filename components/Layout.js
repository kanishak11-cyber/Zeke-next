import React, { useContext } from "react";
import Head from "next/head";
import { TiShoppingCart } from "react-icons/ti";
import NextLink from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  Badge,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemText,
  InputBase,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";

import { Store } from "../utils/Store";
import { getError } from "../utils/error";
import Cookies from "js-cookie";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useEffect } from "react";

export default function Layout({ title, description, children }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "1.4rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
    },
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });
  // const classes = useStyles();

  const [sidbarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  const [query, setQuery] = useState("");
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
    const newDarkMode = !darkMode;
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    Cookies.remove("shippinhAddress");
    Cookies.remove("paymentMethod");
    router.push("/");
  };
  return (
    <div className="justify-between h-full text-white text-lg gradient-bg-welcome">
      <Head>
        <title>{title ? `${title} - ZEKE` : "ZEKE"}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="text-white h-full">
          <AppBar position="static" className="bg-[#203040] ">
            <Toolbar className="justify-between bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
              <Box className="flex items-center">
                <div className="text-xl p-5 items-center justify-center">
                  <IconButton
                    edge="start"
                    aria-label="open drawer"
                    onClick={sidebarOpenHandler}
                    className="mt-4 p-0"
                  >
                    <MenuIcon className="text-white " />
                  </IconButton>
                </div>
                <NextLink href="/" passHref>
                  <Link>
                    <div className="border-2 p-2 text-2xl text-white">
                      <Typography className="flex-1 flex flex-row">
                        <span className="mr-1 justify-center p-2 text-2xl">
                          Z
                        </span>
                        <h1 className="text-3xl justify-center">|</h1>
                        <span className="mr-1 justify-center p-2 text-2xl">
                          {" "}
                          ZEKE
                        </span>
                      </Typography>
                    </div>
                  </Link>
                </NextLink>
              </Box>
              <Drawer
                anchor="left"
                open={sidbarVisible}
                onClose={sidebarCloseHandler}
              >
                <List>
                  <ListItem>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography>Shopping by category</Typography>
                      <IconButton
                        aria-label="close"
                        onClick={sidebarCloseHandler}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  <Divider light />
                  {categories.map((category) => (
                    <NextLink
                      key={category}
                      href={`/search?category=${category}`}
                      passHref
                    >
                      <ListItem
                        button
                        component="a"
                        onClick={sidebarCloseHandler}
                      >
                        <ListItemText primary={category}></ListItemText>
                      </ListItem>
                    </NextLink>
                  ))}
                </List>
              </Drawer>

              <div className="w-full p-2 text-white flex flex-row flex-1">
                <form
                  onSubmit={submitHandler}
                  className="border-2 flex flex-row flex-1 justify-center font-sans blue-glassmorphism rounded-full w-full"
                >
                  <div>
                    <IconButton type="submit" className="" aria-label="search">
                      <SearchIcon className="text-white " />
                    </IconButton>
                  </div>
                  <div className=" justify-center w-full ">
                    <InputBase
                      name="query"
                      className="  m-1 w-full rounded-full p-1"
                      placeholder="Search products..."
                      onChange={queryChangeHandler}
                    />
                  </div>
                </form>
              </div>
              {/* <div className="flex flex-1 flex-row justify-items-end "> */}
              <div className="p-2 ">
                <Switch
                  className="p-1 "
                  checked={darkMode}
                  onChange={darkModeChangeHandler}
                />
              </div>

              <NextLink href="/cart" passHref>
                <Link>
                  <div className="text-xl text-white justify-center p-2">
                    <Typography component="span">
                      {cart.cartItems.length > 0 ? (
                        <Badge
                          color="secondary"
                          badgeContent={cart.cartItems.length}
                        >
                          <h1 className="text-5xl">
                            <TiShoppingCart className="text-white" />
                          </h1>
                        </Badge>
                      ) : (
                        <TiShoppingCart className="text-white text-5xl" />
                      )}
                    </Typography>
                  </div>
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className="text-white"
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, "/profile")}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, "/order-history")
                      }
                    >
                      Order Hisotry
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, "/admin/dashboard")
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>
                    <div className="text-2xl">
                      <Typography component="span">
                        <h1 className="">Login</h1>
                      </Typography>
                    </div>
                  </Link>
                </NextLink>
              )}
              {/* </div> */}
            </Toolbar>
          </AppBar>
        </div>
        <Container className="">{children}</Container>
        <footer className="justify-center mt-3 text-center border-t-2 h-full items-center">
          <div className='flex flex-row flex-1 justify-between px-2 mt-3'>
            <h1> ©  All Right Reserved 2022</h1>
            <h1 className="border-2 p-2 ">Z | Z E K E</h1>
          </div>
                <div className='flex flex-1 flex-row justify-center px-2 '>
                  <h1 className='justify-between w-full m-2'>Made By ❤ </h1>
          <h3 className='justify-between w-full m-2'>Developers </h3>
          </div>
          
          <div className="flex flex-1 flex-row w-full px-2 justify-center text-center text-sm">
            <h3 className='justify-between w-full m-2'>Kanishak Chaurasia</h3>
            <h3 className='justify-between w-full m-2'>Gargi Tiwari</h3>
            <h3 className='justify-between w-full m-2'>Kaustubh singh</h3>
          </div>
        </footer>
      </ThemeProvider>
    </div>
  );
}
