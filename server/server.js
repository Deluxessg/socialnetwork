const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { SESSION_SECRET } = require("./secrets.json");
const { Server } = require("http");
const socketConnect = require("socket.io");

const { s3Upload } = require("./s3");
const { uploader } = require("./uploader");
const {
    getUserById,
    createUser,
    login,
    updateUserProfilePicture,
    updateBio,
    getRecentUsers,
    searchUsers,
    friendshipCheck,
    requestFriendship,
    acceptFriendship,
    deleteFriendship,
    getFriendships,
    getRecentChatMessages,
    saveChatMessage,
    deleteFriendships,
    deleteMessages,
    deleteUser,
} = require("./db");

const cookieSessionMiddleware = cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

const server = Server(app);

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieSessionMiddleware);

// #1

app.get("/api/users/me", (request, response) => {
    if (!request.session.user_id) {
        response.json(null);
        return;
    }
    getUserById(request.session.user_id).then((user) => {
        // console.log("user_id", user_id);
        response.json(user);
    });
});

app.post("/api/users", (request, response) => {
    console.log("POST register", request.body);
    createUser({ ...request.body })
        .then((newUser) => {
            console.log("nu", newUser);
            request.session.user_id = newUser.id;
            response.json(newUser);
        })
        .catch((error) => {
            if (error.constraint === "email") {
                response.status(400).json({ error: "Email is already taken" });
                return;
            }
            response.status(500).json({ error: "Try again later" });
        });
});

// #2 login

app.post("/api/login", (request, response) => {
    login(request.body)
        .then((user) => {
            if (!user) {
                response.status(401).json({ error: "invalid authentication" });
                return;
            }
            request.session.user_id = user.id;
            response.json(user);
        })
        .catch((error) => {
            console.log("login POST", error);
            response.status(500).json({ error: "Oops, something went wrong!" });
        });
});

// #3

// app.post("/password/reset/start", (request, response) => {
//     getUserByEmail(request.body).then((user) => {
//         if (!user) {
//             response.status(401).json({ error: "not registered" });
//             return;
//         }
//         generateCode(user.email, code)
//             .then((result) => {
//                 response.json(result);
//             })
//             .catch((error) => {
//                 console.log("error by generating", error);
//                 response
//                     .status(500)
//                     .json({ error: "Oops, somethign went wrong" });
//             });
//     });
// });

// app.post("/password/reset/verify", (request, response) => {
//     getUserByEmail(request.body).then((user) => {
//         if (!user) {
//             response.status(401).json({ error: "not registered" });
//             return;
//         }
//         getCode(user.email).then((resetCode) => {
//             if (!resetCode) {
//                 response.status(401).json({ error: "wrong code" });
//                 return;
//             }
//         });
//     });
// });

// #4

app.post(
    "/api/users/profile",
    uploader.single("file"),
    s3Upload,
    (request, response) => {
        const url = `https://s3.amazonaws.com/spicedling/${request.file.filename}`;

        updateUserProfilePicture({
            user_id: request.session.user_id,
            profile_picture_url: url,
        })
            .then((result) => {
                response.json(result);
            })
            .catch((error) => {
                console.log("pic upload post", error);
                response
                    .status(500)
                    .json({ message: "couldn't upload the image" });
            });
    }
);

// #5

app.post("/api/bio", (request, response) => {
    console.log("reqbody", request.body);
    const { bio } = request.body;
    updateBio({
        id: request.session.user_id,
        bio: bio,
    })
        .then((bio) => {
            response.json(bio);
        })
        .catch((error) => {
            console.log("bio error", error);
            response.statusCode(500).json({ error: "error by bio" });
        });
});

// #6

app.get("/api/users/recent", (request, response) => {
    getRecentUsers(request.query).then((users) => {
        response.json(users);
    });
});

// app.get("/api/users/recent", (request, response) => {
//     console.log("REQUSRID", request.session.user_id);
//     getRecentUsers(request.session.user_id).then((users) => {
//         console.log("USERS NEW", users);
//         response.json(users);
//     });
// });

// app.get("/api/users/search", async (request, response) => {
//     const searchResults = await searchUsers(request.query);
//     response.json(searchResults);
// });

app.get("/api/users/search", async (request, response) => {
    const searchResults = await searchUsers(request.query);
    response.json(
        searchResults.filter((user) => user.id !== request.session.user_id)
    );
});

// app.get("/api/users/search", (request, response)=>{
//     if(!request.session.user_id){
//         response.json(null)
//         return;
//     }
//     searchUsers(request.query).then((user))
// })

// #7

app.get("/api/users/:user_id", (request, response) => {
    getUserById(request.params.user_id).then((user) => {
        response.json(user);
    });
});

app.get("/api/friendship-status/:otheruserid", (request, response) => {
    friendshipCheck(request.session.user_id, request.params.otheruserid)
        .then((friendship) => {
            if (!friendship) {
                response.json("Send Request");
                return;
            }
            if (friendship.accepted) {
                response.json("Cancel Request");
                return;
            }
            if (friendship.sender_id === request.session.user_id) {
                response.json("Cancel Request");
                return;
            }
            if (friendship.recipient_id === request.session.user_id) {
                response.json("Accept Request");
                return;
            }
        })
        .catch((error) => {
            console.log("error by checking FS status", error);
        });
});

app.post("/api/request-friend/:otheruserid", (request, response) => {
    requestFriendship(request.session.user_id, request.params.otheruserid).then(
        () => {
            console.log("REQUEST FRIEND");
            response.json("Cancel Request");
        }
    );
});

app.put("/api/friendships/:otheruserid", (request, response) => {
    acceptFriendship(request.session.user_id, request.params.otheruserid).then(
        () => {
            console.log("ACCEPT FRIEND");
            response.json("Delete Friendship");
        }
    );
});

app.delete("/api/friendships/:otheruserid", (request, response) => {
    deleteFriendship(request.session.user_id, request.params.otheruserid).then(
        () => {
            console.log("FRIEND IS DELETED");
            response.json("Send Request");
        }
    );
});

// #8

app.get("/api/friendships", (request, response) => {
    getFriendships(request.session.user_id)
        .then((result) => {
            response.json(result);
        })
        .catch((error) => {
            console.log("error at getfrndshps", error);
        });
});

// #9

const io = socketConnect(server, {
    allowRequest: (request, callback) =>
        callback(
            null,
            request.headers.referer.startsWith(`http://localhost:3000`)
        ),
});

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", async (socket) => {
    console.log("[social:socket] incoming socked connection", socket.id);
    const { user_id } = socket.request.session;
    console.log("SOCKETSESSION", socket.request.session);
    if (!user_id) {
        return socket.disconnect(true);
    }
    const lastMessages = await getRecentChatMessages();
    socket.emit("recentMessages", lastMessages.reverse());

    socket.on("message", async (text) => {
        console.log("USRID", user_id);
        const newMessage = await saveChatMessage({
            user_id: user_id,
            message: text,
        });
        console.log("NEWMESSAGE", newMessage);
        const sender = await getUserById(newMessage.sender_id);

        io.emit("broadcastMessages", {
            ...newMessage,
            ...sender,
            message_id: newMessage.id,
        });
    });
});

// #10

app.post("/api/delete-account", async (request, response) => {
    const { user_id } = request.session;

    try {
        await deleteMessages(user_id);
        await deleteFriendships(user_id);
        await deleteUser(user_id);

        request.session = null;

        response.json({ message: "It was great to have you" });
    } catch (error) {
        console.log("ERROR by delete", error);
        response
            .status(500)
            .json({ message: "Deleting the account wasn't succesful" });
    }
});

app.post("/api/logout", (request, response) => {
    request.session = null;
    response.redirect("/api/login");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
