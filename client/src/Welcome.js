import RegisterForm from "./RegisterForm";
import LoginForm from "./login";
// import LOGO from "./logo/logo.png";

import { BrowserRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="welcome">
            <div className="welcome-text">
                <h1>Welcome to the Coding Community!</h1>
            </div>
            <div className="logo">
                <img src="/media/logo2.png" />
            </div>

            <BrowserRouter>
                <Route exact path="/">
                    <div>
                        <RegisterForm />
                    </div>
                </Route>

                <Route path="/login">
                    <div>
                        <LoginForm />
                    </div>
                </Route>
            </BrowserRouter>
        </div>
    );
}
