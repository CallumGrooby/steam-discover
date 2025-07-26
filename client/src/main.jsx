import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Landing } from "./pages/Landing.jsx";
import { UserProfile } from "./pages/UserProfile.jsx";

import gsap from "gsap"; // <-- import GSAP
import { useGSAP } from "@gsap/react"; // <-- import the hook from our React package

gsap.registerPlugin(useGSAP);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    errorElement: <div>Oops! Something went wrong.</div>,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/user/:userId", element: <UserProfile /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
