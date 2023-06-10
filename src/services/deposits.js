/* eslint-disable no-unused-vars */
import { actions } from '../app/';
import { adminDelete, adminGet, adminPut } from '../utils/Axios/axiosInstance';

export const getAllDepositsSV = async (props = {}) => {
	const { token, dispatch, state, setSnackbar } = props;
	try {
		const resGet = await adminGet('deposit', {
			headers: { Authorization: `Bearer ${token}` },
		});
		const resGetUser = await adminGet(`user`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				data: {
					...state.set.data,
					dataDeposits: resGet?.metadata,
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
export const getDepositByIdSV = async (props = {}) => {
	const { idDeposits, token, dispatch, setSnackbar } = props;
	try {
		const resGet = await adminGet(`deposit/${idDeposits}`, {
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
export const updateDepositsSV = async (props = {}) => {
	const {
		idDeposits,
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
			`deposit/${idDeposits}`,
			{ status: statusUpdate || statusCurrent },
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		const resGet = await adminGet('deposit', {
			headers: { Authorization: `Bearer ${token}` },
		});
		const resGetUser = await adminGet(`user`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				data: {
					...state.set.data,
					dataDeposits: resGet?.metadata,
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
		setIsProcess(false);
		setSnackbar({
			open: true,
			type: 'error',
			message: err?.response?.data?.message || 'Update data failed!',
		});
	}
};
export const deleteDepositsSV = async (props = {}) => {
	const { idDeposits, token, setIsProcess, dispatch, state, setSnackbar } =
		props;
	try {
		const resDel = await adminDelete(`deposit/${idDeposits}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const resGet = await adminGet('deposit', {
			headers: { Authorization: `Bearer ${token}` },
		});
		const resGetUser = await adminGet(`user`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(
			actions.setData({
				data: {
					...state.set.data,
					dataDeposits: resGet?.metadata,
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
