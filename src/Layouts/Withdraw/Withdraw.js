/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import className from 'classnames/bind';
import moment from 'moment';
import {
	useAppContext,
	DataWithdraws,
	deleteUtils,
	handleUtils,
	requestRefreshToken,
	localStoreUtils,
	numberUtils,
	useDebounce,
} from '../../utils';
import routers from '../../routers/routers';
import { Icons, ActionsTable, Modal, SelectStatus } from '../../components';
import { actions } from '../../app/';
import { General } from '..';
import {
	TrObjectIcon,
	TrObjectNoIcon,
	TrStatus,
} from '../../components/TableData/TableData';
import styles from './Withdraw.module.css';
import Skeleton from 'react-loading-skeleton';
import {
	deleteWithdrawsSV,
	getAllWithdrawsSV,
	updateWithdrawsSV,
} from '../../services/withdraws';
import { formatUSD } from '../../utils/format/FormatMoney';

const cx = className.bind(styles);

function Withdraw() {
	const { state, dispatch } = useAppContext();
	const {
		edit,
		currentUser,
		statusCurrent,
		statusUpdate,
		data: { dataWithdraw, dataUser },
		searchValues: { withdraw },
		pagination: { page, show },
	} = state.set;
	const { modalStatus, modalDelete } = state.toggle;
	const [isProcess, setIsProcess] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		type: '',
		message: '',
	});
	const gellWr = (dataToken) => {
		getAllWithdrawsSV({
			token: dataToken.token,
			dispatch,
			state,
			setSnackbar,
		});
	};
	console.log(dataWithdraw);
	useEffect(() => {
		document.title = `Withdraw | ${process.env.REACT_APP_TITLE_WEB}`;
		requestRefreshToken(currentUser, gellWr, state, dispatch, actions);
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
	const useBebounceWithdraw = useDebounce(withdraw, 500);
	useEffect(() => {
		if (useBebounceWithdraw) {
			setTimeout(() => {
				dispatch(
					actions.setData({
						pagination: { page: 1, show: 10 },
					}),
				);
			}, 500);
		}
	}, [useBebounceWithdraw]);
	useEffect(() => {}, [page, show, useBebounceWithdraw]);
	let dataWithdrawFlag = dataWithdraw || [];
	// Modal
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
	// Edit + Delete Withdraw

	const handleDelete = (dataToken, id) => {
		deleteWithdrawsSV({
			idWithdraw: id,
			token: dataToken.token,
			setIsProcess,
			dispatch,
			state,
			setSnackbar,
		});
	};

	const deleteWithdraw = (id) => {
		requestRefreshToken(
			currentUser,
			handleDelete,
			state,
			dispatch,
			actions,
			id,
		);
	};

	const handleStatus = (dataToken, id) => {
		updateWithdrawsSV({
			idWithdraw: id,
			token: dataToken.token,
			statusUpdate,
			statusCurrent,
			setIsProcess,
			dispatch,
			state,
			setSnackbar,
		});
	};

	const editStatus = (id) => {
		requestRefreshToken(
			currentUser,
			handleStatus,
			state,
			dispatch,
			actions,
			id,
		);
	};
	const handleViewWithdraw = (item) => {
		dispatch(
			actions.setData({
				edit: { ...state.set.edit, id: item.id, itemData: item },
			}),
		);
	};
	function RenderBodyTable({ data }) {
		return (
			<>
				{data.map((item, index) => {
					const username = dataUser.find(
						(x) => x?.id === item.IdUser,
					)?.email;
					return (
						<tr key={index}>
							<td>{handleUtils.indexTable(page, show, index)}</td>
							<td className="item-w200">
								{username || <Skeleton width={50} />}
							</td>
							<td className="item-w100">
								{formatUSD(item?.quantity || 0) || (
									<Skeleton width={50} />
								)}
							</td>
							<td className="item-w100">
								{moment(item.createdAt).format(
									'DD/MM/YYYY HH:mm:ss',
								)}
							</td>
							<td>
								<TrStatus
									item={item.status}
									onClick={(e) =>
										toggleEditTrue(e, item.status, item.id)
									}
								/>
							</td>
							<td>
								<ActionsTable
									view
									linkView={`${routers.withdraw}/${item.id}`}
									onClickDel={(e) =>
										modalDeleteTrue(e, item.id)
									}
									onClickView={() => handleViewWithdraw(item)}
								></ActionsTable>
							</td>
						</tr>
					);
				})}
			</>
		);
	}
	return (
		<>
			<General
				className={cx('withdraw')}
				valueSearch={withdraw}
				nameSearch="withdraw"
				dataFlag={dataWithdrawFlag}
				dataHeaders={DataWithdraws(Icons).headers}
				totalData={
					dataWithdraw?.total || dataWithdraw?.data?.totalSearch
				}
				handleCloseSnackbar={handleCloseSnackbar}
				openSnackbar={snackbar.open}
				typeSnackbar={snackbar.type}
				messageSnackbar={snackbar.message}
			>
				<RenderBodyTable data={dataWithdrawFlag} />
			</General>
			{modalStatus && (
				<Modal
					titleHeader="Change Status"
					actionButtonText="Submit"
					openModal={toggleEditTrue}
					closeModal={toggleEditFalse}
					classNameButton="vipbgc"
					onClick={() => editStatus(currentUser?.idUpdate || edit.id)}
					isProcess={isProcess}
				>
					<p className="modal-delete-desc">
						Are you sure change status this{' '}
						{window.location.pathname.includes(
							`${routers.deposits}`,
						)
							? 'deposits'
							: 'withdraw'}
						?
					</p>
					<SelectStatus />
				</Modal>
			)}
			{modalDelete && (
				<Modal
					titleHeader="Delete Withdraw"
					actionButtonText="Delete"
					openModal={modalDeleteTrue}
					closeModal={modalDeleteFalse}
					classNameButton="cancelbgc"
					onClick={() => deleteWithdraw(edit.id)}
					isProcess={isProcess}
				>
					<p className="modal-delete-desc">
						Are you sure to delete this withdraw?
					</p>
				</Modal>
			)}
		</>
	);
}

export default Withdraw;
