import { Component } from "react";
import ProfilePicture from "./ProfilePicture";
import PictureModal from "./PictureModal";
import FindPeople from "./FindPeople";
import Profile from "./Profile";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import OtherProfile from "./OtherProfile";

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

    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    <header>
                        <nav className="header-a">
                            <NavLink to="/">Home </NavLink>
                            <NavLink to="/people"> Find People</NavLink>
                        </nav>
                        <h1>Hello!!</h1>

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
                    </section>
                </div>
                <footer> Crucial Footer</footer>
            </BrowserRouter>
        );
    }
}
