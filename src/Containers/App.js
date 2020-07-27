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
	const [pageSize, setPageSize] = useState(undefined);

	/*******************************
	New function to call setTimeout otherwise recursiveFetchAndWait() would be run again 
	when you pass it to the default JS setTimeout function because it has a parameter.
	********************************/
	const setTimeoutAsCallback = (callback) => {
		setTimeout(callback, 5000);
	}

	/*******************************
	Function that fetches the data. The BGG API returns response code 202 until all the data
	has been retrieved. This function will wait an allotted amount of time and then retry
	until it retrieves a 200 response and then sets the received array to the state array GameList.
	********************************/
	const recursiveFetchAndWait = useCallback(
		(url) => {
			setLoading(true);
	
			fetch(url)
				.then(async response => {
					if (response.status === 200) { // Checking for response code 200
						const xml = await response.text();
						setLoading(false);
						return XML2JS.parseString(xml, (err, result) => { // xml2js: converts XML to JSON
							if (result.items.$.totalitems !== '0') { // Only processing further if there are returned results
								result.items.item.forEach(game => {
									/* Going through the array and changing default values and converting string numbers to actual numbers */
									if (game.stats[0].rating[0].ranks[0].rank[0].$.value === 'Not Ranked')
										game.stats[0].rating[0].ranks[0].rank[0].$.value = 'N/A';
									else {
										game.stats[0].rating[0].ranks[0].rank[0].$.value = Number(game.stats[0].rating[0].ranks[0].rank[0].$.value);
									}
	
									game.stats[0].$.minplayers = Number(game.stats[0].$.minplayers);
									if (isNaN(game.stats[0].$.minplayers))
										game.stats[0].$.minplayers = '--';
	
									game.stats[0].$.maxplayers = Number(game.stats[0].$.maxplayers);
									if (isNaN(game.stats[0].$.maxplayers))
										game.stats[0].$.maxplayers = '--';
	
									game.stats[0].$.maxplaytime = Number(game.stats[0].$.maxplaytime);
									if (isNaN(game.stats[0].$.maxplaytime))
										game.stats[0].$.maxplaytime = '--';
	
									if (game.yearpublished === undefined)
										game.yearpublished = ['--'];
								});
								setGameList(result.items.item)
							}
						});
					} else if (response.status === 202) { // If the status response was 202 (API still retrieving data), call the fetch again after a set timeout
						setTimeoutAsCallback(() => recursiveFetchAndWait(url));
					} else
						console.log(response.status);
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

	useEffect(() => {
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
			let xmlUrl = 'https://cors-anywhere.herokuapp.com/https://api.geekdo.com/xmlapi2/collection?username=' + username + '&own=1&stats=1&excludesubtype=boardgameexpansion';
			recursiveFetchAndWait(xmlUrl);
		}
	}, [recursiveFetchAndWait]);

	const columns = [
		{
			Header: 'Rank',
			accessor: 'stats[0].rating[0].ranks[0].rank[0].$.value',
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
			accessor: 'name[0]._',
			minWidth: 150,
			maxWidth: 450,
			filterable: true,
			style: { 'whiteSpace': 'unset'}, // Allows word wrap
			Cell: props => <div className='title'>
							<a href={ 'https://boardgamegeek.com/boardgame/' + props.original.$.objectid } target="_blank" rel="noopener noreferrer">
								{ props.value}
							</a> <span className='yearPublished'>({ props.original.yearpublished[0] })</span>
							</div>
		},
		{
			Header: 'Avg Rating',
			accessor: 'stats[0].rating[0].average[0].$.value',
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
										: '#db303b'}}>

									{ /* The average rating number to be displayd */ }
									{ Math.round(10 * props.value)/10 }
									
								</div>
							</div>
		},
		{
			Header: 'Min Players',
			accessor: 'stats[0].$.minplayers',
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
			accessor: 'stats[0].$.maxplayers',
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
			accessor: 'stats[0].$.maxplaytime',
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
	]

	return (
		<div className='container'>
			<h1><a className="h1Link" href='.'>Better BGG Collection</a></h1>
			<p className='description'>Enter your BoardGameGeek username below to pull up your collection!</p>
			<UsernameField recursiveFetchAndWait = { recursiveFetchAndWait }/>
			<p className='tipText'>Tip: Hold shift when sorting to multi-sort!</p>
			<ReactTable 
				data = { gameList }
				columns = { columns }
				defaultSorted = { [{ id: "stats[0].rating[0].ranks[0].rank[0].$.value", desc: false }] } // Page loads with rank as the default sorted column
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