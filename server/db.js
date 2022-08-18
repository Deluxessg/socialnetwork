const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");
const DATABASE_NAME = "social-network";
const { DATABASE_USER, DATABASE_PASSWORD } = require("./secrets.json");

const db = spicedPg(
    `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

const hash = (password) =>
    bcrypt.genSalt().then((salt) => bcrypt.hash(password, salt));

function getUserById(id) {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
}

function createUser({ first_name, last_name, email, password }) {
    return db
        .query(
            `INSERT INTO users (first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4) RETURNING *`,
            [first_name, last_name, email, password]
        )
        .then((result) => result.rows[0]);
}

module.exports = {
    getUserById,
    createUser,
};
