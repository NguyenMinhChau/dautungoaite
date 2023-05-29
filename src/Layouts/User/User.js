/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import className from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
	useAppContext,
	DataUsers,
	deleteUtils,
	handleUtils,
	requestRefreshToken,
	localStoreUtils,
	useDebounce,
} from '../../utils';
import { TrStatus } from '../../components/TableData/TableData';
import routers from '../../routers/routers';
import { actions } from '../../app/';
import { General } from '../';
import { Modal, ActionsTable, SelectStatus, FormInput } from '../../components';
import styles from './User.module.css';
import moment from 'moment';
import {
	getAllAccountSV,
	createAccountSV,
	deleteAccountSV,
	updateAccountSV,
} from '../../services/users';

const cx = className.bind(styles);
const DATA_USERS = DataUsers();

function User() {
	const { state, dispatch } = useAppContext();
	const { headers } = DATA_USERS;
	const {
		edit,
		currentUser,
		statusUpdate,
		statusCurrent,
		data: { dataUser },
		pagination: { page, show },
		searchValues: { user },
	} = state.set;
	const { modalDelete, modalStatus } = state.toggle;
	const [isProcess, setIsProcess] = useState(false);
	const [modalChangeRule, setModalChangeRule] = useState(false);
	const [modalCreateAccount, setModalCreateAccount] = useState(false);
	const [isUpdateAccount, setIsUpdateAccount] = useState(false);
	const [dataFormCreateAccount, setDataFormCreateAccount] = useState({
		username: '',
		password: '',
		host: '',
		port: '',
	});
	const [snackbar, setSnackbar] = useState({
		open: false,
		type: '',
		message: '',
	});
	const getAllAccount = (dataToken) => {
		getAllAccountSV({
			token: dataToken?.token,
			dispatch,
			idUser: currentUser?.id,
		});
	};
	useEffect(() => {
		document.title = `User | ${process.env.REACT_APP_TITLE_WEB}`;
		requestRefreshToken(
			currentUser,
			getAllAccount,
			state,
			dispatch,
			actions,
		);
	}, []);
	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackbar({
			...snackbar,
			open: false,
		});
	};
	const useDebounceUser = useDebounce(user, 500);
	useEffect(() => {
		if (useDebounceUser) {
			setTimeout(() => {
				dispatch(
					actions.setData({
						pagination: { page: 1, show: 10 },
					}),
				);
			}, 500);
		}
	}, [useDebounceUser]);
	useEffect(() => {}, [page, show, useDebounceUser]);
	//Search Data Users
	let dataUserFlag = dataUser?.dataUser || [];
	const toggleEditTrue = async (e, status, id) => {
		await localStoreUtils.setStore({
			...currentUser,
			idUpdate: id,
		});
		deleteUtils.statusTrue(e, status, id, dispatch, state, actions);
	};
	const toggleEditFalse = (e) => {
		return deleteUtils.statusFalse(e, dispatch, state, actions);
	};
	const modalDeleteTrue = (e, id) => {
		return deleteUtils.deleteTrue(e, id, dispatch, state, actions);
	};
	const modalDeleteFalse = (e) => {
		return deleteUtils.deleteFalse(e, dispatch, state, actions);
	};
	const toggleEditRuleTrue = async (e, status, id) => {
		e.stopPropagation();
		await localStoreUtils.setStore({
			...currentUser,
			idUpdate: id,
		});
		setModalChangeRule(true);
		dispatch(
			actions.setData({
				edit: { ...state.set.edit, id },
				statusCurrent: status,
			}),
		);
	};
	const toggleEditRuleFalse = async (e) => {
		e.stopPropagation();
		await 1;
		setModalChangeRule(false);
		dispatch(
			actions.setData({
				statusCurrent: '',
				statusUpdate: '',
			}),
		);
	};
	const openModalCreateAccount = (e) => {
		e.stopPropagation();
		setModalCreateAccount(true);
	};
	const closeModalCreateAccount = (e) => {
		e.stopPropagation();
		setModalCreateAccount(false);
	};
	const handleViewUser = (item) => {
		// setIsUpdateAccount(true);
		// setModalCreateAccount(true);
		dispatch(
			actions.setData({
				edit: {
					...state.set.edit,
					id: item._id || item.id,
					itemData: item,
				},
			}),
		);
	};
	const handleChangeCreateAccount = (e) => {
		setDataFormCreateAccount({
			...dataFormCreateAccount,
			[e.target.name]: e.target.value,
		});
	};
	const createAccount = (dataToken) => {
		createAccountSV({
			username: dataFormCreateAccount.username,
			password: dataFormCreateAccount.password,
			host: dataFormCreateAccount.host,
			port: dataFormCreateAccount.port,
			token: dataToken?.token,
			dispatch,
			idUser: currentUser?.id,
			setIsProcess,
			setModalCreateAccount,
			setDataFormCreateAccount,
		});
	};
	const handleCreateAccount = () => {
		setIsProcess(true);
		requestRefreshToken(
			currentUser,
			createAccount,
			state,
			dispatch,
			actions,
		);
	};
	const updateAccount = (dataToken, id) => {
		updateAccountSV({
			token: dataToken?.token,
			idAccount: id,
			setIsProcess,
			body: { dataFormCreateAccount },
			setModalCreateAccount,
			setDataFormCreateAccount,
			setIsUpdateAccount,
		});
	};
	const handleUpdateAccount = (id) => {
		setIsProcess(true);
		requestRefreshToken(
			currentUser,
			updateAccount,
			state,
			dispatch,
			actions,
			id,
		);
	};
	// Delete User + Update Status User
	const deleteAccount = (dataToken, id) => {
		deleteAccountSV({
			idAccount: id,
			token: dataToken?.token,
			setIsProcess,
			dispatch,
		});
	};
	const deleteUser = (id) => {
		setIsProcess(true);
		requestRefreshToken(
			currentUser,
			deleteAccount,
			state,
			dispatch,
			actions,
			id,
		);
	};
	const editStatus = (id) => {};
	const editRuleUser = async (id) => {};
	function RenderBodyTable({ data }) {
		return (
			<>
				{data.map((item, index) => (
					<tr key={index}>
						<td className="upc">
							{handleUtils.indexTable(page, show, index)}
						</td>
						<td className="item-w200">
							{item.payment.username || <Skeleton width={50} />}
						</td>
						<td className="item-w150">
							{item.payment.email || <Skeleton width={50} />}
						</td>
						<td className="item-w100">
							{moment(item.createdAt).format(
								'DD/MM/YYYY HH:mm:ss',
							) || <Skeleton width={30} />}
						</td>
						<td>
							<TrStatus
								item={
									item.payment.rule.charAt(0).toUpperCase() +
									item.payment.rule.slice(1).toLowerCase()
								}
								onClick={(e) =>
									toggleEditRuleTrue(
										e,
										item.payment.rule,
										item._id,
									)
								}
							/>
						</td>
						<td>
							<TrStatus
								item={
									item.rank.charAt(0).toUpperCase() +
									item.rank.slice(1).toLowerCase()
								}
								onClick={(e) =>
									toggleEditTrue(e, item.rank, item._id)
								}
							/>
						</td>
						<td>
							<ActionsTable
								view
								linkView={`${routers.user}/${item._id}`}
								onClickView={() => handleViewUser(item)}
								onClickDel={(e) => modalDeleteTrue(e, item._id)}
							></ActionsTable>
						</td>
					</tr>
				))}
			</>
		);
	}
	return (
		<>
			<General
				className={cx('user')}
				valueSearch={user}
				nameSearch="user"
				dataFlag={dataUserFlag}
				dataHeaders={headers}
				totalData={
					dataUser?.total ||
					dataUser?.data?.totalSearch ||
					dataUser?.totalSearch
				}
				handleCloseSnackbar={handleCloseSnackbar}
				openSnackbar={snackbar.open}
				typeSnackbar={snackbar.type}
				messageSnackbar={snackbar.message}
				textBtnNew="Create Account"
				classNameButton={'completebgc'}
				onCreate={openModalCreateAccount}
			>
				<RenderBodyTable data={dataUserFlag} />
			</General>
			{modalStatus && (
				<Modal
					titleHeader="Change Rank"
					actionButtonText="Submit"
					openModal={toggleEditTrue}
					closeModal={toggleEditFalse}
					classNameButton="vipbgc"
					onClick={() => editStatus(currentUser?.idUpdate || edit.id)}
					isProcess={isProcess}
				>
					<p className="modal-delete-desc">
						Are you sure change rank this user?
					</p>
					<SelectStatus rank />
				</Modal>
			)}
			{modalChangeRule && (
				<Modal
					titleHeader="Change Rule"
					actionButtonText="Submit"
					openModal={toggleEditRuleTrue}
					closeModal={toggleEditRuleFalse}
					classNameButton="vipbgc"
					onClick={() =>
						editRuleUser(currentUser?.idUpdate || edit.id)
					}
					isProcess={isProcess}
				>
					<p className="modal-delete-desc">
						Are you sure change rule this user?
					</p>
					<SelectStatus ruleUser />
				</Modal>
			)}
			{modalDelete && (
				<Modal
					titleHeader="Delete User"
					actionButtonText="Delete"
					openModal={modalDeleteTrue}
					closeModal={modalDeleteFalse}
					classNameButton="cancelbgc"
					onClick={() => deleteUser(edit.id)}
					isProcess={isProcess}
					disabled={isProcess}
				>
					<p className="modal-delete-desc">
						Are you sure to delete this user?
					</p>
				</Modal>
			)}
			{modalCreateAccount && (
				<Modal
					titleHeader="Create Account"
					actionButtonText={isUpdateAccount ? 'Update' : 'Send'}
					openModal={openModalCreateAccount}
					closeModal={closeModalCreateAccount}
					isProcess={isProcess}
					disabled={isProcess}
					classNameButton={'confirmbgc'}
					onClick={
						isUpdateAccount
							? () => handleUpdateAccount(edit?.id)
							: handleCreateAccount
					}
				>
					<FormInput
						label="Username"
						name="username"
						onChange={handleChangeCreateAccount}
						placeholder="Enter username"
					/>
					<FormInput
						label="Password"
						name="password"
						onChange={handleChangeCreateAccount}
						placeholder="Enter password"
						showPwd
					/>
					<FormInput
						label="Host"
						name="host"
						onChange={handleChangeCreateAccount}
						placeholder="Enter host"
					/>
					<FormInput
						label="Port"
						name="port"
						onChange={handleChangeCreateAccount}
						placeholder="Enter port"
					/>
				</Modal>
			)}
		</>
	);
}

export default User;
