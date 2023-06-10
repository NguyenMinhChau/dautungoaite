const DataUsers = (Icons) => {
	return {
		headers: {
			name: process.env.REACT_APP_USER_NAME,
			index: {
				title: 'No',
			},
			h1: {
				title: 'Email',
				iconSort: <i className="fa-solid fa-sort"></i>,
			},
			h2: {
				title: 'Chat ID',
			},
			h3: {
				title: 'Point',
			},
			h4: {
				title: 'Created At',
			},
			h5: {
				title: 'Roles',
			},
		},
	};
};

export default DataUsers;
