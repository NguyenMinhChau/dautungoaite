/* eslint-disable no-unused-vars */
import { actions } from '../app/';
import {
	userDelete,
	userGet,
	userPost,
	userPut,
} from '../utils/Axios/axiosInstance';

export const getAllAccountSV = async (props = {}) => {
	const { token, idUser, dispatch } = props;
	try {
		const resGet = await userGet(`account/${idUser}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				dataUser: resGet?.metadata,
			}),
		);
	} catch (err) {
		alert(err?.response?.data?.message || 'Get data failed!');
	}
};
export const createAccountSV = async (props = {}) => {
	const {
		username,
		password,
		host,
		port,
		token,
		idUser,
		dispatch,
		setIsProcess,
		setModalCreateAccount,
		setDataFormCreateAccount,
	} = props;
	try {
		const resPost = await userPost(
			`account/${idUser}`,
			{
				username,
				password,
				host,
				port,
			},
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		const resGet = await userGet(`account/${idUser}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				dataUser: resGet?.metadata,
			}),
		);
		setDataFormCreateAccount({
			username: '',
			password: '',
			host: '',
			port: '',
		});
		setIsProcess(false);
		setModalCreateAccount(false);
		alert(resPost?.message || 'Create successfully');
	} catch (err) {
		setIsProcess(false);
		alert(err?.response?.data?.message || 'Create data failed!');
	}
};
export const deleteAccountSV = async (props = {}) => {
	const { idAccount, token, setIsProcess, dispatch } = props;
	try {
		const resDel = await userDelete(
			`account/${idAccount}`,
			{},
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		setIsProcess(false);
		dispatch(
			actions.toggleModal({
				modalDelete: false,
			}),
		);
		alert(resDel?.message || 'Delete successfully');
	} catch (err) {
		setIsProcess(false);
		alert(err?.response?.data?.message || 'Delete data failed!');
	}
};
export const updateAccountSV = async (props = {}) => {
	const {
		idAccount,
		setIsProcess,
		token,
		body,
		setModalCreateAccount,
		setDataFormCreateAccount,
		setIsUpdateAccount,
	} = props;
	try {
		const resPut = await userPut(
			`account/${idAccount}`,
			{ body },
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		// get account byID
		// setDataFormCreateAccount({
		// 	username: '',
		// 	password: '',
		// 	host: '',
		// 	port: '',
		// });
		setIsProcess(false);
		setIsUpdateAccount(false);
		setModalCreateAccount(false);
		alert(resPut?.message || 'Update successfully');
	} catch (err) {
		setIsProcess(false);
		alert(err?.response?.data?.message || 'Update data failed!');
	}
};

// CHAT
export const getAllChatByEmailSV = async (props = {}) => {
	const { emailUser, setDataMessage, token } = props;
	try {
		const resGet = await userGet(`message/${emailUser}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		setDataMessage(resGet?.metadata);
	} catch (err) {
		alert(err?.response?.data?.message || 'Load data failed!');
	}
};
