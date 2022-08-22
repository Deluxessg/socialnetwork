import { Component } from "react";
import { Link } from "react-router-dom";

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    onFormSubmit(event) {
        event.preventDefault();
        const formData = {
            email: event.target.email.value,
            password: event.target.password.value,
        };
        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    this.setState({
                        error: "email and/or password not matching",
                    });
                    return;
                } else {
                    window.location.href = "/";
                }
            });
    }
    render() {
        return (
            <div>
                {this.state.error && <p>{this.state.error}</p>}

                <form onSubmit={this.onFormSubmit}>
                    <input
                        name="email"
                        type="email"
                        placeholder="email"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="password"
                    />
                    <button>Login</button>
                </form>
                <Link to="/reset">Reset your password</Link>
            </div>
        );
    }
}
