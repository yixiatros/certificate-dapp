import { createBrowserRouter } from "react-router";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import SigninPage from "../Pages/SignInPage/SignInPage";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {path: "", element: <HomePage />},
            {path: "SignIn", element: <SigninPage/>},
            {path: "Privacy Policy", element: <PrivacyPolicy/>}
        ]
    }
])