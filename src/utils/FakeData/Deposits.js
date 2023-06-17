const DataDeposits = (Icons) => {
	return {
		headers: {
			name: process.env.REACT_APP_DEPOSITS_NAME,
			index: {
				title: 'No',
			},
			h1: {
				title: 'User email',
			},
			h2: {
				title: 'Amount (USDT)',
			},
			h3: {
				title: 'Created At',
				iconSort: <i className="fa-solid fa-sort"></i>,
			},
			h4: {
				title: 'Status',
			},
		},
	};
};

export default DataDeposits;
