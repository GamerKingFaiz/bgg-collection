import React from 'react';
import './UsernameField.css'



const UsernameField = ({ recursiveFetchAndWait}) => {

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            recursiveFetchAndWait('https://cors-anywhere.herokuapp.com/https://api.geekdo.com/xmlapi2/collection?username=' + event.target.value + '&own=1&stats=1&excludesubtype=boardgameexpansion'); 
        }
    }

    return (
        <div className="search">
            <input
                type="text"
                placeholder="Enter BGG Username"
                name="username"
                id="searchBox"
                onKeyPress={handleKeyPress}
            />
            <button type="button"
                    onClick={ (event) => {
                                recursiveFetchAndWait('https://cors-anywhere.herokuapp.com/https://api.geekdo.com/xmlapi2/collection?username=' + document.querySelector('#searchBox').value + '&own=1&stats=1&excludesubtype=boardgameexpansion');
                                
                            } }>
            Submit</button>
        </div>
        
    );
}

export default UsernameField;