import { Component } from "react";
import ProfilePicture from "./ProfilePicture";
import PictureModal from "./PictureModal";
import FindPeople from "./FindPeople";
import Profile from "./Profile";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import OtherProfile from "./OtherProfile";
import Friends from "./Friends";
import Chat from "./Chat";

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
        fetch("/api/users/me")
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

    logout() {
        console.log("logoutbutton clicked");
        fetch("/api/logout", {
            method: "POST",
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                window.location.href = "/";
            });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    <header>
                        <div className="header-logo-div">
                            <img
                                className="header-logo"
                                src="/media/logo2.png"
                            />
                        </div>
                        <div className="header-a">
                            <div className="home">
                                <NavLink to="/">Home </NavLink>
                            </div>
                            <div className="home">
                                <NavLink to="/people"> Find People</NavLink>
                            </div>
                            <div className="home">
                                <NavLink to="/friends">Friends</NavLink>
                            </div>
                            <div className="home">
                                <NavLink to="/chat">Chat</NavLink>
                            </div>
                        </div>
                        <h2>{this.state.user.first_name}</h2>
                        <h2>{this.state.user.last_name}</h2>
                        <div>
                            <ProfilePicture
                                onButtonClick={this.onButtonClick}
                                profile_picture_url={
                                    this.state.user.profile_picture_url
                                }
                            />
                            {this.state.showModal && (
                                <PictureModal
                                    uploadPicture={this.uploadPicture}
                                    uploadClose={this.uploadClose}
                                />
                            )}
                            <button
                                className="logout-btn"
                                onClick={this.logout}
                            >
                                Logout
                            </button>
                        </div>
                    </header>
                    <section>
                        <Route path="/" exact>
                            <div>
                                <Profile
                                    user={this.state.user}
                                    updateBio={this.updateBio}
                                />
                            </div>
                        </Route>
                        <Route path="/people">
                            <FindPeople />
                        </Route>
                        <Route path="/users/:user_id">
                            <OtherProfile />
                        </Route>
                        <Route path="/friends">
                            <Friends />
                        </Route>
                        <Route path="/chat">
                            <Chat />
                        </Route>
                    </section>
                </div>
                <footer>&copy; Crucial Footer</footer>
            </BrowserRouter>
        );
    }
}
