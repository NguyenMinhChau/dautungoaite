/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import className from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
	DataAccounts,
	useAppContext,
	deleteUtils,
	handleUtils,
	requestRefreshToken,
	useDebounce,
} from '../../utils';
import routers from '../../routers/routers';
import { actions } from '../../app/';
import { General } from '..';
import { Modal, ActionsTable, FormInput, SelectValue } from '../../components';
import styles from './Account.module.css';
import moment from 'moment';
import {
	deleteAccountSV,
	getAllAccountSV,
	updateAccountSV,
} from '../../services/account';

const cx = className.bind(styles);
const DATA_ACCOUNTS = DataAccounts();
const DATA_TYPE_ACC = [
	{ id: 1, value: 'MT4', label: 'MetaTrader 4' },
	{ id: 2, value: 'MT5', label: 'MetaTrader 5' },
];

function Account() {
	const { state, dispatch } = useAppContext();
	const { headers } = DATA_ACCOUNTS;
	const {
		edit,
		currentUser,
		data: { dataAccount },
		pagination: { page, show },
		searchValues: { account },
	} = state.set;
	const { modalDelete } = state.toggle;
	const [isProcess, setIsProcess] = useState(false);
	const [modalCreateAccount, setModalCreateAccount] = useState(false);
	const [isUpdateAccount, setIsUpdateAccount] = useState(false);
	const [dataFormCreateAccount, setDataFormCreateAccount] = useState({
		accountName: '',
		username: '',
		proxyUsername: '',
		password: '',
		proxyPassword: '',
		host: '',
		proxyHost: '',
		port: '',
		proxyPort: '',
		serverBroker: '',
		typeAcc: '',
	});
	const {
		accountName,
		username,
		proxyUsername,
		password,
		proxyPassword,
		host,
		proxyHost,
		port,
		proxyPort,
		serverBroker,
		typeAcc,
	} = dataFormCreateAccount;
	const [snackbar, setSnackbar] = useState({
		open: false,
		type: '',
		message: '',
	});
	const [toggleAcc, setToggleAcc] = useState(false);
	let showPage = 10;
	const start = (page - 1) * showPage + 1;
	const end = start + showPage - 1;
	const getAllAccounts = (dataToken) => {
		getAllAccountSV({
			token: dataToken?.token,
			dispatch,
			state,
			setSnackbar,
		});
	};
	useEffect(() => {
		document.title = `Accounts | ${process.env.REACT_APP_TITLE_WEB}`;
		requestRefreshToken(
			currentUser,
			getAllAccounts,
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
	const handleToggleAcc = () => {
		setToggleAcc(!toggleAcc);
	};
	const useDebounceAccount = useDebounce(account, 500);
	useEffect(() => {
		if (useDebounceAccount) {
			setTimeout(() => {
				dispatch(
					actions.setData({
						pagination: { page: 1, show: 10 },
					}),
				);
			}, 500);
		}
	}, [useDebounceAccount]);
	useEffect(() => {}, [page, show, useDebounceAccount]);
	const stringlwc = (str) => {
		return str?.toString().toLowerCase();
	};
	let dataAccountFlag = dataAccount || [];
	if (account) {
		dataAccountFlag = dataAccountFlag.filter(
			(item) =>
				stringlwc(item?.username)?.includes(account.toLowerCase()) ||
				stringlwc(item?.host)?.includes(account.toLowerCase()) ||
				stringlwc(item?.port)?.includes(account.toLowerCase()) ||
				stringlwc(item?.accountName)?.includes(account.toLowerCase()) ||
				stringlwc(item?.proxyUsername)?.includes(
					account.toLowerCase(),
				) ||
				stringlwc(item?.proxyHost)?.includes(account.toLowerCase()) ||
				stringlwc(item?.proxyPort)?.includes(account.toLowerCase()) ||
				stringlwc(item?.serverBroker)?.includes(
					account.toLowerCase(),
				) ||
				stringlwc(item?.typeAcc)?.includes(account.toLowerCase()),
		);
	}
	const modalDeleteTrue = (e, id) => {
		return deleteUtils.deleteTrue(e, id, dispatch, state, actions);
	};
	const modalDeleteFalse = (e) => {
		return deleteUtils.deleteFalse(e, dispatch, state, actions);
	};
	const openModalCreateAccount = (e) => {
		e.stopPropagation();
		setModalCreateAccount(true);
	};
	const closeModalCreateAccount = (e) => {
		e.stopPropagation();
		setModalCreateAccount(false);
		setIsUpdateAccount(false);
	};
	const handleViewUser = (item) => {
		dispatch(
			actions.setData({
				edit: {
					...state.set.edit,
					itemData: item,
				},
			}),
		);
	};
	const onClickEdit = (item) => {
		setIsUpdateAccount(true);
		setModalCreateAccount(true);
		setDataFormCreateAccount({
			...item,
		});
		dispatch(
			actions.setData({
				edit: {
					id: item?.id,
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
	const handleCreateAccount = () => {
		setSnackbar({
			open: true,
			type: 'info',
			message: 'Functions under development!',
		});
	};
	const updateAccount = (dataToken, id) => {
		updateAccountSV({
			idAccount: id,
			setIsProcess,
			dispatch,
			state,
			token: dataToken?.token,
			body: dataFormCreateAccount,
			setModalCreateAccount,
			setIsUpdateAccount,
			setSnackbar,
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
	const deleteAccount = (dataToken, id) => {
		deleteAccountSV({
			idAccount: id,
			token: dataToken?.token,
			setIsProcess,
			dispatch,
			state,
			setSnackbar,
		});
	};
	const handleDeleteAccount = (id) => {
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
	function RenderBodyTable({ data }) {
		return (
			<>
				{data.map((item, index) => (
					<tr key={index}>
						<td className="upc">
							{handleUtils.indexTable(page, show, index)}
						</td>
						<td className="item-w150">
							{item.typeAcc || <Skeleton width={50} />}
						</td>
						<td className="item-w200">
							{item.username || <Skeleton width={50} />}
						</td>
						<td className="item-w200">
							{item.accountName || <Skeleton width={50} />}
						</td>
						<td className="item-w200">
							{item.serverBroker || <Skeleton width={50} />}
						</td>
						<td className="item-w150">
							{item.host || <Skeleton width={50} />}
						</td>
						<td className="item-w150">
							{item.port || <Skeleton width={50} />}
						</td>
						<td className="item-w150">
							{moment(item.createdAt).format(
								'DD/MM/YYYY HH:mm:ss',
							) || <Skeleton width={30} />}
						</td>
						<td className="item-w200">
							<ActionsTable
								view
								linkView={`${routers.account}/${item.id}`}
								onClickView={() => handleViewUser(item)}
								edit
								onClickEdit={() => onClickEdit(item)}
								onClickDel={(e) => modalDeleteTrue(e, item.id)}
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
				className={cx('account')}
				valueSearch={account}
				nameSearch="account"
				dataHeaders={headers}
				totalData={dataAccount?.length}
				handleCloseSnackbar={handleCloseSnackbar}
				openSnackbar={snackbar.open}
				typeSnackbar={snackbar.type}
				messageSnackbar={snackbar.message}
				textBtnNew="Create Account"
				classNameButton={'completebgc'}
				onCreate={openModalCreateAccount}
				PaginationCus={true}
				startPagiCus={start}
				endPagiCus={end}
				dataPagiCus={dataAccountFlag?.filter((row, index) => {
					if (index + 1 >= start && index + 1 <= end) return true;
				})}
			>
				<RenderBodyTable
					data={dataAccountFlag?.filter((row, index) => {
						if (index + 1 >= start && index + 1 <= end) return true;
					})}
				/>
			</General>
			{modalDelete && (
				<Modal
					titleHeader="Delete User"
					actionButtonText="Delete"
					openModal={modalDeleteTrue}
					closeModal={modalDeleteFalse}
					classNameButton="cancelbgc"
					onClick={() => handleDeleteAccount(edit.id)}
					isProcess={isProcess}
					disabled={isProcess}
				>
					<p className="modal-delete-desc">
						Are you sure to delete this account?
					</p>
				</Modal>
			)}
			{modalCreateAccount && (
				<Modal
					titleHeader={
						isUpdateAccount ? 'Update Account' : 'Create Account'
					}
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
					<SelectValue
						label="Add acc"
						toggleModal={handleToggleAcc}
						stateModal={toggleAcc}
						valueSelect={typeAcc}
						dataFlag={DATA_TYPE_ACC}
						onChange={handleChangeCreateAccount}
						onClick={(item) => {
							setDataFormCreateAccount({
								...dataFormCreateAccount,
								typeAcc: item.value,
							});
							setToggleAcc(false);
						}}
						required
					/>
					<FormInput
						label="Account number"
						name="username"
						value={username}
						onChange={handleChangeCreateAccount}
						placeholder="Enter account number"
						required
					/>
					<FormInput
						label="Account name"
						name="accountName"
						value={accountName}
						onChange={handleChangeCreateAccount}
						placeholder="Enter account name"
						required
					/>
					<FormInput
						label="Password"
						name="password"
						value={password}
						onChange={handleChangeCreateAccount}
						placeholder="Enter password"
						showPwd
						required
					/>
					<FormInput
						label="Server broker"
						name="serverBroker"
						value={serverBroker}
						onChange={handleChangeCreateAccount}
						placeholder="Enter server broker"
						required
					/>
					<FormInput
						label="Host"
						name="host"
						value={host}
						onChange={handleChangeCreateAccount}
						placeholder="Enter host"
					/>
					<FormInput
						label="Port"
						name="port"
						value={port}
						onChange={handleChangeCreateAccount}
						placeholder="Enter port"
					/>
					<FormInput
						label="Proxy username"
						name="proxyUsername"
						value={proxyUsername}
						onChange={handleChangeCreateAccount}
						placeholder="Enter proxy username"
					/>
					<FormInput
						label="Proxy password"
						name="proxyPassword"
						value={proxyPassword}
						onChange={handleChangeCreateAccount}
						placeholder="Enter proxy password"
					/>
					<FormInput
						label="Proxy host"
						name="proxyHost"
						value={proxyHost}
						onChange={handleChangeCreateAccount}
						placeholder="Enter proxy host"
					/>
					<FormInput
						label="Proxy port"
						name="proxyPort"
						value={proxyPort}
						onChange={handleChangeCreateAccount}
						placeholder="Enter proxy port"
					/>
				</Modal>
			)}
		</>
	);
}

export default Account;
