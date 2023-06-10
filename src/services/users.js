/* eslint-disable no-unused-vars */
import { actions } from '../app/';
import {
	adminDelete,
	adminGet,
	adminPut,
	userDelete,
	userGet,
	userPost,
	userPut,
} from '../utils/Axios/axiosInstance';

// USERS
export const getAllUsersSV = async (props = {}) => {
	const { token, dispatch, state } = props;
	try {
		const resGet = await adminGet(`user`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				data: {
					...state.set.data,
					dataUser: resGet?.metadata,
				},
			}),
		);
	} catch (err) {
		alert(err?.response?.data?.message || 'Get data failed!');
	}
};
export const updateUserSV = async (props = {}) => {
	const {
		idUser,
		setIsProcess,
		token,
		statusUpdate,
		statusCurrent,
		dispatch,
		state,
		setSnackbar,
		setModalChangeRoles,
	} = props;
	try {
		const resPut = await adminPut(
			`user/${idUser}`,
			{
				roles:
					statusUpdate.toLowerCase() || statusCurrent.toLowerCase(),
			},
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		const resGet = await adminGet(`user`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				data: {
					...state.set.data,
					dataUser: resGet?.metadata,
				},
			}),
		);
		setIsProcess(false);
		setModalChangeRoles(false);
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
export const blockUserSV = async (props = {}) => {
	const {
		idUser,
		token,
		dispatch,
		state,
		Lock,
		setSnackbar,
		setIsProcessBlockUser,
	} = props;
	try {
		const resPut = await adminPut(
			`user/${idUser}`,
			{
				Lock: Lock,
			},
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		const resGet = await adminGet(`user/${idUser}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				edit: {
					...state.set.edit,
					itemData: resGet?.metadata,
				},
			}),
		);
		setIsProcessBlockUser(false);
		setSnackbar({
			open: true,
			type: 'success',
			message: !Lock
				? 'Unblock user successfully'
				: 'Block user successfully',
		});
	} catch (err) {
		setIsProcessBlockUser(false);
		setSnackbar({
			open: true,
			type: 'error',
			message: err?.response?.data?.message || 'Block user failed!',
		});
	}
};
export const changePasswordUserSV = async (props = {}) => {
	const {
		idUser,
		token,
		dispatch,
		state,
		password,
		setSnackbar,
		setIsProcessChangePwd,
	} = props;
	try {
		const resPut = await adminPut(
			`user/${idUser}`,
			{
				password,
			},
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		const resGet = await adminGet(`user/${idUser}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				edit: {
					...state.set.edit,
					itemData: resGet?.metadata,
				},
			}),
		);
		dispatch(actions.toggleModal({ ...state.toggle, modalDelete: false }));
		setIsProcessChangePwd(false);
		setSnackbar({
			open: true,
			type: 'success',
			message: resPut?.message || 'Change password successfully',
		});
	} catch (err) {
		setIsProcessChangePwd(false);
		setSnackbar({
			open: true,
			type: 'error',
			message: err?.response?.data?.message || 'Change password failed!',
		});
	}
};
export const getUserByIdSV = async (props = {}) => {
	const { idUser, token, dispatch, state, setSnackbar } = props;
	try {
		const resGet = await adminGet(`user/${idUser}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				edit: {
					...state.set.edit,
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
export const deleteUserSV = async (props = {}) => {
	const { idUser, dispatch, state, token, setSnackbar, setIsProcess } = props;
	try {
		const resDel = await adminDelete(`user/${idUser}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const resGet = await adminGet(`user`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				data: {
					...state.set.data,
					dataUser: resGet?.metadata,
				},
			}),
		);
		setIsProcess(false);
		dispatch(
			actions.toggleModal({
				...state.toggle,
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
// CHAT
export const getAllChatByEmailSV = async (props = {}) => {
	const { emailUser, setDataMessage, token } = props;
	try {
		const resGet = await userGet(`message/${emailUser}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		setDataMessage(resGet?.metadata);
	} catch (err) {
		console.log(err);
		alert(err?.response?.data?.message || 'Load data failed!');
	}
};
export const clearChatSV = async (props = {}) => {
	const { emailUser, token, setDataMessage, setIsProcess } = props;
	try {
		const resDel = await userDelete(
			`message/delete/${emailUser}`,
			{ headers: { Authorization: `Bearer ${token}` } },
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		setIsProcess(false);
		setDataMessage([]);
	} catch (err) {
		setIsProcess(false);
		alert(err?.response?.data?.message || 'Clear data failed!');
	}
};
