import { Component } from "react";
import ProfilePicture from "./ProfilePicture";
import PictureModal from "./PictureModal";
import Profile from "./Profile";
import { BrowserRouter, Route, Link, NavLink } from "react-router-dom";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            showModal: false,
        };

        this.onButtonClick = this.onButtonClick.bind(this);
        this.uploadClose = this.uploadClose.bind(this);
        this.uploadPicture = this.uploadPicture.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }
    componentDidMount() {
        fetch("api/users/me")
            .then((result) => result.json())
            .then((data) => {
                this.setState({ user: data });
            });
    }
    onButtonClick() {
        this.setState({
            showModal: true,
        });
    }

    uploadClose() {
        this.setState({
            showModal: false,
        });
    }

    uploadPicture(picture) {
        this.setState({
            user: { ...this.state.user, profile_picture_url: picture },
        });
    }

    updateBio(bio) {
        this.setState({
            user: { ...this.state.user, bio: bio },
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    <header>
                        <div className="header-a">
                            <NavLink to="/">Home</NavLink>
                        </div>
                        <h1>Hello!!</h1>

                        <ProfilePicture
                            onButtonClick={this.onButtonClick}
                            profile_picture_url={
                                this.state.user.profile_picture_url
                            }
                        />
                    </header>
                    {this.state.showModal && (
                        <PictureModal
                            uploadPicture={this.uploadPicture}
                            uploadClose={this.uploadClose}
                        />
                    )}
                    <div>
                        <Route path="/" exact>
                            <Profile
                                user={this.state.user}
                                updateBio={this.updateBio}
                            />
                        </Route>
                    </div>
                    <footer> &copy Sausage inc.</footer>
                </div>
            </BrowserRouter>
        );
    }
}
