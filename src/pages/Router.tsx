import { createBrowserRouter } from "react-router-dom";
import Root from "../Root";
import Home from "./Home";
import Tv from "./Tv";
import Search from "./Search";
import MovieDetail from "./MovieDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "tv",
        element: <Tv />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "/movies/:movieId",
        element: <MovieDetail />,
      },
    ],
  },
]);

export default router;
