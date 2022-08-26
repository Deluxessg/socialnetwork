import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import FriendshipButton from "./FriendshipButton";

export default function OtherProfile() {
    const { user_id } = useParams();
    console.log("USERIDPARAMS", user_id);
    const [user, setUser] = useState({});
    const history = useHistory();

    useEffect(() => {
        fetch("/api/users/" + user_id)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    history.push("/");
                } else {
                    setUser(data);
                }
            });
    }, [user_id]);

    return (
        <div className="other-profile">
            <div key={user.id}>
                <img src={user.profile_picture_url} />
                <h4>
                    {user.first_name} {user.last_name}
                </h4>
                <p>{user.bio}</p>
                <FriendshipButton otherUserId={user_id} />
            </div>
        </div>
    );
}
