import ProfilePicture from "./ProfilePicture";
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
            <h2>Your profile</h2>
            <div>
                <ProfilePicture
                    profile_picture_url={props.user.profile_picture_url}
                />
                <div>
                    <h3>{props.user.first_name}</h3>
                    <h3>{props.user.last_name}</h3>
                    <Bio updateBio={props.updateBio} user={props.user} />
                </div>
                <button onClick={deleteAccount}>Delete Account</button>
            </div>
        </div>
    );
}
