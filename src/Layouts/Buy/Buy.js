/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'react-loading-skeleton/dist/skeleton.css';
import className from 'classnames/bind';
import {
	useAppContext,
	DataBuys,
	deleteUtils,
	handleUtils,
	requestRefreshToken,
	localStoreUtils,
	numberUtils,
	useDebounce,
} from '../../utils';
import { Icons, ActionsTable, Modal, SelectStatus } from '../../components';
import routers from '../../routers/routers';
import { actions } from '../../app/';
import { General } from '../';
import {
	TrObjectIcon,
	TrObjectNoIcon,
	TrStatus,
} from '../../components/TableData/TableData';
import styles from './Buy.module.css';
import Skeleton from 'react-loading-skeleton';

const cx = className.bind(styles);

function Buy() {
	const { state, dispatch } = useAppContext();
	const {
		edit,
		currentUser,
		statusCurrent,
		statusUpdate,
		data: { dataBuy, dataUser },
		pagination: { page, show },
		searchValues: { buy },
	} = state.set;
	const { modalStatus, modalDelete } = state.toggle;
	const [isProcess, setIsProcess] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		type: '',
		message: '',
	});
	useEffect(() => {
		document.title = `Buy | ${process.env.REACT_APP_TITLE_WEB}`;
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
	const useDebounceBuy = useDebounce(buy, 500);
	useEffect(() => {
		if (useDebounceBuy) {
			setTimeout(() => {
				dispatch(
					actions.setData({
						pagination: { page: 1, show: 10 },
					}),
				);
			}, 500);
		}
	}, [useDebounceBuy]);
	useEffect(() => {}, [page, show, useDebounceBuy]);
	let dataBuyFlag = dataBuy?.data?.buys || dataBuy?.data;
	const toggleEditStatusTrue = async (e, status, id) => {
		await localStoreUtils.setStore({
			...currentUser,
			idUpdate: id,
		});
		deleteUtils.statusTrue(e, status, id, dispatch, state, actions);
	};
	const toggleEditStatusFalse = (e) => {
		return deleteUtils.statusFalse(e, dispatch, state, actions);
	};
	const modalDeleteTrue = (e, id) => {
		return deleteUtils.deleteTrue(e, id, dispatch, state, actions);
	};
	const modalDeleteFalse = (e) => {
		return deleteUtils.deleteFalse(e, dispatch, state, actions);
	};

	// EDIT + DELETE
	const editStatusBuy = async (id) => {};
	const deleteBuy = async (id) => {};
	const handleViewBuy = (item) => {
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
					const sendReceived = {
						send: {
							icon: <Icons.SendIcon />,
							title: 'Send',
							number: numberUtils.formatUSD(item?.amountUsd),
						},
						received: {
							icon: <Icons.ReceivedIcon />,
							title: 'Received',
							number: item?.amount,
						},
					};
					const username = dataUser?.dataUser?.find(
						(x) => x?.payment?.email === item?.buyer?.gmailUSer,
					)?.payment?.username;
					const infoUser = {
						name: username,
						email: item.buyer.gmailUSer,
						path: `@${username?.replace(' ', '-')}`,
					};
					return (
						<tr key={index}>
							<td>{handleUtils.indexTable(page, show, index)}</td>
							<td className="item-w100">
								{/* <Skeleton width={50} /> */}
								{item?.symbol}
							</td>
							<td>
								<TrObjectIcon item={sendReceived} />
							</td>
							<td className="item-w100 vip">
								{item?.price?.toFixed(5) || '---'}
							</td>
							<td className="item-w150">
								<TrObjectNoIcon item={infoUser} />
							</td>
							<td className="item-w100">
								{moment(item.createdAt).format(
									'DD/MM/YYYY HH:mm:ss',
								)}
							</td>
							<td className="item-w100">
								{item?.createBy || <Skeleton width={50} />}
							</td>
							<td>
								<TrStatus
									item={item.status}
									onClick={(e) =>
										toggleEditStatusTrue(
											e,
											item.status,
											item._id,
										)
									}
								/>
							</td>
							<td>
								<ActionsTable
									view
									linkView={`${routers.buy}/${item._id}`}
									onClickDel={(e) =>
										modalDeleteTrue(e, item._id)
									}
									onClickView={() => handleViewBuy(item)}
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
				className={cx('buy')}
				valueSearch={buy}
				nameSearch="buy"
				dataFlag={dataBuyFlag}
				dataHeaders={DataBuys(Icons).headers}
				totalData={
					dataBuy?.total ||
					dataBuy?.data?.totalSearch ||
					dataBuy?.totalSearch
				}
				handleCloseSnackbar={handleCloseSnackbar}
				openSnackbar={snackbar.open}
				typeSnackbar={snackbar.type}
				messageSnackbar={snackbar.message}
			>
				<RenderBodyTable data={dataBuyFlag} />
			</General>
			{modalStatus && (
				<Modal
					titleHeader="Change Status"
					actionButtonText="Submit"
					openModal={toggleEditStatusTrue}
					closeModal={toggleEditStatusFalse}
					classNameButton="vipbgc"
					onClick={() =>
						editStatusBuy(currentUser?.idUpdate || edit?.id)
					}
					isProcess={isProcess}
				>
					<p className="modal-delete-desc">
						Are you sure change status this{' '}
						{window.location.pathname.includes(`${routers.buy}`)
							? 'buy'
							: 'sell'}
						?
					</p>
					<SelectStatus />
				</Modal>
			)}
			{modalDelete && (
				<Modal
					titleHeader="Delete Setting Coin"
					actionButtonText="Delete"
					openModal={modalDeleteTrue}
					closeModal={modalDeleteFalse}
					classNameButton="cancelbgc"
					onClick={() => deleteBuy(edit.id)}
					isProcess={isProcess}
				>
					<p className="modal-delete-desc">
						Are you sure to delete this coin?
					</p>
				</Modal>
			)}
		</>
	);
}

export default Buy;
