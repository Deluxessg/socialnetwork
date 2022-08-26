import { useState, useEffect } from "react";

export default function FriendshipButton({ otherUserId }) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        fetch("/api/friendship-status/" + otherUserId)
            .then((response) => response.json())
            .then((result) => {
                // console.log("result FSbutton UE", result);
                setButtonText(result);
            })
            .catch((error) => console.log("error in FSbtnfetch", error));
    }, [otherUserId]);

    function handleClick() {
        let actionURL;
        if (buttonText === "Send Request") {
            actionURL = "/api/request-friend/" + otherUserId;
        }
        if (buttonText === "Accept Request") {
            actionURL = "/api/accept-friend/" + otherUserId;
        }
        if (
            buttonText === "Cancel Request" ||
            buttonText === "Delete Friendship"
        ) {
            actionURL = "/api/delete-friend/" + otherUserId;
        }
        fetch(actionURL, { method: "POST" })
            .then((response) => response.json())
            .then((result) => {
                setButtonText(result);
            });
    }

    return <button onClick={handleClick}>{buttonText}</button>;
}

// import { useState, useEffect } from "react";

// export default function FriendshipButton(props) {
//     console.log("props", props);
//     const [buttonText, setButtonText] = useState("");

//     useEffect(() => {
//         console.log("its on its place");
//         fetch("/api/friendship-status/" + props.otherUserId)
//             .then((response) => response.json())
//             .then((result) => {
//                 console.log("result FSbutton UE", result);
//                 setButtonText(result);
//             })
//             .catch((error) => console.log("error in FSbtnfetch", error));
//     }, []);

//     function handleClick() {
//         if (buttonText === "Send Request") {
//             fetch("/api/request-friend" + props.otherUserId, {
//                 method: "POST",
//             })
//                 .then((response) => {
//                     response.json();
//                 })
//                 .then((result) => {
//                     setButtonText(result);
//                 });
//         } else if (buttonText === "Accept Request") {
//             fetch("/api/accept-friend" + props.otherUserId, {
//                 method: "POST",
//             })
//                 .then((response) => {
//                     response.json();
//                 })
//                 .then((result) => {
//                     setButtonText(result);
//                 });
//         } else if (buttonText === "Cancel Request") {
//             fetch("/api/delete-friend" + props.otherUserId, {
//                 method: "POST",
//             })
//                 .then((response) => {
//                     response.json();
//                 })
//                 .then((result) => {
//                     setButtonText(result);
//                 });
//         } else if (buttonText === "Delete Friendship") {
//             fetch("/api/delete-friend" + props.otherUserId, {
//                 method: "POST",
//             })
//                 .then((response) => {
//                     response.json();
//                 })
//                 .then((result) => {
//                     setButtonText(result);
//                 });
//         } else {
//             console.log("check your chain");
//         }
//     }

//     return <button onClick={handleClick}>{buttonText}</button>;
// }
