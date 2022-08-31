import { Link } from "react-router-dom";

export default function FriendList({ friendships, onClick }) {
    return (
        <ul>
            {friendships.map((f) => (
                <li key={f.user_id}>
                    <Link to={`/users/${f.user_id}`}>
                        <img src={f.profile_picture_url} />
                        {f.first_name} {f.last_name}
                    </Link>
                    <button onClick={() => onClick(f)}>
                        {f.accepted ? "Delete Friendship" : "Accept Request"}
                    </button>
                </li>
            ))}
        </ul>
    );
}
