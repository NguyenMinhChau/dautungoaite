/* eslint-disable no-unused-vars */
import { actions } from '../app/';
import {
	userDelete,
	userGet,
	userPost,
	userPut,
} from '../utils/Axios/axiosInstance';

export const getByIdDepositsSV = async (props = {}) => {
	const { idDeposits, token, dispatch } = props;
	try {
		const resGet = await userGet(`deposit/${idDeposits}`, {
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
		alert(err?.response?.data?.message || 'Get data failed!');
	}
};
export const getByIdUserDepositsSV = async (props = {}) => {
	const { idUser, token, dispatch } = props;
	try {
		const resGet = await userGet(`deposit/${idUser}`, {
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
		alert(err?.response?.data?.message || 'Get data failed!');
	}
};
export const addDepositsSV = async (props = {}) => {
	const {
		idUser,
		token,
		quantity,
		pathImage,
		setIsProcess,
		setModalCreateDeposits,
	} = props;
	try {
		const resPost = await userPost(
			`deposit/${idUser}`,
			{
				quantity,
				pathImage,
			},
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		setIsProcess(false);
		setModalCreateDeposits(false);
		alert(resPost?.message || 'Add data successfully!');
	} catch (err) {
		setIsProcess(false);
		alert(err?.response?.data?.message || 'Add data failed!');
	}
};
export const deleteDepositsSV = async (props = {}) => {
	const { idDeposits, token, setIsProcess, dispatch } = props;
	try {
		const resDel = await userDelete(
			`deposit/${idDeposits}`,
			{},
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		setIsProcess(false);
		dispatch(
			actions.toggleModal({
				modalDelete: false,
			}),
		);
		alert(resDel?.message || 'Delete data successfully!');
	} catch (err) {
		setIsProcess(false);
		alert(err?.response?.data?.message || 'Delete data failed!');
	}
};
export const updateDepositsSV = async (props = {}) => {
	const {
		idDeposits,
		idUser,
		token,
		body,
		setIsProcess,
		setModalCreateDeposits,
		dispatch,
	} = props;
	try {
		const resPut = await userPut(
			`deposit/${idUser}`,
			{ body },
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		setIsProcess(false);
		setModalCreateDeposits(false);
		alert(resPut?.message || 'Update data successfully!');
	} catch (err) {
		setIsProcess(false);
		alert(err?.response?.data?.message || 'Update data failed!');
	}
};
