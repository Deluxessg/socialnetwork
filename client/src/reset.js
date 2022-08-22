import { Component } from "react";
import { Link } from "react-router-dom";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            error: "",
        };
        this.stepDisplay = this.stepDisplay.bind(this);
        this.onEmailSubmit = this.onEmailSubmit.bind(this);
        this.onCodeSubmit = this.onCodeSubmit.bind(this);
    }

    stepDisplay() {
        const { step } = this.state;
        if (step === 1) {
            return (
                <div>
                    <form onSubmit={this.onEmailSubmit}>
                        <input name="email" type="email" placeholder="email" />
                        <button>Request Code</button>
                    </form>
                </div>
            );
        } else if (step === 2) {
            return (
                <div>
                    <form onSubmit={this.onCodeSubmit}>
                        <input
                            name="code"
                            type="number"
                            placeholder="Verification Code"
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="password"
                        />
                        <button>Verify</button>
                    </form>
                </div>
            );
        } else if (step === 3) {
            <div>Password has been changed!</div>;
        }
    }
    onEmailSubmit(event) {
        event.preventDefault();

        fetch("/password/reset/start", {
            method: "POST",
            body: JSON.stringify({ email: event.target.email.value }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    this.setState({
                        error: "Something went wrong",
                    });
                    return;
                }
                this.setState({ step: 2 });
            });
    }
    onCodeSubmit(event) {
        event.preventDefault();
        this.setState({ step: 3 });
    }
    render() {
        return (
            <div>
                <p>Check</p>
                {this.stepDisplay()}
            </div>
        );
    }
}
