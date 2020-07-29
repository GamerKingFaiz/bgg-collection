import React from 'react';
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
            recursiveFetchAndWait('https://cryptic-brushlands-34819.herokuapp.com/https://api.geekdo.com/xmlapi2/collection?username=' + event.target.value + '&own=1&stats=1&excludesubtype=boardgameexpansion'); 
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
                                recursiveFetchAndWait('https://cryptic-brushlands-34819.herokuapp.com/https://api.geekdo.com/xmlapi2/collection?username=' + document.querySelector('#searchBox').value + '&own=1&stats=1&excludesubtype=boardgameexpansion');
                            } }>
            Submit</button>
        </div>
        
    );
}

export default UsernameField;