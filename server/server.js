const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { SESSION_SECRET } = require("./secrets.json");

const { getUserById, createUser } = require("./db");

app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// #1

app.get("/api/users/me", (request, response) => {
    if (!request.session.user_id) {
        response.json(null);
        return;
    }
    getUserById(request.session.user_id).then((user) => {
        response.json(user);
    });
});

app.post("/api/users", (request, response) => {
    createUser(request.body)
        .then((newUser) => {
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

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
