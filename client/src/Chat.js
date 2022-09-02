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

    function onSubmit(event) {
        event.preventDefault();
        const socket = connect();
        socket.emit("message", event.target.message.value);
        event.target.message.value = "";
    }

    return (
        <section className="chat">
            <h2>Chat</h2>
            <ul className="messages">
                {chatMessages.map((x) => (
                    <li ref={lastMessageRef} key={x.id}>
                        <img src={x.profile_picture_url} />
                        {x.first_name} {x.last_name} {x.created_at}
                        <p>{x.message}</p>
                    </li>
                ))}
            </ul>
            <form onSubmit={onSubmit}>
                <textarea
                    name="message"
                    rows={1}
                    placeholder="Write your message..."
                    required
                ></textarea>
                <button>Send</button>
            </form>
        </section>
    );
}
