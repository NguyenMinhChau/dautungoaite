/* eslint-disable no-unused-vars */
import { actions } from '../app/';
import {
	adminDelete,
	adminGet,
	adminPost,
	adminPut,
} from '../utils/Axios/axiosInstance';

// ACCOUNTS
export const getAllAccountSV = async (props = {}) => {
	const { token, dispatch, state, setSnackbar } = props;
	try {
		const resGet = await adminGet('account', {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				data: {
					...state.set.data,
					dataAccount: resGet?.metadata,
				},
			}),
		);
	} catch (err) {
		setSnackbar({
			open: true,
			type: 'error',
			message: err?.response?.data?.message || 'Get data failed!',
		});
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
		state,
		setIsProcess,
		setSnackbar,
		setModalCreateAccount,
		setDataFormCreateAccount,
	} = props;
	try {
		const resPost = await adminPost(
			`account/${idUser}`,
			{
				username,
				password,
				host,
				port,
			},
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		const resGet = await adminGet('account', {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				data: {
					...state.set.data,
					dataAccount: resGet?.metadata,
				},
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
		setSnackbar({
			open: true,
			type: 'success',
			message: resPost?.message || 'Create successfully',
		});
	} catch (err) {
		setIsProcess(false);
		setSnackbar({
			open: true,
			type: 'error',
			message: err?.response?.data?.message || 'Create data failed!',
		});
	}
};
export const getAccountByIdSV = async (props = {}) => {
	const { idAccount, dispatch, setSnackbar, token } = props;
	try {
		const resGet = await adminGet(`account/${idAccount}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				edit: {
					itemData: resGet?.metadata,
				},
			}),
		);
	} catch (err) {
		setSnackbar({
			open: true,
			type: 'error',
			message: err?.response?.data?.message || 'Get data failed!',
		});
	}
};
export const updateAccountSV = async (props = {}) => {
	const {
		idAccount,
		setIsProcess,
		dispatch,
		state,
		token,
		body,
		setModalCreateAccount,
		setIsUpdateAccount,
		setSnackbar,
	} = props;
	try {
		const resPut = await adminPut(
			`account/${idAccount}`,
			{ ...body },
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		const resGet = await adminGet('account', {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				data: {
					...state.set.data,
					dataAccount: resGet?.metadata,
				},
			}),
		);
		setIsProcess(false);
		setIsUpdateAccount(false);
		setModalCreateAccount(false);
		setSnackbar({
			open: true,
			type: 'success',
			message: resPut?.message || 'Update successfully',
		});
	} catch (err) {
		setIsProcess(false);
		setSnackbar({
			open: true,
			type: 'error',
			message: err?.response?.data?.message || 'Update data failed!',
		});
	}
};
export const deleteAccountSV = async (props = {}) => {
	const { idAccount, token, setIsProcess, dispatch, state, setSnackbar } =
		props;
	try {
		const resDel = await adminDelete(`account/${idAccount}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const resGet = await adminGet('account', {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				data: {
					...state.set.data,
					dataAccount: resGet?.metadata,
				},
			}),
		);
		setIsProcess(false);
		dispatch(
			actions.toggleModal({
				modalDelete: false,
			}),
		);
		setSnackbar({
			open: true,
			type: 'success',
			message: resDel?.message || 'Delete successfully',
		});
	} catch (err) {
		setIsProcess(false);
		setSnackbar({
			open: true,
			type: 'error',
			message: err?.response?.data?.message || 'Delete data failed!',
		});
	}
};
