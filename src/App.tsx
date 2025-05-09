import { createBrowserRouter } from "react-router";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import CarDetail from "./Pages/Car";
import New from "./Pages/Dashboard/New";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { Private } from "./Routes/Private";
import User from "./Pages/User";


const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/Car/:id",
        element: <CarDetail/>
      },
      {
        path: "/Dashboard",
        element: <Private><Dashboard/></Private>
      },
      {
        path: "/Dashboard/New",
        element: <Private><New/></Private>
      },
      {
        path: "/User",
        element: <Private><User/></Private>
      }
    ]
  },
  {
    path: "/Login",
    element: <Login/>
  },
  {
    path: "/Register",
    element: <Register/>
  },
])

export { router }