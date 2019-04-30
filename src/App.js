import React, { Component } from 'react';
import './App.css';

// Import React Table
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class App extends Component {

	constructor() {
		super();
		this.state = {
			gameList: []
		}
	}

	componentDidMount() {
		/* Grabbing the URL params */
		let params = (new URL(document.location)).searchParams;
		let username = params.get("username");
		
		let jsonUrl = 'https://bgg-json.azurewebsites.net/collection/' + username + '?grouped=true';

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
				Cell: props => <img src={ props.value } height="64" alt="thumbnail" className='thumbnail' />
			},
			{
				Header: 'Title',
				accessor: 'name',
				minWidth: 150,
				maxWidth: 450,
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
				maxWidth: 100
			},
			{
				Header: 'Max Players',
				accessor: 'maxPlayers',
				defaultSortDesc: true,
				maxWidth: 100
			},
			{
				Header: 'Play Time',
				accessor: 'playingTime',
				defaultSortDesc: true,
				maxWidth: 100
			},
			{
				Header: 'Comment',
				accessor: 'userComment',
				Cell: props => <div title={ props.value }>{ props.value }</div> // Longs comments will cutoff. Hover reveals tooltip with full comment
			}
		]

		return (
			<ReactTable 
				data={ this.state.gameList }
				columns={ columns }
				defaultSorted={ [{ id: "rank", desc: false }] }
				defaultPageSize={ 50 }
			/>
		)
	}
	
}

export default App;