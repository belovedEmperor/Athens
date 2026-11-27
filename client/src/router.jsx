import App from "./App";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage";
import Settings from "./components/Settings";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "auth",
        children: [
          {
            path: "register",
            element: <RegisterForm />,
          },
          {
            path: "login",
            element: <LoginForm />,
          },
        ],
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
];

export default routes;
