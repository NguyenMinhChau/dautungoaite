/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import className from 'classnames/bind';
import styles from './DepositUser.module.css';
import { General } from '../../Layouts';
import {
	axiosUtils,
	DataDepositUser,
	handleUtils,
	numberUtils,
	requestRefreshToken,
	searchUtils,
	useAppContext,
	useDebounce,
} from '../../utils';
import { actions } from '../../app/';
import {
	ActionsTable,
	FormInput,
	Icons,
	Modal,
	SelectValue,
} from '../../components';
import { TrObjectIcon } from '../../components/TableData/TableData';
import moment from 'moment';
import routers from '../../routers/routers';
import { handleCreate } from '../../services/deposits';

const cx = className.bind(styles);

function RenderBodyTable({ data }) {
	const [rate, setRate] = useState(null);

	useEffect(() => {}, []);
	const { state } = useAppContext();
	const {
		pagination: { page, show },
	} = state.set;
	return (
		<>
			{data.map((item, index) => {
				const sendReceived = {
					send: {
						icon: <Icons.SendIcon />,
						title: 'Send',
						number: numberUtils.formatVND(item?.amountVnd),
					},
					received: {
						icon: <Icons.ReceivedIcon />,
						title: 'Received',
						number: numberUtils.formatUSD(item?.amount),
					},
				};
				return (
					<tr key={item?._id}>
						<td>{handleUtils.indexTable(page, show, index)}</td>
						<td className="item-w150">{item?.symbol}</td>
						<td>
							<TrObjectIcon item={sendReceived} />
						</td>
						<td className="item-w150">
							{numberUtils.formatVND(rate?.rateDeposit) || '---'}
						</td>
						<td className="item-w100">
							{moment(item?.createdAt).format(
								'DD/MM/YYYY HH:mm:ss',
							)}
						</td>
						<td className="item-w150">
							<div>{item?.bankAdmin?.methodName}</div>
							<div>{item?.bankAdmin?.accountName}</div>
							<div>{item?.bankAdmin?.accountNumber}</div>
						</td>
						<td style={{ alignItems: 'center' }}>
							<span
								className={`status ${
									item?.status
										?.toLowerCase()
										.replace(/\s/g, '') + 'bgc'
								}`}
							>
								{item?.status}
							</span>
						</td>
						<td>
							<ActionsTable
								view
								noDel
								linkView={`${routers.depositUser}/${item?._id}`}
							/>
						</td>
					</tr>
				);
			})}
		</>
	);
}

export default function DepositUser() {
	const { state, dispatch } = useAppContext();
	const {
		currentUser,
		bankValue,
		searchValues: { depositUser, bank },
		pagination: { page, show },
	} = state.set;
	const { selectBank } = state.toggle;
	const [data, setData] = useState([]);
	const [dataPaymentAdmin, setDataPaymentAdmin] = useState([]);
	const [rate, setRate] = useState(null);
	const [amountUSD, setAmountUSD] = useState();
	const [stateModalBank, setStateModalBank] = useState(false);
	const [isProcess, setIsProcess] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		type: '',
		message: '',
	});
	const useDebounceDeposit = useDebounce(depositUser, 500);
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
	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackbar({
			...snackbar,
			open: false,
		});
	};

	useEffect(() => {}, [page, show, useDebounceDeposit]);
	const openModal = useCallback((e) => {
		e.stopPropagation();
		dispatch(
			actions.toggleModal({
				selectBank: true,
			}),
		);
	}, []);
	const closeModal = useCallback((e) => {
		e.stopPropagation();
		setAmountUSD('');
		dispatch(
			actions.toggleModal({
				selectBank: false,
			}),
		);
	}, []);
	const toogleModalBank = useCallback(
		(e) => {
			e.stopPropagation();
			setStateModalBank(!stateModalBank);
		},
		[stateModalBank],
	);
	const searchSelect = useCallback((e) => {
		return searchUtils.logicSearch(e, dispatch, state, actions);
	}, []);
	const handleChangeAmountUSD = useCallback((e) => {
		setAmountUSD(e.target.value);
	}, []);
	const handleChangeBank = useCallback(
		(bankValue) => {
			setStateModalBank(false);
		},
		[bankValue, selectBank],
	);

	const handleSubmit = useCallback(
		(e) => {},
		[amountUSD, bankValue, isProcess, data],
	);
	// console.log(data);
	const dataSettingFlag = data?.deposits || [];
	const dataBankFlag = [];
	const idDisabled = amountUSD && bankValue ? true : false;
	return (
		<>
			<General
				className={cx('setting-coin')}
				valueSearch={depositUser}
				nameSearch="depositUser"
				dataFlag={dataSettingFlag}
				dataHeaders={DataDepositUser().headers}
				totalData={data?.total || data?.totalSearch}
				classNameButton="completebgc"
				textBtnNew="Create Deposit"
				noActions
				onCreate={openModal}
				handleCloseSnackbar={handleCloseSnackbar}
				openSnackbar={snackbar.open}
				typeSnackbar={snackbar.type}
				messageSnackbar={snackbar.message}
			>
				<RenderBodyTable data={dataSettingFlag} />
			</General>
			{selectBank && (
				<Modal
					titleHeader="Create Deposit"
					actionButtonText="Submit"
					classNameButton="vipbgc"
					openModal={openModal}
					closeModal={closeModal}
					isProcess={isProcess}
					onClick={handleSubmit}
					disabled={!amountUSD || !bankValue}
				>
					<FormInput
						label="Amount USD"
						placeholder="Enter amount USD"
						type="text"
						name="amountUSD"
						onChange={handleChangeAmountUSD}
					/>
					<SelectValue
						label="Choose payment method"
						nameSearch="bank"
						toggleModal={toogleModalBank}
						stateModal={stateModalBank}
						valueSelect={bankValue?.methodName}
						onChangeSearch={searchSelect}
						dataFlag={dataBankFlag}
						onClick={handleChangeBank}
					/>
					{idDisabled && (
						<div className="fz16 complete fwb">
							Deposits (VND):{' '}
							{numberUtils.formatVND(
								amountUSD * rate?.rateDeposit || 0,
							)}
						</div>
					)}
				</Modal>
			)}
		</>
	);
}
