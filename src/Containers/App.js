import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import UsernameField from '../Components/UsernameField';

/* node-xml2js (https://www.npmjs.com/package/xml2js) */
import XML2JS from 'xml2js'

/* Import React Table */
import ReactTable from 'react-table';
import 'react-table/react-table.css';

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

	/* Going through the array and changing default values and converting string numbers to actual numbers so that the Table can sort them correctly */
	const gameDataConversions = (array) => {
		array.forEach(game => {
			if (game.statistics[0].ratings[0].ranks[0].rank[0].$.value === 'Not Ranked')
				game.statistics[0].ratings[0].ranks[0].rank[0].$.value = 'N/A';
			else {
				game.statistics[0].ratings[0].ranks[0].rank[0].$.value = Number(game.statistics[0].ratings[0].ranks[0].rank[0].$.value);
			}

			game.minplayers[0].$.value = Number(game.minplayers[0].$.value);
			if (isNaN(game.minplayers[0].$.value))
				game.stats[0].$.minplayers = '--';

			game.maxplayers[0].$.value = Number(game.maxplayers[0].$.value);
			if (isNaN(game.maxplayers[0].$.value))
				game.maxplayers[0].$.value = '--';

			game.maxplaytime[0].$.value = Number(game.maxplaytime[0].$.value);
			if (isNaN(game.maxplaytime[0].$.value))
				game.maxplaytime[0].$.value = '--';

			if (game.yearpublished[0].$.value === undefined)
				game.yearpublished[0].$.value = ['--'];
		})
	}

	/*******************************
	New function to call setTimeout otherwise recursiveFetchAndWait() would be run again 
	when you pass it to the default JS setTimeout function because it has a parameter.
	********************************/
	const setTimeoutAsCallback = (callback) => {
		setTimeout(callback, 5000);
	}

	/*******************************
	Function that fetches the data. The Collection endpoint returns response code 202 until all the data
	has been retrieved. This function will wait an allotted amount of time and then retry until it
	retrieves a 200 response. Then the Things Items endpoint is called to gather additional statistics.
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
					if (result.items) { // Only processing further if there are returned results
						numGames = Number(result.items.$.totalitems);
						result.items.item.forEach(game => {
							gameIds.push(game.$.objectid);
						});
					}

					if (numGames > 1200) {
						while (gameIds.length) {
							arrayOfArrays.push(gameIds.splice(0,1200)); // Splitting gameIds into arrays of max length 1200
						}
						console.log(arrayOfArrays);
					}
				})

				if (numGames > 0 && numGames <= 1200) {
					return fetch('https://cryptic-brushlands-34819.herokuapp.com/https://boardgamegeek.com/xmlapi2/thing?stats=1&id=' + gameIds.join())

					.then(response => response.text())
		
					.then(xml => {
						return XML2JS.parseString(xml, (err, result) => {
							console.log(result.items.item);
							gameDataConversions(result.items.item);
		
							setGameList(gameList => gameList.concat(result.items.item));
							setLoading(false);
						})
					})
					
				} else {
					arrayOfArrays.forEach(array => {
						fetch('https://cryptic-brushlands-34819.herokuapp.com/https://boardgamegeek.com/xmlapi2/thing?stats=1&id=' + array.join())

						.then(response => response.text())
		
						.then(xml => {
							return XML2JS.parseString(xml, (err, result) => {
								console.log(result.items.item);
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
	

	const addFilterPlaceholder = () => {
		const filters = document.querySelectorAll("div.rt-th > input");
		for (let filter of filters) {
		  filter.placeholder = "Search...";
		}
	}

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
			/*******************************
			This URL is using the cors-anywhere reverse proxy to add a CORS header to the BGG API
			Source: https://github.com/Rob--W/cors-anywhere
			*******************************/
			let xmlUrl = 'https://cryptic-brushlands-34819.herokuapp.com/https://api.geekdo.com/xmlapi2/collection?username=' + username + '&own=1&stats=1&excludesubtype=boardgameexpansion';
			recursiveFetchAndWait(xmlUrl);
		}
	}, [recursiveFetchAndWait]);

	const columns = [
		{
			Header: 'Rank',
			accessor: 'statistics[0].ratings[0].ranks[0].rank[0].$.value',
			maxWidth: 75,
			sortMethod: (a,b) => {
				// force null, undefined, and N/A to the bottom
				a = a === null || a === undefined || a === 'N/A' ? Infinity : a
				b = b === null || b === undefined || b === 'N/A' ? Infinity : b
				// Return either 1 or -1 to indicate a sort priority
				if (a > b) {
					return 1
				}
				if (a < b) {
					return -1
				}
				// returning 0, undefined or any falsey value will use subsequent sorts or
				// the index as a tiebreaker
				return 0
			}
		},
		{
			Header: '',
			accessor: 'thumbnail[0]',
			maxWidth: 75,
			sortable: false,
			Cell: props => <img src={ props.value } width="64" alt="thumbnail" className='thumbnail' />
		},
		{
			Header: 'Title',
			accessor: 'name[0].$.value',
			minWidth: 150,
			maxWidth: 450,
			filterable: true,
			style: { 'whiteSpace': 'unset'}, // Allows word wrap
			Cell: props => <div className='title'>
							<a href={ 'https://boardgamegeek.com/boardgame/' + props.original.$.id } target="_blank" rel="noopener noreferrer">
								{ props.value}
							</a> <span className='yearPublished'>({ props.original.yearpublished[0].$.value })</span>
							</div>
		},
		{
			Header: 'Avg Rating',
			accessor: 'statistics[0].ratings[0].average[0].$.value',
			defaultSortDesc: true,
			maxWidth: 100,
			Cell: props => 	<div className='ratingContainer'>
								<div className='averageRating'
									/* Setting background colors for the different ranges */
										style={{backgroundColor:
										Math.round(10 * props.value)/10 >= 9 ? '#249563' // Rounding to the tenths place
										: Math.round(10 * props.value)/10 >= 8 ?  '#2fc482'
										: Math.round(10 * props.value)/10 >= 7 ?  '#1d8acd'
										: Math.round(10 * props.value)/10 >= 5 ?  '#5369a2'
										: Math.round(10 * props.value)/10 >= 3 ?  '#df4751'
										: '#db303b'
								}}>
									{ /* The average rating number to be displayd */ }
									{ Math.round(10 * props.value)/10 }
									
								</div>
							</div>
		},
		{
			Header: 'Min Players',
			accessor: 'minplayers[0].$.value',
			maxWidth: 100,
			sortMethod: (a,b) => {
				// force null, undefined, and N/A to the bottom
				a = a === null || a === undefined || a === '--' ? Infinity : a
				b = b === null || b === undefined || b === '--' ? Infinity : b
				// Return either 1 or -1 to indicate a sort priority
				if (a > b) {
					return 1
				}
				if (a < b) {
					return -1
				}
				// returning 0, undefined or any falsey value will use subsequent sorts or
				// the index as a tiebreaker
				return 0
			}
		},
		{
			Header: 'Max Players',
			accessor: 'maxplayers[0].$.value',
			defaultSortDesc: true,
			maxWidth: 100,
			sortMethod: (a,b) => {
				// force null, undefined, and N/A to the bottom
				a = a === null || a === undefined || a === '--' ? -Infinity : a
				b = b === null || b === undefined || b === '--' ? -Infinity : b
				// Return either 1 or -1 to indicate a sort priority
				if (a > b) {
					return 1
				}
				if (a < b) {
					return -1
				}
				// returning 0, undefined or any falsey value will use subsequent sorts or
				// the index as a tiebreaker
				return 0
			}
		},
		{
			Header: 'Play Time',
			accessor: 'maxplaytime[0].$.value',
			defaultSortDesc: true,
			maxWidth: 100,
			sortMethod: (a,b) => {
				// force null, undefined, and N/A to the bottom
				a = a === null || a === undefined || a === '--' ? -Infinity : a
				b = b === null || b === undefined || b === '--' ? -Infinity : b
				// Return either 1 or -1 to indicate a sort priority
				if (a > b) {
					return 1
				}
				if (a < b) {
					return -1
				}
				// returning 0, undefined or any falsey value will use subsequent sorts or
				// the index as a tiebreaker
				return 0
			},
			Cell: props => <span>{props.value} Min</span>
		},
		{
			Header: 'Weight',
			accessor: 'statistics[0].ratings[0].averageweight[0].$.value',
			maxWidth: 100,
			Cell: props => 	<strong><span
								style={{color:
									Math.round(100 * props.value)/100 >=5 ? '#ff6b26' // Rounding to the hundreths place
									: Math.round(100 * props.value)/100 >=4 ? '#ff6b26'
									: Math.round(100 * props.value)/100 >=3 ? '#ff6b26'
									: Math.round(100 * props.value)/100 >=2 ? '#5bda98'
									: '#5bda98'
							}}>
								{ Math.round(100 * props.value)/100 }</span> / 5</strong>
							
		}
	]

	return (
		<div className='container'>
			<h1><a className="h1Link" href='.'>Better BGG Collection</a></h1>
			<p className='description'>Enter your BoardGameGeek username below to pull up your collection!</p>
			<UsernameField recursiveFetchAndWait = { recursiveFetchAndWait } setGameList = { setGameList }/>
			<p className='tipText'>Tip: Hold shift when sorting to multi-sort!</p>
			<ReactTable 
				data = { gameList }
				columns = { columns }
				defaultSorted = { [{ id: "statistics[0].ratings[0].ranks[0].rank[0].$.value", desc: false }] } // Page loads with rank as the default sorted column
				showPaginationTop = { true }
				minRows = { 5 }
				pageSizeOptions = {[5, 10, 20, 25, 50, 100, 300, 500, 1000, 2000, 5000, 10000]}
				defaultPageSize = { 300 }
				pageSize = { pageSize }
				loading = { loading }
				noDataText = { 'No games found or you haven\'t entered your username yet' }
				className = '-highlight'
				defaultFilterMethod = {
					/* Slightly modifying defaultFilterMethod. Changing startsWith to includes and putting a toLowerCase for both row and filter so case sensitivity doesn't matter when the user searchs */
					(filter, row) => {
						const id = filter.pivotId || filter.id;
						return row[id] !== undefined ? String(row[id]).toLowerCase().includes(filter.value.toLowerCase()) : true
					}
				}/>
			<div id='footer'>
				<p>Page created with <span role="img" aria-label="Red Heart">❤️</span></p>
			</div>
		</div>
	)
	
}

export default App;