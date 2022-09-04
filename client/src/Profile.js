// import ProfilePicture from "./ProfilePicture";
import Bio from "./BioEditor";

export default function Profile(props) {
    // console.log("propsinprofile", props);

    function deleteAccount() {
        fetch("/api/delete-account", {
            method: "POST",
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                window.location = "/";
            });
    }

    return (
        <div className="profile-container">
            <div className="profile-img">
                <h2>Profile</h2>
                <img src={props.user.profile_picture_url} />
            </div>
            <div className="profile-name">
                <h3>{props.user.first_name}</h3>
                <h3>{props.user.last_name}</h3>
            </div>
            <div className="div-bio">
                <Bio updateBio={props.updateBio} user={props.user} />
            </div>
            <button className="delete-btn" onClick={deleteAccount}>
                Delete Account
            </button>
        </div>
    );
}
