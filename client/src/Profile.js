import ProfilePicture from "./ProfilePicture";
import Bio from "./BioEditor";

export default function Profile(props) {
    return (
        <div className="containerProfile">
            <h2>Your profile</h2>
            <div className="flexHorizontally">
                <ProfilePicture user={props.user} />
                <div className="flexVertically">
                    <p>{props.user.first_name}</p>
                    <p>{props.user.last_name}</p>
                    <Bio update={props.update} user={props.user} />
                </div>
            </div>
        </div>
    );
}
