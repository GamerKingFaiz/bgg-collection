import React from 'react';
import './UsernameField.css'

const UsernameField = ({ fetchCollection, setGameList }) => {

    const submit = (username) => {
        const value = username.trim().toLowerCase();
        if (!value) return;
        setGameList([]);
        fetchCollection(value);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            window.umami.track("Enter key pressed");
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
                onKeyDown={handleKeyPress}
            />
            <button type="button"
                    onClick={(event) => {
                                window.umami.track("Clicked Submit");
                                submit(document.querySelector('#searchBox').value);
                            } }>
            Submit</button>
        </div>
        
    );
}

export default UsernameField;