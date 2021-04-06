import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline'
import UsernameField from '../Components/UsernameField';
import Table from '../Components/Table'
import gameDataConversions from '../utils/gameDataConversions'
import { THING_ITEMS_ENDPOINT, COLLECTION_ENDPOINT } from '../utils/urlConstants';
import { addFilterPlaceholder, setTimeoutAsCallback } from '../utils/helperFunctions';

/* node-xml2js (https://www.npmjs.com/package/xml2js) */
import XML2JS from 'xml2js'

/* Import Google Analytics */
import ReactGA from 'react-ga';
ReactGA.initialize('UA-139517114-1');
ReactGA.pageview(window.location.pathname + window.location.search);
/* Google Analytics Event */
const urlParamGA = () => {
    ReactGA.event({
        category: 'Collection Request',
        action: 'URL Param entered'
      });
}

const App = () => {

	const [gameList, setGameList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageSize, setPageSize] = useState(undefined); // React Table default

	/*******************************
	Function that fetches the data. The Collection endpoint returns response code 202 until all the data
	has been retrieved. This function will wait an allotted amount of time and then retry until it
	retrieves a 200 response. Then the Thing Items endpoint is called to gather additional statistics.
	Finally the received array is added to the state array gameList.
	********************************/
	const recursiveFetchAndWait = useCallback(
		(url) => {
			setLoading(true);
	
			fetch(url)
			.then(response => {
				if (response.status === 200) { // Checking for response code 200
					return response.text();

				} else if (response.status === 202) { // If the status response was 202 (API still retrieving data), call the fetch again after a set timeout
					setTimeoutAsCallback(() => recursiveFetchAndWait(url));

				} else
					console.log('error: ', response.status);
			})

			.then(data => {
				let numGames;
				let gameIds = [];
				let arrayOfArrays = [];

				XML2JS.parseString(data, (err, result) => { // xml2js: converts XML to JSON
					if (result.items.$.totalitems !== '0') { // Only processing further if there are returned results
						numGames = Number(result.items.$.totalitems);

						result.items.item.forEach(game => {
							gameIds.push(game.$.objectid);
						});
					}

					if (numGames > 1200) {
						// Thing Items endpoint can't handle more then 1200 requests at once, so need to split it up into multiple arrays
						while (gameIds.length) {
							arrayOfArrays.push(gameIds.splice(0,1200)); // Splitting gameIds into arrays of max length 1200
						}
					}
				})

				if (numGames > 0 && numGames <= 1200) {
					return fetch(THING_ITEMS_ENDPOINT + gameIds.join())

					.then(response => response.text())
		
					.then(xml => {
						return XML2JS.parseString(xml, (err, result) => {
							gameDataConversions(result.items.item);
		
							setGameList(gameList => gameList.concat(result.items.item));

							setLoading(false);
						})
					})
					
				} else { // For collections >1200 games
					arrayOfArrays.forEach(array => {
						fetch(THING_ITEMS_ENDPOINT + array.join())

						.then(response => response.text())
		
						.then(xml => {
							return XML2JS.parseString(xml, (err, result) => {
								gameDataConversions(result.items.item);
			
								setGameList(gameList => gameList.concat(result.items.item));
							})
						})
					});

					setLoading(false);
				}
			})
		},
		[],
	);

	useEffect(() => { // React hook that replaced ComponentDidMount
		addFilterPlaceholder();

		/* Grabbing the URL params */
		let params = (new URL(document.location)).searchParams;
		let username = params.get("username");

		/* Allowing the user to specify size of the page onLoad */
		let rows = params.get("rows");
		if (rows !== null) {
			setPageSize(Number(rows));
		}
		
		/* This call is made for if the website is loaded with params attached already */
		if (username !== null) {
			urlParamGA(); // Google Analytics

			let xmlUrl = COLLECTION_ENDPOINT + username;
			recursiveFetchAndWait(xmlUrl);
		}
	}, [recursiveFetchAndWait]);

	return (
		<div className='container'>
			<h1><a className="h1Link" href='.'>Better BGG Collection</a></h1>
			<p className='description'>Enter your BoardGameGeek username below to pull up your collection!</p>
			<UsernameField recursiveFetchAndWait = { recursiveFetchAndWait } setGameList = { setGameList }/>
			<p className='tipText'>Tip: Hold shift when sorting to multi-sort!</p>
			<CssBaseline />
			<div style={{overflowX: 'auto'}}>
				<Table data = { gameList } />
			</div>
			<div id='footer'>
				<p>Page created with <span role="img" aria-label="Red Heart">❤️</span></p>
			</div>
		</div>
	)
}

export default App;