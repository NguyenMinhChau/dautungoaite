/* eslint-disable array-callback-return */
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
import { Modal, ActionsTable, SelectStatus } from '../../components';
import styles from './User.module.css';
import moment from 'moment';
import {
	getAllUsersSV,
	updateUserSV,
	deleteUserSV,
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
	const { modalDelete } = state.toggle;
	const [isProcess, setIsProcess] = useState(false);
	const [modalChangeRoles, setModalChangeRoles] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		type: '',
		message: '',
	});
	let showPage = 10;
	const start = (page - 1) * showPage + 1;
	const end = start + showPage - 1;
	const getAllUsers = (dataToken) => {
		getAllUsersSV({
			token: dataToken?.token,
			dispatch,
			state,
		});
	};
	useEffect(() => {
		document.title = `User | ${process.env.REACT_APP_TITLE_WEB}`;
		requestRefreshToken(currentUser, getAllUsers, state, dispatch, actions);
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
	let dataUserFlag = dataUser || [];
	if (user) {
		dataUserFlag = dataUserFlag.filter(
			(item) =>
				item.email.toLowerCase().includes(user.toLowerCase()) ||
				item.roles.toLowerCase().includes(user.toLowerCase()),
		);
	}
	const modalDeleteTrue = (e, id) => {
		return deleteUtils.deleteTrue(e, id, dispatch, state, actions);
	};
	const modalDeleteFalse = (e) => {
		return deleteUtils.deleteFalse(e, dispatch, state, actions);
	};
	const toggleEditRolesTrue = async (e, status, id) => {
		e.stopPropagation();
		await localStoreUtils.setStore({
			...currentUser,
			idUpdate: id,
		});
		setModalChangeRoles(true);
		dispatch(
			actions.setData({
				edit: { ...state.set.edit, id },
				statusCurrent: status,
			}),
		);
	};
	const toggleEditRolesFalse = async (e) => {
		e.stopPropagation();
		await 1;
		setModalChangeRoles(false);
		dispatch(
			actions.setData({
				statusCurrent: '',
				statusUpdate: '',
			}),
		);
	};
	const handleViewUser = (item) => {
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
	const updateUser = (dataToken, id) => {
		updateUserSV({
			idUser: id,
			setIsProcess,
			token: dataToken?.token,
			statusUpdate,
			statusCurrent,
			dispatch,
			state,
			setSnackbar,
			setModalChangeRoles,
		});
	};
	const handleUpdateUser = (id) => {
		setIsProcess(true);
		requestRefreshToken(
			currentUser,
			updateUser,
			state,
			dispatch,
			actions,
			id,
		);
	};
	const deleteUserSV = (dataToken, id) => {
		deleteUserSV({
			idUser: id,
			dispatch,
			state,
			token: dataToken?.token,
			setSnackbar,
			setIsProcess,
		});
	};
	const handleDeleteUser = (id) => {
		setIsProcess(true);
		requestRefreshToken(
			currentUser,
			deleteUserSV,
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
						<td className="item-w200">
							{item.email || <Skeleton width={50} />}
						</td>
						<td className="item-w10">
							{item.chatIdLogin || <Skeleton width={50} />}
						</td>
						<td className="item-w150">{item.point || 0}</td>
						<td className="item-w150">
							{moment(item.createdAt).format(
								'DD/MM/YYYY HH:mm:ss',
							) || <Skeleton width={30} />}
						</td>
						<td>
							<TrStatus
								item={
									item.roles.charAt(0).toUpperCase() +
									item.roles.slice(1).toLowerCase()
								}
								onClick={(e) =>
									toggleEditRolesTrue(e, item.roles, item.id)
								}
							/>
						</td>
						<td>
							<ActionsTable
								view
								linkView={`${routers.user}/${item.id}`}
								onClickView={() => handleViewUser(item)}
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
				className={cx('user')}
				valueSearch={user}
				nameSearch="user"
				dataHeaders={headers}
				totalData={dataUser?.length}
				handleCloseSnackbar={handleCloseSnackbar}
				openSnackbar={snackbar.open}
				typeSnackbar={snackbar.type}
				messageSnackbar={snackbar.message}
				PaginationCus={true}
				startPagiCus={start}
				endPagiCus={end}
				dataPagiCus={dataUserFlag?.filter((row, index) => {
					if (index + 1 >= start && index + 1 <= end) return true;
				})}
			>
				<RenderBodyTable
					data={dataUserFlag?.filter((row, index) => {
						if (index + 1 >= start && index + 1 <= end) return true;
					})}
				/>
			</General>
			{modalChangeRoles && (
				<Modal
					titleHeader="Change Roles"
					actionButtonText="Submit"
					openModal={toggleEditRolesTrue}
					closeModal={toggleEditRolesFalse}
					classNameButton="vipbgc"
					onClick={() =>
						handleUpdateUser(currentUser?.idUpdate || edit.id)
					}
					isProcess={isProcess}
				>
					<p className="modal-delete-desc">
						Are you sure change roles this user?
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
					onClick={() => handleDeleteUser(edit.id)}
					isProcess={isProcess}
					disabled={isProcess}
				>
					<p className="modal-delete-desc">
						Are you sure to delete this user?
					</p>
				</Modal>
			)}
		</>
	);
}

export default User;
