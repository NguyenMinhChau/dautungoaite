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
				title: 'Amount',
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

export default DataWithdraws;
