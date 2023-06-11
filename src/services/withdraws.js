/* eslint-disable no-unused-vars */
import { actions } from '../app/';
import { adminDelete, adminGet, adminPut } from '../utils/Axios/axiosInstance';

// WITHDRAWS
export const getAllWithdrawsSV = async (props = {}) => {
	const { token, dispatch, state, setSnackbar } = props;
	try {
		const resGet = await adminGet('withdraw', {
			headers: { Authorization: `Bearer ${token}` },
		});
		const resGetUser = await adminGet(`user`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				data: {
					...state.set.data,
					dataWithdraw: resGet?.metadata,
					dataUser: resGetUser?.metadata,
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
export const getWithdrawByIdSV = async (props = {}) => {
	const { idWithdraw, token, dispatch, setSnackbar } = props;
	try {
		const resGet = await adminGet(`withdraw/${idWithdraw}`, {
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
export const updateWithdrawsSV = async (props = {}) => {
	const {
		idWithdraw,
		token,
		statusUpdate,
		statusCurrent,
		setIsProcess,
		dispatch,
		state,
		setSnackbar,
	} = props;
	try {
		const resPut = await adminPut(
			`withdraw/handle/${idWithdraw}`,
			{ status: statusUpdate || statusCurrent },
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		const resGet = await adminGet('withdraw', {
			headers: { Authorization: `Bearer ${token}` },
		});
		const resGetUser = await adminGet(`user`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		console.log(resPut);

		dispatch(
			actions.setData({
				data: {
					...state.set.data,
					dataWithdraw: resGet?.metadata,
					dataUser: resGetUser?.metadata,
				},
			}),
		);
		setIsProcess(false);
		dispatch(actions.toggleModal({ ...state.toggle, modalStatus: false }));
		setSnackbar({
			open: true,
			type: 'success',
			message: resPut?.message || 'Update data successfully!',
		});
	} catch (err) {
		console.log(err);
		setIsProcess(false);
		setSnackbar({
			open: true,
			type: 'error',
			message: err?.response?.data?.message || 'Update data failed!',
		});
	}
};
export const deleteWithdrawsSV = async (props = {}) => {
	const { idWithdraw, token, setIsProcess, dispatch, state, setSnackbar } =
		props;
	try {
		const resDel = await adminDelete(`withdraw/${idWithdraw}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const resGet = await adminGet('withdraw', {
			headers: { Authorization: `Bearer ${token}` },
		});
		const resGetUser = await adminGet(`user`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				data: {
					...state.set.data,
					dataWithdraw: resGet?.metadata,
					dataUser: resGetUser?.metadata,
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
			message: resDel?.message || 'Delete data successfully!',
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
