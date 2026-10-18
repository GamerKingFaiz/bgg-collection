import React from 'react';

/* Shared sort helpers: force null / undefined / 'N/A' / '--' to the bottom.
   `topSort` is the descending variant used for "higher = better" columns. */
const bottomSort = (rowA, rowB, columnId) => {
    let a = rowA.getValue(columnId);
    let b = rowB.getValue(columnId);
    a = a === null || a === undefined || a === 'N/A' || a === '--' ? Infinity : a;
    b = b === null || b === undefined || b === 'N/A' || b === '--' ? Infinity : b;
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
};
const topSort = (rowA, rowB, columnId) => {
    let a = rowA.getValue(columnId);
    let b = rowB.getValue(columnId);
    a = a === null || a === undefined || a === 'N/A' || a === '--' ? -Infinity : a;
    b = b === null || b === undefined || b === 'N/A' || b === '--' ? -Infinity : b;
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
};

/* Case-insensitive "includes" filter, replacing react-table's defaultFilterMethod. */
const includesFilter = (row, columnId, filterValue) => {
    const value = row.getValue(columnId);
    return value != null ? String(value).toLowerCase().includes(String(filterValue).toLowerCase()) : true;
};

/* Shared header renderer: sort toggle + filter input. The first-click sort
   direction is declared per-column via the `sortDescFirst` option, so this
   handler just toggles and lets the table pick the direction. */
const makeHeader = (label) => ({ column }) => {
    const canSort = column.getCanSort();
    return (
        <div className='headerCell'>
            <span
                className='headerLabel'
                style={{ cursor: canSort ? 'pointer' : 'default' }}
                onClick={(event) => {
                    if (!canSort) return;
                    /* Hold shift to multi-sort (add this column to the existing
                       sort order) instead of replacing it. */
                    column.toggleSorting(undefined, event.shiftKey);
                }}
            >
                {label}
                {column.getIsSorted() === 'asc' && ' ▲'}
                {column.getIsSorted() === 'desc' && ' ▼'}
            </span>
            {column.getCanFilter() && (
                <input
                    placeholder="Search..."
                    value={column.getFilterValue() ?? ''}
                    onChange={e => column.setFilterValue(e.target.value)}
                />
            )}
        </div>
    );
};

/* Each game row is the flat object the backend returns:
   { id, name, year, rank, thumbnail, average, minPlayers, maxPlayers, playTime, weight } */
const columns = [
    {
        accessorKey: 'rank',
        size: 75,
        sortingFn: bottomSort,
        sortDescFirst: false, // Low number (best) first
        enableColumnFilter: false,
        header: makeHeader('Rank'),
    },
    {
        header: '',
        accessorKey: 'thumbnail',
        size: 75,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ getValue }) => getValue()
            ? <img loading="lazy" src={getValue()} width="64" alt="thumbnail" className='thumbnail' />
            : null,
    },
    {
        accessorKey: 'name',
        size: 450,
        minSize: 150,
        sortDescFirst: false, // A–Z first
        enableColumnFilter: true,
        filterFn: includesFilter,
        style: { 'whiteSpace': 'unset' }, // Allows word wrap
        header: makeHeader('Title'),
        cell: ({ getValue, row }) => <div className='title'>
            <a href={'https://boardgamegeek.com/boardgame/' + row.original.id} target="_blank" rel="noopener noreferrer">
                {getValue()}
            </a> <span className='yearPublished'>({row.original.year ?? '--'})</span>
        </div>,
    },
    {
        accessorKey: 'average',
        size: 100,
        sortDescFirst: true, // Highest rating first
        enableColumnFilter: false,
        cell: ({ getValue }) => {
            const value = getValue();
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
        header: makeHeader('Avg Rating'),
    },
    {
        accessorKey: 'minPlayers',
        size: 100,
        sortingFn: bottomSort,
        sortDescFirst: false, // Fewest players first
        enableColumnFilter: false,
        header: makeHeader('Min Players'),
    },
    {
        accessorKey: 'maxPlayers',
        size: 100,
        sortingFn: topSort,
        sortDescFirst: true, // Most players first
        enableColumnFilter: false,
        header: makeHeader('Max Players'),
    },
    {
        accessorKey: 'playTime',
        size: 100,
        sortingFn: topSort,
        sortDescFirst: true, // Longest first
        enableColumnFilter: false,
        header: makeHeader('Play Time'),
        cell: ({ getValue }) => <span>{getValue()} Min</span>,
    },
    {
        accessorKey: 'weight',
        size: 100,
        sortDescFirst: false, // Lightest (lowest weight) first
        enableColumnFilter: false,
        header: makeHeader('Weight'),
        cell: ({ getValue }) => {
            const value = getValue();
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