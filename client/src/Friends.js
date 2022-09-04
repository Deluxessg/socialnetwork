import { useState, useEffect } from "react";
import FriendList from "./FriendList";

export default function Friends() {
    const [friendships, setFriendships] = useState([]);

    useEffect(() => {
        fetch("/api/friendships")
            .then((response) => response.json())
            .then((result) => {
                setFriendships(result);
            });
    }, []);

    function onClick(friendship) {
        if (friendship.accepted) {
            const newFriends = friendships.filter(
                (f) => f.friendship_id !== friendship.friendship_id
            );
            setFriendships(newFriends);
            fetch(`/api/friendships/${friendship.user_id}`, {
                method: "DELETE",
            });
        } else {
            const newFriends = friendships.map((f) => {
                if (f.friendship_id === friendship.friendship_id) {
                    f.accepted = true;
                }
                return f;
            });
            setFriendships(newFriends);

            fetch(`/api/friendships/${friendship.user_id}`, {
                method: "PUT",
            });
        }
    }

    const incoming = friendships.filter((friendship) => !friendship.accepted);
    console.log("INCOMING", incoming);
    const accepted = friendships.filter((friendship) => friendship.accepted);
    console.log("ACCEPTED", accepted);

    return (
        <section>
            <h2>FRIENDS</h2>
            <section>
                <h3>Incoming Requests</h3>
                <FriendList friendships={incoming} onClick={onClick} />
            </section>
            <section>
                <h3>Current Friends</h3>
                <FriendList friendships={accepted} onClick={onClick} />
            </section>
        </section>
    );
}

// {
//         console.log("onclick", friendship.friendship_id);
//         if (!friendship.accepted) {
//             const newFriends = friendships.map((f) => {
//                 if (f.friendship_id === friendship.friendship_id) {
//                     f.accepted = true;
//                 }
//                 return f;
//             });
//             setFriendships(newFriends);
//             return;
//         }
//     }
