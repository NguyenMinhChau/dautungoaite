const DataAccounts = (Icons) => {
	return {
		headers: {
			name: process.env.REACT_APP_USER_NAME,
			index: {
				title: 'No',
			},
			h1: {
				title: 'Account name',
				iconSort: <i className="fa-solid fa-sort"></i>,
			},
			h2: {
				title: 'Username',
			},
			h3: {
				title: 'Host',
			},
			h4: {
				title: 'Port',
			},
			h5: {
				title: 'Server Broker',
			},
			h6: {
				title: 'Type Acc',
			},
			h7: {
				title: 'Created At',
			},
		},
	};
};

export default DataAccounts;
