const DataAccounts = (Icons) => {
	return {
		headers: {
			name: process.env.REACT_APP_USER_NAME,
			index: {
				title: 'No',
			},
			h1: {
				title: 'Type Acc',
			},
			h2: {
				title: 'Account number',
				iconSort: <i className="fa-solid fa-sort"></i>,
			},
			h3: {
				title: 'Account name',
			},
			h4: {
				title: 'Server Broker',
			},
			h5: {
				title: 'Host',
			},
			h6: {
				title: 'Port',
			},
			h7: {
				title: 'Created At',
			},
		},
	};
};

export default DataAccounts;
