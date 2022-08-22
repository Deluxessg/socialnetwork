export default function ProfilePicture({ profile_picture_url }) {
    return (
        <img
            className="profile-pic"
            src={profile_picture_url}
            alt="profile_picture"
        />
    );
}
