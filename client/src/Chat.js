import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

let socket;

// lazy initialise pattern!
const connect = () => {
    if (!socket) {
        socket = io.connect();
    }
    return socket;
};

const disconnect = () => (socket = null);

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
}

export default function Chat() {
    const lastMessageRef = useRef(null);
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const socket = connect();

        function onRecentMessages(lastMessages) {
            console.log("onRCNMSG", lastMessages);
            setChatMessages(lastMessages);
        }

        function onBroadcastMessages(message) {
            console.log("onBRDCAST", message);
            setChatMessages((chatMessages) => {
                return [...chatMessages, message];
            });
        }

        socket.on("recentMessages", onRecentMessages);
        socket.on("broadcastMessages", onBroadcastMessages);

        return () => {
            socket.off("recentMessages", onRecentMessages);
            socket.off("broadcastMessage", onBroadcastMessages);
            disconnect();
        };
    }, []);

    useEffect(() => {
        if (!lastMessageRef.current) {
            return;
        }

        lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    function onSubmit(event) {
        event.preventDefault();
        const socket = connect();
        socket.emit("message", event.target.message.value);
        event.target.message.value = "";
    }

    return (
        <section className="chat-section">
            <h2>Chat Wall</h2>
            <div className="chat">
                <ul className="messages">
                    {chatMessages.map((x) => (
                        <li ref={lastMessageRef} key={x.id}>
                            <img
                                className="chat-img"
                                src={x.profile_picture_url}
                            />
                            <strong>{x.first_name}</strong>
                            {"  "}
                            <strong>{x.last_name} </strong>
                            {formatDate(x.created_at)}
                            <p>{x.message}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="textarea-chat">
                <form onSubmit={onSubmit}>
                    <textarea
                        name="message"
                        rows={1}
                        placeholder="Write your message..."
                        required
                    ></textarea>
                    <button className="bio-btn">Send</button>
                </form>
            </div>
        </section>
    );
}
