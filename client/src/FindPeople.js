import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [recentUsers, setRecentUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        fetch("api/users/recent")
            .then((response) => response.json())
            .then((data) => {
                // console.log("DATA in FP", data);
                setRecentUsers(data);
            });
    }, []);

    useEffect(() => {
        if (searchTerm.length < 3) {
            return;
        }

        fetch("api/users/search?q=" + searchTerm)
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data);
            });
    }, [searchTerm]);

    function onSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    return (
        <section className="find-people">
            {/* <h2>Find People</h2> */}
            <section className="recent-users">
                <h3>Who is new?</h3>
                <ul>
                    {recentUsers.map((user) => (
                        <li key={user.id}>
                            <Link
                                className="people-text"
                                to={"/users/" + user.id}
                            >
                                <img
                                    className="people-img"
                                    src={user.profile_picture_url}
                                ></img>
                                {user.first_name} {user.last_name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
            <section className="search-results">
                <h3 className="padding-h3">
                    Looking for someone in particular?
                </h3>
                <p>
                    <input
                        defaultValue={searchTerm}
                        onChange={onSearchChange}
                        placeholder="Search for users..."
                    />
                </p>
                <ul>
                    {searchResults.map((user) => (
                        <li key={user.id}>
                            <Link
                                className="people-text"
                                to={"/users/" + user.id}
                            >
                                <img src={user.profile_picture_url}></img>
                                {user.first_name} {user.last_name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
}
