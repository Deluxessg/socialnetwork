import { Component } from "react";
import { Link } from "react-router-dom";

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    onFormSubmit(event) {
        event.preventDefault();
        // console.log("debug1");
        const formData = {
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            email: event.target.email.value,
            password: event.target.password.value,
        };
        fetch("/api/users", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json)
            .then((data) => {
                console.log(data);
                window.location.href = "/";
            })
            .catch((error) =>
                console.log("error at onformsubmit/fetch", error)
            );
    }
    render() {
        return (
            <div className="register-from">
                <form onSubmit={this.onFormSubmit}>
                    <input
                        name="first_name"
                        type="text"
                        required
                        placeholder="first name"
                    ></input>
                    <input
                        name="last_name"
                        type="text"
                        required
                        placeholder="last name"
                    ></input>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="email"
                    ></input>
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="passwork"
                    ></input>
                    <div>
                        <button className="reg-button">Register</button>
                    </div>
                    <div className="reg-link">
                        <Link className="register-link" to="/login">
                            Click here to Log in!
                        </Link>
                    </div>
                </form>
            </div>
        );
    }
}
