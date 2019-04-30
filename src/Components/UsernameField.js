import React from 'react';
import './UsernameField.css'

const UsernameField = () => {
    return (
        <div className="search">
            <form>
                <input
                    type="search"
                    placeholder="Enter BGG Username"
                    name="username"
                    id="searchBox"     
                />
                <button type="submit">Submit</button>

            </form>
        </div>
        
    );
}

export default UsernameField;