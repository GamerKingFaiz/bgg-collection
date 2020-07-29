import React from 'react';
import { COLLECTION_ENDPOINT } from '../utils/urlConstants';
import './UsernameField.css'

/* Import Google Analytics */
import ReactGA from 'react-ga';
/* Google Analytics Events */
const keypressGA = () => {
    ReactGA.event({
        category: 'Collection Request',
        action: 'Enter key pressed'
      });
}
const submitGA = () => {
    ReactGA.event({
        category: 'Collection Request',
        action: 'Clicked Submit'
      });
}

const UsernameField = ({ recursiveFetchAndWait, setGameList}) => {

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            keypressGA(); // Google Analytics
            setGameList([]);
            recursiveFetchAndWait(COLLECTION_ENDPOINT + event.target.value); 
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
                                submitGA(); // Google Analytics
                                setGameList([]);
                                recursiveFetchAndWait(COLLECTION_ENDPOINT + document.querySelector('#searchBox').value);
                            } }>
            Submit</button>
        </div>
        
    );
}

export default UsernameField;