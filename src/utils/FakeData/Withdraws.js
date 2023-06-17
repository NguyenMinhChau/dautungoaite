const DataWithdraws = (Icons) => {
	return {
		headers: {
			name: process.env.REACT_APP_WITHDRAW_NAME,
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
				title: 'Receiving Wallet',
			},
			h4: {
				title: 'Gate Payment',
			},
			h5: {
				title: 'Created At',
				iconSort: <i className="fa-solid fa-sort"></i>,
			},
			h6: {
				title: 'Status',
			},
		},
	};
};

export default DataWithdraws;
