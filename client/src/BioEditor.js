import { Component } from "react";

export default class Bio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTextArea: false,
            defaultBio: "",
        };
    }

    updateDefaultBio(event) {
        this.setState({ defaultBio: event.target.value });
    }

    toggleEditor() {
        this.setState({
            showTextArea: !this.state.showTextArea,
        });
    }

    submitBio() {
        fetch("/api/bio", {
            method: "POST",
            body: JSON.stringify({
                bio: this.state.defaultBio,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.update(data.bio);
            })
            .catch((error) => console.log("submitBIO", error));

        this.setState({
            showTextArea: false,
        });
    }

    render() {
        return (
            <>
                {this.state.showTextArea && (
                    <textarea defaultValue={this.props.bio}></textarea>
                )}
                {!this.state.showTextArea && <p>{this.props.bio}</p>}

                <button>Edit Bio</button>
            </>
        );
    }
}
