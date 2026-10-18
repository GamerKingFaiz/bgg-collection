import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import bggLogoUrl from '../assets/powered-by-bgg-rgb.svg';
import UsernameField from '../Components/UsernameField';
import columns from '../utils/columns';
import { COLLECTION_ENDPOINT } from '../utils/urlConstants';
import './App.css';

const App = () => {

	const [gameList, setGameList] = useState([]);
	const [count, setCount] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	/* Controlled pagination state. `pageSize` defaults to 300 (the old React Table
	   default) and can be overridden on load via the ?rows= URL param. */
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 300 });
	/* Controlled sorting state, initialized to rank ascending (the old default). */
	const [sorting, setSorting] = useState([{ id: 'rank', desc: false }]);

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
		/* Grabbing the URL params */
		let params = (new URL(document.location)).searchParams;
		let username = params.get("username");

		/* Allowing the user to specify size of the page onLoad */
		let rows = params.get("rows");
		if (rows !== null) {
			setPagination(prev => ({ ...prev, pageSize: Number(rows) }));
		}
		
		/* This call is made for if the website is loaded with params attached already */
		if (username !== null) {
			fetchCollection(username);
		}

		/* Re-fetch (or clear) the collection when the user navigates
		back/forward between username entries via the browser history. */
		const onPopState = () => {
			const username = new URLSearchParams(window.location.search).get("username");
			if (username) {
				fetchCollection(username);
			} else {
				setGameList([]);
				setCount(null);
			}
		};
		window.addEventListener("popstate", onPopState);
		return () => window.removeEventListener("popstate", onPopState);
	}, [fetchCollection]);

	/* Build the TanStack table instance. Sorting and pagination are controlled so
	   the page size can be driven by the ?rows= URL param and the default sort
	   (rank ascending) is applied on load. */
	const table = useReactTable({
		data: gameList,
		columns,
		state: {
			sorting, // Page loads with rank as the default sorted column
			pagination,
		},
		onSortingChange: updater => {
			const next = typeof updater === 'function' ? updater(table.getState().sorting) : updater;
			setSorting(next);
		},
		onPaginationChange: updater => {
			const next = typeof updater === 'function' ? updater(table.getState().pagination) : updater;
			setPagination(next);
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		pageSizeOptions: [5, 10, 25, 50, 100, 300, 500, 1000, 2000, 5000, 10000],
	});

	const noDataText = loading
		? "Loading..."
		: (new URL(document.location)).searchParams.get("username")
			? "No games found"
			: "Enter a username to load a collection";

	/* If the current page size (e.g. from ?rows=21) isn't in pageSizeOptions,
	   include it so the dropdown reflects the actual page size instead of
	   falling back to the first option. */
	const pageSize = table.getState().pagination.pageSize;
	const pageSizeOptions = table.options.pageSizeOptions.includes(pageSize)
		? table.options.pageSizeOptions
		: [...table.options.pageSizeOptions, pageSize].sort((a, b) => a - b);

	/* Pagination controls */
	const paginationBar = (
		<div className='pagination'>
			<button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>«</button>
			<button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>‹</button>
			<span>
				Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
			</span>
			<button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>›</button>
			<button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>»</button>
			<label>
				Rows per page:{' '}
				<select
					value={pageSize}
					onChange={e => table.setPageSize(Number(e.target.value))}
				>
					{pageSizeOptions.map(size => (
						<option key={size} value={size}>{size}</option>
					))}
				</select>
			</label>
		</div>
	);

	return (
		<div className='container'>
			<h1><a className="h1Link" href='.'>Better BGG Collection</a></h1>
			<p className='description'>{count !== null ? `Collection size: ${count} games` : 'Enter your BoardGameGeek username below to pull up your collection!'}</p>
			<UsernameField fetchCollection = { fetchCollection } setGameList = { setGameList }/>
			{error && <p className='errorText' role="alert">{error}</p>}
			<p className='tipText'>Tip: Hold shift when sorting to multi-sort!</p>
			{paginationBar}
			<div className='tableWrapper'>
				<table className='gameTable'>
					<thead>
						{table.getHeaderGroups().map(headerGroup => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<th
										key={header.id}
										style={{ width: header.getSize() }}
										colSpan={header.colSpan}
									>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.length === 0
							? <tr><td colSpan={table.getAllLeafColumns().length} className='noData'>{noDataText}</td></tr>
							: table.getRowModel().rows.map(row => (
								<tr key={row.id}>
									{row.getVisibleCells().map(cell => (
										<td key={cell.id} style={cell.column.columnDef.style}>
											{/* Columns without a custom cell render the raw value
											   (react-table v6's default). Guard on the cell *definition*
											   so the thumbnail column's intentional null (no image) is
											   preserved instead of showing the raw URL. */}
											{cell.column.columnDef.cell
												? flexRender(cell.column.columnDef.cell, cell.getContext())
												: cell.getValue()}
										</td>
									))}
								</tr>
							))}
					</tbody>
				</table>
			</div>
			{/* Pagination controls (bottom) */}
			{paginationBar}
			<div id='footer'>
				<p>Page created with <span role="img" aria-label="Red Heart">❤️</span></p>
				<a
					href="https://boardgamegeek.com/wiki/page/BGG_XML_API2"
					target="_blank"
					rel="noreferrer"
					onClick={() => window.umami.track("BGG Logo Clicked")}
				>
					<img loading="lazy" src={bggLogoUrl} alt="Powered by BGG" id="bgg-logo" />
				</a>
			</div>
		</div>
	)
}

export default App;