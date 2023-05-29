const KEY = 'loginDataForexTrade';

export const getStore = () => {
	return JSON.parse(localStorage.getItem(KEY));
};
export const setStore = (data) => {
	return localStorage.setItem(KEY, JSON.stringify(data));
};
export const removeStore = () => {
	return localStorage.removeItem(KEY);
};
