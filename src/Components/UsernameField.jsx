import React from 'react';
import './UsernameField.css'

const UsernameField = ({ fetchCollection, setGameList }) => {

    /* Pre-populate the field with the username query param, if present */
    const initialUsername = new URLSearchParams(window.location.search).get('username') ?? '';

    const submit = (username) => {
        const value = username.trim().toLowerCase();
        if (!value) return;

        /* Skip the refetch if this username is already in the query param */
        const current = new URLSearchParams(window.location.search).get('username');
        if (current === value) return;

        /* Reflect the username in the URL's query param without a reload */
        const url = new URL(window.location);
        url.searchParams.set('username', value);
        window.history.replaceState({}, '', url);

        setGameList([]);
        fetchCollection(value);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            submit(event.target.value);
        }
    }

    return (
        <div className="search">
            <input
                type="text"
                placeholder="Enter BGG Username"
                name="username"
                id="searchBox"
                defaultValue={initialUsername}
                onKeyDown={handleKeyPress}
            />
            <button type="button"
                    onClick={(event) => {
                                submit(document.querySelector('#searchBox').value);
                            } }>
            Submit</button>
        </div>
        
    );
}

export default UsernameField;