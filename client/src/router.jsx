import App from "./App";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
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
    ],
  },
];

export default routes;
