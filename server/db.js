const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");
const DATABASE_NAME = "social-network";
const cryptoRandomString = require("crypto-random-string");
const { DATABASE_USER, DATABASE_PASSWORD } = require("./secrets.json");

const db = spicedPg(
    `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

const hash = (password) =>
    bcrypt.genSalt().then((salt) => bcrypt.hash(password, salt));

function getUserById(id) {
    return db
        .query(`SELECT * FROM users WHERE id = $1`, [id])
        .then((result) => result.rows[0]);
}

function createUser({ first_name, last_name, email, password }) {
    return hash(password).then((password_hash) => {
        return db
            .query(
                `INSERT INTO users (first_name, last_name, email, password_hash)
        VALUES ($1, $2, $3, $4) RETURNING *`,
                [first_name, last_name, email, password_hash]
            )
            .then((result) => result.rows[0]);
    });
}

function getUserByEmail(email) {
    return db
        .query(`SELECT * FROM users WHERE email =$1`, [email])
        .then((result) => result.rows[0]);
}

function login({ email, password }) {
    return getUserByEmail(email).then((foundUser) => {
        if (!foundUser) {
            return null;
        }
        return bcrypt
            .compare(password, foundUser.password_hash)
            .then((match) => {
                if (match) {
                    return foundUser;
                }
                return null;
            });
    });
}

function generateCode({ email }) {
    return getUserByEmail(email).then((foundUser) => {
        if (!foundUser) {
            return null;
        }
        const code = cryptoRandomString({ length: 6 });
        return db
            .query(
                `INSERT INTO reset_codes (email, code)
                VALUES ($1, $2) 
                RETURNING*
        `,
                [email, code]
            )
            .then((result) => result.rows[0]);
    });
}

function getCode({ email }) {
    return db
        .query(
            `SELECT * FROM reset_codes
             WHERE email = $1 AND
             CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
            
    `,
            [email]
        )
        .then((result) => result.rows[0]);
}

function newPassword(password) {
    return hash(password).then((password_hash) => {
        return db
            .query(
                `UPDATE users SET password_hash = $1
                 RETURNING *
        `,
                [password_hash]
            )
            .then((result) => result.rows[0]);
    });
}

function updateUserProfilePicture({ user_id, profile_picture_url }) {
    return db
        .query(
            `UPDATE users SET profile_picture_url = $1 
             WHERE id = $2 
             RETURNING profile_picture_url
    `,
            [profile_picture_url, user_id]
        )
        .then((result) => result.rows[0]);
}

function updateBio({ bio, id }) {
    return db
        .query(
            `UPDATE users
             SET bio = $1
             WHERE id = $2
             RETURNING *`,
            [bio, id]
        )
        .then((result) => result.rows[0]);
}

function getRecentUsers({ limit = 3 }) {
    return db
        .query(
            `
        SELECT * FROM users
        ORDER BY id DESC
        LIMIT $1
    `,
            [limit]
        )
        .then((result) => result.rows);
}

function searchUsers({ q }) {
    return db
        .query(
            `
        SELECT * FROM users
        WHERE first_name ILIKE $1 OR
        last_name ILIKE $1
    `,
            [q + "%"]
        )
        .then((result) => result.rows);
}

function friendshipCheck(id, otherUserId) {
    return db
        .query(
            `
        SELECT * FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)
    `,
            [id, otherUserId]
        )
        .then((result) => result.rows[0]);
}

function requestFriendship(id, otherUserId) {
    return db
        .query(
            `
        INSERT INTO friendships (sender_id, recipient_id)
        VALUES ($1, $2)
        RETURNING *
    `,
            [id, otherUserId]
        )
        .then((result) => result.rows[0]);
}

function acceptFriendship(id, otherUserId) {
    return db
        .query(
            `
        UPDATE friendships
        SET accepted = true
        WHERE (recipient_id = $1 AND sender_id = $2)
    `,
            [id, otherUserId]
        )
        .then((result) => result.rows[0]);
}

function deleteFriendship(id, otherUserId) {
    return db
        .query(
            `
        DELETE FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)
    `,
            [id, otherUserId]
        )
        .then((result) => result.rows[0]);
}

module.exports = {
    getUserById,
    createUser,
    getUserByEmail,
    login,
    generateCode,
    getCode,
    newPassword,
    updateUserProfilePicture,
    updateBio,
    getRecentUsers,
    searchUsers,
    friendshipCheck,
    requestFriendship,
    acceptFriendship,
    deleteFriendship,
};
