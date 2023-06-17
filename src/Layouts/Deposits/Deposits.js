/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import className from 'classnames/bind';
import moment from 'moment';
import {
	useAppContext,
	DataDeposits,
	deleteUtils,
	handleUtils,
	requestRefreshToken,
	localStoreUtils,
	numberUtils,
	useDebounce,
} from '../../utils';
import {
	Icons,
	ActionsTable,
	Modal,
	SelectStatus,
	FormInput,
} from '../../components';
import { actions } from '../../app/';
import routers from '../../routers/routers';
import { General } from '../';
import {
	TrObjectIcon,
	TrObjectNoIcon,
	TrStatus,
} from '../../components/TableData/TableData';
import styles from './Deposits.module.css';
import Skeleton from 'react-loading-skeleton';
import {
	addDepositsSV,
	deleteDepositsSV,
	getAllDepositsSV,
	updateDepositsSV,
} from '../../services/deposits';
import { formatUSD } from '../../utils/format/FormatMoney';

const cx = className.bind(styles);

function Deposits() {
	const { state, dispatch } = useAppContext();
	const {
		edit,
		currentUser,
		statusUpdate,
		statusCurrent,
		searchValues: { deposits },
		pagination: { page, show },
		data: { dataDeposits, dataUser },
	} = state.set;
	const { modalStatus, modalDelete } = state.toggle;
	const [isProcess, setIsProcess] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		type: '',
		message: '',
	});
	let showPage = 10;
	const start = (page - 1) * showPage + 1;
	const end = start + showPage - 1;
	const getAllDP = (dataToken) => {
		getAllDepositsSV({
			token: dataToken?.token,
			dispatch,
			state,
			setSnackbar,
		});
	};
	useEffect(() => {
		document.title = `Deposits | ${process.env.REACT_APP_TITLE_WEB}`;
		requestRefreshToken(currentUser, getAllDP, state, dispatch, actions);
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
	const useDebounceDeposit = useDebounce(deposits, 500);
	useEffect(() => {
		if (useDebounceDeposit) {
			setTimeout(() => {
				dispatch(
					actions.setData({
						pagination: { page: 1, show: 10 },
					}),
				);
			}, 500);
		}
	}, [useDebounceDeposit]);
	useEffect(() => {}, [page, show, useDebounceDeposit]);
	let dataDepositsFlag = dataDeposits || [];
	const stringlwc = (str) => {
		return str?.toString()?.toLowerCase();
	};
	if (deposits) {
		dataDepositsFlag = dataDepositsFlag.filter((item) => {
			return (
				stringlwc(item?.quantity).includes(deposits.toLowerCase()) ||
				stringlwc(item?.status).includes(deposits.toLowerCase())
			);
		});
	}
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
	// Edit + Delete Deposits
	const deleteDeposits = (dataToken, id) => {
		deleteDepositsSV({
			idDeposits: id,
			token: dataToken?.token,
			setIsProcess,
			dispatch,
			state,
			setSnackbar,
		});
	};
	const handleDeleteDeposits = (id) => {
		setIsProcess(true);
		requestRefreshToken(
			currentUser,
			deleteDeposits,
			state,
			dispatch,
			actions,
			id,
		);
	};
	const editStatus = (dataToken, id) => {
		updateDepositsSV({
			idDeposits: id,
			token: dataToken?.token,
			statusUpdate,
			statusCurrent,
			setIsProcess,
			dispatch,
			state,
			setSnackbar,
		});
	};
	const handleEditStatus = (id) => {
		setIsProcess(true);
		requestRefreshToken(
			currentUser,
			editStatus,
			state,
			dispatch,
			actions,
			id,
		);
	};
	const handleViewDeposits = (item) => {
		dispatch(
			actions.setData({
				edit: {
					itemData: item,
				},
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
								{item?.quantity || 0 || (
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
									linkView={`${routers.deposits}/${item.id}`}
									onClickDel={(e) =>
										modalDeleteTrue(e, item.id)
									}
									onClickView={() => handleViewDeposits(item)}
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
				className={cx('deposits')}
				valueSearch={deposits}
				nameSearch="deposits"
				dataHeaders={DataDeposits(Icons).headers}
				totalData={dataDeposits?.length}
				handleCloseSnackbar={handleCloseSnackbar}
				openSnackbar={snackbar.open}
				typeSnackbar={snackbar.type}
				messageSnackbar={snackbar.message}
				PaginationCus
				startPagiCus={start}
				endPagiCus={end}
				dataPagiCus={dataDepositsFlag?.filter((row, index) => {
					if (index + 1 >= start && index + 1 <= end) return true;
				})}
			>
				<RenderBodyTable
					data={dataDepositsFlag?.filter((row, index) => {
						if (index + 1 >= start && index + 1 <= end) return true;
					})}
				/>
			</General>
			{modalStatus && (
				<Modal
					titleHeader="Change Status"
					actionButtonText="Submit"
					openModal={toggleEditTrue}
					closeModal={toggleEditFalse}
					classNameButton="vipbgc"
					onClick={() =>
						handleEditStatus(currentUser?.idUpdate || edit.id)
					}
					isProcess={isProcess}
				>
					<p className="modal-delete-desc">
						Are you sure change status this{' '}
						{window.location.pathname.includes(
							`${routers.deposits}`,
						)
							? 'deposits'
							: 'widthdraw'}
						?
					</p>
					<SelectStatus />
				</Modal>
			)}
			{modalDelete && (
				<Modal
					titleHeader="Delete Deposits"
					actionButtonText="Delete"
					openModal={modalDeleteTrue}
					closeModal={modalDeleteFalse}
					classNameButton="cancelbgc"
					onClick={() => handleDeleteDeposits(edit.id)}
					isProcess={isProcess}
				>
					<p className="modal-delete-desc">
						Are you sure to delete this deposits?
					</p>
				</Modal>
			)}
		</>
	);
}

export default Deposits;
