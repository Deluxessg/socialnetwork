import { Component } from "react";

export default class Bio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTextArea: false,
            defaultBio: "",
        };
        this.updateDefaultBio = this.updateDefaultBio.bind(this);
        this.toggleEditor = this.toggleEditor.bind(this);
        this.submitBio = this.submitBio.bind(this);
    }

    updateDefaultBio(event) {
        this.setState({ defaultBio: event.target.value });
    }

    toggleEditor() {
        this.setState({
            showTextArea: !this.state.showTextArea,
        });
        console.log("this toggle state", this.state.showTextArea);
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
            <div>
                {this.props.user.bio && (
                    <div>
                        <p>{this.props.user.bio}</p>
                        <button onClick={this.toggleEditor}>Edit</button>
                    </div>
                )}
                {!this.props.user.bio && (
                    <button onClick={this.toggleEditor}>Add</button>
                )}
                {this.state.showTextArea && (
                    <form onSubmit={this.submitBio}>
                        <textarea onInput={this.updateDefaultBio}></textarea>
                        <button>Submit</button>
                    </form>
                )}
            </div>
        );
    }
}

//  return (
//      <div>
//          {this.state.showTextArea && (
//              <textarea defaultValue={this.props.bio}></textarea>
//          )}
//          {!this.state.showTextArea && <p>{this.props.bio}</p>}

//          <button>Edit Bio</button>
//      </div>
//  );
