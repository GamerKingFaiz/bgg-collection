import React from 'react';

/* Shared sort helpers: force null / undefined / 'N/A' / '--' to the bottom.
   `topSort` is the descending variant used for "higher = better" columns. */
const bottomSort = (a, b) => {
    a = a === null || a === undefined || a === 'N/A' || a === '--' ? Infinity : a;
    b = b === null || b === undefined || b === 'N/A' || b === '--' ? Infinity : b;
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
};
const topSort = (a, b) => {
    a = a === null || a === undefined || a === 'N/A' || a === '--' ? -Infinity : a;
    b = b === null || b === undefined || b === 'N/A' || b === '--' ? -Infinity : b;
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
};

/* Each game row is the flat object the backend returns:
   { id, name, year, rank, thumbnail, average, minPlayers, maxPlayers, playTime, weight } */
const columns = [
    {
        Header: 'Rank',
        accessor: 'rank',
        maxWidth: 75,
        sortMethod: bottomSort,
    },
    {
        Header: '',
        accessor: 'thumbnail',
        maxWidth: 75,
        sortable: false,
        Cell: props => props.value ? <img loading="lazy" src={props.value} width="64" alt="thumbnail" className='thumbnail' /> : null,
    },
    {
        Header: 'Title',
        accessor: 'name',
        minWidth: 150,
        maxWidth: 450,
        filterable: true,
        style: { 'whiteSpace': 'unset' }, // Allows word wrap
        Cell: props => <div className='title'>
            <a href={'https://boardgamegeek.com/boardgame/' + props.original.id} target="_blank" rel="noopener noreferrer">
                {props.value}
            </a> <span className='yearPublished'>({props.original.year ?? '--'})</span>
        </div>,
    },
    {
        Header: 'Avg Rating',
        accessor: 'average',
        defaultSortDesc: true,
        maxWidth: 100,
        Cell: props => {
            const value = props.value;
            const rounded = value == null ? 0 : Math.round(10 * value) / 10; // Rounding to the tenths place
            return <div className='ratingContainer'>
                <div className='averageRating'
                    /* Setting background colors for the different ranges */
                    style={{ backgroundColor:
                        rounded >= 9 ? '#249563'
                            : rounded >= 8 ? '#2fc482'
                                : rounded >= 7 ? '#1d8acd'
                                    : rounded >= 5 ? '#5369a2'
                                        : rounded >= 3 ? '#df4751'
                                            : '#db303b' }}>
                    {value == null ? '--' : rounded}
                </div>
            </div>;
        },
    },
    {
        Header: 'Min Players',
        accessor: 'minPlayers',
        maxWidth: 100,
        sortMethod: bottomSort,
    },
    {
        Header: 'Max Players',
        accessor: 'maxPlayers',
        defaultSortDesc: true,
        maxWidth: 100,
        sortMethod: topSort,
    },
    {
        Header: 'Play Time',
        accessor: 'playTime',
        defaultSortDesc: true,
        maxWidth: 100,
        sortMethod: topSort,
        Cell: props => <span>{props.value} Min</span>,
    },
    {
        Header: 'Weight',
        accessor: 'weight',
        maxWidth: 100,
        Cell: props => {
            const value = props.value;
            const rounded = value == null ? 0 : Math.round(100 * value) / 100; // Rounding to the hundreths place
            return <strong><span
                style={{ color:
                    rounded >= 3 ? '#ff6b26'
                    : '#5bda98' }}>
                {value == null ? '--' : rounded}</span> / 5</strong>;
        },
    },
];

export default columns;