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

    updateDefaultBio(newBio) {
        this.setState({ defaultBio: newBio });
    }

    toggleEditor() {
        this.setState({
            showTextArea: !this.state.showTextArea,
        });
        console.log("this toggle state", this.state.showTextArea);
    }

    submitBio(event) {
        const newBio = event.target.bio.value;
        fetch("/api/bio", {
            method: "POST",
            body: JSON.stringify({
                bio: newBio,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data at data", data);
                this.props.updateBio(data.bio);
            })
            .catch((error) => console.log("submitBIO we are here now", error));

        this.setState({
            showTextArea: false,
        });
    }

    render() {
        console.log("propseditor", this.props);
        return (
            <div className="bioeditor">
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
                        <textarea
                            name="bio"
                            defaultValue={this.props.user.bio}
                            onInput={this.updateDefaultBio}
                        ></textarea>
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
