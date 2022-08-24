export default function ProfilePicture({ profile_picture_url, onButtonClick }) {
    return (
        <div onClick={onButtonClick}>
            <img
                className="profile-pic"
                src={profile_picture_url}
                alt="profile_picture"
            />
        </div>
    );
}
