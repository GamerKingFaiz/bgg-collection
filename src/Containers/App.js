import React, { Component } from 'react';
import './App.css';
import UsernameField from '../Components/UsernameField';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class App extends Component {

	constructor() {
		super();
		this.state = {
			gameList: []
		}
	}

	/* JSON Fetch that pulls games from the collection API and filters for owned games */
	fetchCollection = (jsonUrl) => {
		fetch(jsonUrl)
			.then(response => response.json())
			.then(games => {
				let ownedGames = [];
				ownedGames = games.filter(game => game.owned === true); // Filtering for only owned games 
				ownedGames.forEach((game) => {
					if (game.rank === -1) {
						game.rank = 'N/A';
					}
				});
				this.setState({ gameList: ownedGames });
			})
	}

	addFilterPlaceholder = () => {
		const filters = document.querySelectorAll("div.rt-th > input");
		for (let filter of filters) {
		  filter.placeholder = "Search...";
		}
	}

	componentDidMount() {
		this.addFilterPlaceholder();

		/* Grabbing the URL params */
		let params = (new URL(document.location)).searchParams;
		let username = params.get("username");
		
		if (username !== null) {
			let jsonUrl = 'https://bgg-json.azurewebsites.net/collection/' + username + '?grouped=true';
			this.fetchCollection(jsonUrl);
		}
	}

	render() {
		const columns = [
			{
				Header: 'Rank',
				accessor: 'rank',
				maxWidth: 75
			},
			{
				Header: '',
				accessor: 'thumbnail',
				maxWidth: 120,
				sortable: false,
				Cell: props => <img src={ props.value } height="64" alt="thumbnail" className='thumbnail' />
			},
			{
				Header: 'Title',
				accessor: 'name',
				minWidth: 150,
				maxWidth: 450,
				filterable: true,
				style: { 'whiteSpace': 'unset'}, // Allows word wrap
				Cell: props => <div>
								<a href={ 'https://boardgamegeek.com/boardgame/' + props.original.gameId } target="_blank" rel="noopener noreferrer">
									{ props.value }
								</a> <span className='yearPublished'>({ props.original.yearPublished })</span>
							   </div>
			},
			{
				Header: 'Avg Rating',
				accessor: 'averageRating',
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
				accessor: 'minPlayers',
				filterable: true,
				maxWidth: 100
			},
			{
				Header: 'Max Players',
				accessor: 'maxPlayers',
				filterable: true,
				defaultSortDesc: true,
				maxWidth: 100
			},
			{
				Header: 'Play Time',
				accessor: 'playingTime',
				filterable: true,
				defaultSortDesc: true,
				maxWidth: 100
			},
			// {
			// 	Header: 'Comment',
			// 	accessor: 'userComment',
			// 	Cell: props => <div title={ props.value }>{ props.value }</div> // Longs comments will cutoff. Hover reveals tooltip with full comment
			// }
		]

		return (
			<div className='container'>
				<h1>Better BGG Collection</h1>
				<p>Enter your BoardGameGeek username below to pull up your collection!</p>
				<UsernameField />
				<p className='tipText'>Tip: Hold shift when sorting to multi-sort!</p>
				<ReactTable 
					data = { this.state.gameList }
					columns = { columns }
					defaultSorted = { [{ id: "rank", desc: false }] }
					minRows = { 5 }
					defaultPageSize = { 50 }
					noDataText = { 'No games found or you haven\'t entered your username yet' }
					className = '-highlight'
					defaultFilterMethod = {
						/* Slightly modifying defaultFilterMethod. Changing startsWith to includes and putting a toLowerCase for both row and filter so case doesn't matter when the user searchs */
						(filter, row) => {
							const id = filter.pivotId || filter.id;
							return row[id] !== undefined ? String(row[id]).toLowerCase().includes(filter.value.toLowerCase()) : true
						}
					}
					
				/>
				<div id='footer'>
					<p>Page created with <span role="img" aria-label="Red Heart">❤️</span></p>
					<p>Made possible by the <a href='https://bgg-json.azurewebsites.net/'>BGG JSON API</a> by <a href='https://blog.ewal.net/'>Erv Walter</a></p>
				</div>
			</div>
		)
	}
	
}

export default App;