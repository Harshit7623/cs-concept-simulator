import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import Workspace from "../pages/Workspace";
export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/workspace/*", element: <Workspace /> },
]);
