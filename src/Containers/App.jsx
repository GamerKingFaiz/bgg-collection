import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import UsernameField from '../Components/UsernameField';
import { COLLECTION_ENDPOINT } from '../utils/urlConstants';
import { addFilterPlaceholder } from '../utils/helperFunctions';
import bggLogoUrl from '../assets/powered-by-bgg-rgb.svg';
import columns from '../utils/columns';

/* Import React Table */
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const App = () => {

	const [gameList, setGameList] = useState([]);
	const [count, setCount] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [pageSize, setPageSize] = useState(undefined); // React Table default

	/*******************************
	Asks the backend to fetch + merge the collection and thing stats in a single
	request. The backend handles the 202 retry (exponential backoff) and returns
	a JSON document: { username, count, games } where `games` is the array of
	xml2js-shaped items the table expects.
	********************************/
	const fetchCollection = useCallback(async (username) => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(COLLECTION_ENDPOINT + encodeURIComponent(username));
			if (!response.ok) {
				let msg = `Request failed (${response.status})`;
				try {
					const body = await response.json();
					if (body?.error) msg = body.error;
				} catch { /* non-JSON body */ }
				throw new Error(msg);
			}
			const data = await response.json();
			setGameList(data.games ?? []);
			setCount(data.games?.length ?? 0);
		} catch (err) {
			console.error('fetchCollection error:', err);
			setError(err.message ?? 'Failed to load collection');
		} finally {
			setLoading(false);
		}
	}, []);

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
			fetchCollection(username);
		}
	}, [fetchCollection]);

	return (
		<div className='container'>
			<h1><a className="h1Link" href='.'>Better BGG Collection</a></h1>
			<p className='description'>{count !== null ? `Collection size: ${count} games` : 'Enter your BoardGameGeek username below to pull up your collection!'}</p>
			<UsernameField fetchCollection = { fetchCollection } setGameList = { setGameList }/>
			{error && <p className='errorText' role="alert">{error}</p>}
			<p className='tipText'>Tip: Hold shift when sorting to multi-sort!</p>
			<ReactTable 
				data = { gameList }
				columns = { columns }
				defaultSorted = { [{ id: "rank", desc: false }] } // Page loads with rank as the default sorted column
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
				<a
					href="https://boardgamegeek.com/wiki/page/BGG_XML_API2"
					target="_blank"
					rel="noreferrer"
					onClick={() => window.umami.track("BGG Logo Clicked")}
				>
					<img src={bggLogoUrl} alt="Powered by BGG" id="bgg-logo" />
				</a>
			</div>
		</div>
	)
}

export default App;