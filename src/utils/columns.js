import React from 'react';

const columns = [
    {
        Header: 'Rank',
        accessor: 'statistics[0].ratings[0].ranks[0].rank[0].$.value',
        maxWidth: 75,
        // sortMethod: (a,b) => {
        //     // force null, undefined, and N/A to the bottom
        //     a = a === null || a === undefined || a === 'N/A' ? Infinity : a
        //     b = b === null || b === undefined || b === 'N/A' ? Infinity : b
        //     // Return either 1 or -1 to indicate a sort priority
        //     if (a > b) {
        //         return 1
        //     }
        //     if (a < b) {
        //         return -1
        //     }
        //     // returning 0, undefined or any falsey value will use subsequent sorts or
        //     // the index as a tiebreaker
        //     return 0
        // }
    },
    {
        Header: '',
        accessor: 'thumbnail[0]',
        maxWidth: 75,
        // sortable: false,
        Cell: ({value}) => <img src={ value } width="64" alt="thumbnail" className='thumbnail' />
    },
    {
        Header: 'Title',
        accessor: 'name[0].$.value',
        minWidth: 150,
        maxWidth: 450,
        // filterable: true,
        // style: { 'whiteSpace': 'unset'}, // Allows word wrap
        Cell: ({value}) => <div className='title'>
                        {/* <a href={ 'https://boardgamegeek.com/boardgame/' + props.original.$.id } target="_blank" rel="noopener noreferrer"> */}
                            { value }
                        {/* </a> <span className='yearPublished'>({ props.original.yearpublished[0].$.value })</span> */}
                        </div>
    },
    {
        Header: 'Avg Rating',
        accessor: 'statistics[0].ratings[0].average[0].$.value',
        // defaultSortDesc: true,
        maxWidth: 100,
        Cell: ({value}) => 	<div className='ratingContainer'>
                            <div className='averageRating'
                                /* Setting background colors for the different ranges */
                                    style={{backgroundColor:
                                    Math.round(10 * value)/10 >= 9 ? '#249563' // Rounding to the tenths place
                                    : Math.round(10 * value)/10 >= 8 ?  '#2fc482'
                                    : Math.round(10 * value)/10 >= 7 ?  '#1d8acd'
                                    : Math.round(10 * value)/10 >= 5 ?  '#5369a2'
                                    : Math.round(10 * value)/10 >= 3 ?  '#df4751'
                                    : '#db303b'
                            }}>
                                { /* The average rating number to be displayd */ }
                                { Math.round(10 * value)/10 }
                                
                            </div>
                        </div>
    },
    {
        Header: 'Min Players',
        accessor: 'minplayers[0].$.value',
        maxWidth: 100,
        // sortMethod: (a,b) => {
        //     // force null, undefined, and N/A to the bottom
        //     a = a === null || a === undefined || a === '--' ? Infinity : a
        //     b = b === null || b === undefined || b === '--' ? Infinity : b
        //     // Return either 1 or -1 to indicate a sort priority
        //     if (a > b) {
        //         return 1
        //     }
        //     if (a < b) {
        //         return -1
        //     }
        //     // returning 0, undefined or any falsey value will use subsequent sorts or
        //     // the index as a tiebreaker
        //     return 0
        // }
    },
    {
        Header: 'Max Players',
        accessor: 'maxplayers[0].$.value',
        // defaultSortDesc: true,
        maxWidth: 100,
        // sortMethod: (a,b) => {
        //     // force null, undefined, and N/A to the bottom
        //     a = a === null || a === undefined || a === '--' ? -Infinity : a
        //     b = b === null || b === undefined || b === '--' ? -Infinity : b
        //     // Return either 1 or -1 to indicate a sort priority
        //     if (a > b) {
        //         return 1
        //     }
        //     if (a < b) {
        //         return -1
        //     }
        //     // returning 0, undefined or any falsey value will use subsequent sorts or
        //     // the index as a tiebreaker
        //     return 0
        // }
    },
    {
        Header: 'Play Time',
        accessor: 'maxplaytime[0].$.value',
        // defaultSortDesc: true,
        maxWidth: 100,
        // sortMethod: (a,b) => {
        //     // force null, undefined, and N/A to the bottom
        //     a = a === null || a === undefined || a === '--' ? -Infinity : a
        //     b = b === null || b === undefined || b === '--' ? -Infinity : b
        //     // Return either 1 or -1 to indicate a sort priority
        //     if (a > b) {
        //         return 1
        //     }
        //     if (a < b) {
        //         return -1
        //     }
        //     // returning 0, undefined or any falsey value will use subsequent sorts or
        //     // the index as a tiebreaker
        //     return 0
        // },
        Cell: ({value}) => <span>{value} Min</span>
    },
    {
        Header: 'Weight',
        accessor: 'statistics[0].ratings[0].averageweight[0].$.value',
        maxWidth: 100,
        Cell: ({value}) => 	<strong><span
                            style={{color:
                                Math.round(100 * value)/100 >=5 ? '#ff6b26' // Rounding to the hundreths place
                                : Math.round(100 * value)/100 >=4 ? '#ff6b26'
                                : Math.round(100 * value)/100 >=3 ? '#ff6b26'
                                : Math.round(100 * value)/100 >=2 ? '#5bda98'
                                : '#5bda98'
                        }}>
                            { Math.round(100 * value)/100 }</span> / 5</strong>
                        
    }
]

export default columns;