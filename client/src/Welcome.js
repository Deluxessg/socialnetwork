import RegisterForm from "./RegisterForm";
import LoginForm from "./login";

import { BrowserRouter, Route, Link } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="welcome">
            <h1>Welcome to the social network!</h1>

            <BrowserRouter>
                <Route exact path="/">
                    <div>
                        <RegisterForm />
                    </div>
                </Route>

                <Route path="/login">
                    <div>
                        <LoginForm />
                        <Link to="=reset">Reset Password</Link>
                    </div>
                </Route>
            </BrowserRouter>
        </div>
    );
}
