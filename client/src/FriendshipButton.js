import { useState, useEffect } from "react";

export default function FriendshipButton(props) {
    console.log("props", props);
    const [buttonText, setButtonText] = useState("default text");

    useEffect(() => {
        console.log("its on its place");
        fetch("/api/friendship-status/" + props.otherUserId)
            .then((response) => response.json())
            .then((result) => {
                console.log("result FSbutton UE", result);
            })
            .catch((error) => console.log("error in FSbtnfetch", error));
    }, []);

    function handleClick() {
        console.log("CLICK CLICK");
    }

    return <button onClick={handleClick}>{buttonText}</button>;
}
