import React, { useEffect, useState } from 'react';
import className from 'classnames/bind';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Button, Icons, Image, SnackbarCp } from '../../components';
import moment from 'moment';
import {
	useAppContext,
	textUtils,
	refreshPage,
	requestRefreshToken,
} from '../../utils';
import styles from './DepositsWithdrawDetail.module.css';
import { formatMoneyUSDT } from '../../utils/format/NumberFormat';
import { getDepositByIdSV } from '../../services/deposits';
import { actions } from '../../app/';
import { getWithdrawByIdSV } from '../../services/withdraws';

const cx = className.bind(styles);

function DepositsWithdrawDetail() {
	const { idDeposits, idWithdraw } = useParams();
	const { state, dispatch } = useAppContext();
	const { edit, currentUser } = state.set;
	const [snackbar, setSnackbar] = useState({
		open: false,
		type: '',
		message: '',
	});
	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackbar({
			...snackbar,
			open: false,
		});
	};
	const getDPWRById = (dataToken) => {
		if (idDeposits) {
			getDepositByIdSV({
				idDeposits,
				token: dataToken?.token,
				dispatch,
				setSnackbar,
			});
		} else {
			getWithdrawByIdSV({
				idWithdraw,
				token: dataToken?.token,
				dispatch,
				setSnackbar,
			});
		}
	};
	useEffect(() => {
		document.title = `Detail | ${process.env.REACT_APP_TITLE_WEB}`;
		requestRefreshToken(currentUser, getDPWRById, state, dispatch, actions);
	}, [currentUser, dispatch, state]);

	function ItemRender({
		title,
		info,
		colorInfo,
		bankInfo,
		methodBank,
		nameAccount,
		numberAccount,
	}) {
		return (
			<div className="detail-item">
				<div className="detail-title" style={{ marginRight: '8px' }}>
					{title}
				</div>
				<div className={`${cx('detail-status')}`}>
					{bankInfo ? (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-end',
							}}
						>
							<span className="info">
								{methodBank ? (
									methodBank
								) : (
									<Skeleton width={30} />
								)}
							</span>
							<span className="info">
								{nameAccount ? (
									nameAccount
								) : (
									<Skeleton width={30} />
								)}
							</span>
							<span className="info">
								{numberAccount ? (
									numberAccount
								) : (
									<Skeleton width={30} />
								)}
							</span>
						</div>
					) : (
						<span
							className={`${cx('info_text')} info ${colorInfo}`}
						>
							{info || info === 0 ? (
								info
							) : (
								<Skeleton width={30} />
							)}
						</span>
					)}
				</div>
			</div>
		);
	}
	const x = edit?.itemData;
	const quantity = x?.quantity?.toString().includes('.')
		? x?.quantity?.toString()
		: formatMoneyUSDT(x?.quantity?.toString());
	const pathImage = x?.pathImage?.split('/');
	const nameDocument = pathImage?.[pathImage?.length - 1];
	const URL_SERVER =
		process.env.REACT_APP_TYPE === 'development'
			? process.env.REACT_APP_URL_SERVER
			: process.env.REACT_APP_URL_SERVER_PRODUCTION;
	return (
		<>
			<SnackbarCp
				openSnackbar={snackbar.open}
				handleCloseSnackbar={handleCloseSnackbar}
				messageSnackbar={snackbar.message}
				typeSnackbar={snackbar.type}
			/>
			<Button
				className="confirmbgc mb8"
				onClick={refreshPage.refreshPage}
			>
				<div className="flex-center">
					<Icons.RefreshIcon className="fz12 mr8" />
					<span className={`${cx('general-button-text')}`}>
						Refresh Page
					</span>
				</div>
			</Button>
			<div className={`${cx('info-container')}`}>
				<div className={`${cx('detail-container')}`}>
					<div className="detail-item">
						<div className="detail-title">Status</div>
						<div className={`${cx('detail-status')}`}>
							{x ? (
								<>
									<span
										className={`status fwb ${
											x?.status
												?.toLowerCase()
												?.replace(' ', '') + 'bgc'
										}`}
									>
										{textUtils.FirstUpc(x?.status)}
									</span>
								</>
							) : (
								<Skeleton width={50} />
							)}
						</div>
					</div>
					<ItemRender
						title="IdUser"
						info={x && x?.IdUser}
						colorInfo={`status vipbgc`}
					/>
					<ItemRender
						title="Quantity"
						info={x && (quantity || 0) + ' USDT'}
					/>
					{idWithdraw && (
						<>
							<ItemRender
								title="Receiving Wallet"
								info={x && x?.addressPayment}
							/>
							<ItemRender
								title="Gate Payment"
								info={x && x?.gatePayment}
							/>
						</>
					)}
					<ItemRender
						title="Created"
						info={
							x &&
							moment(x?.createdAt).format('DD/MM/YYYY HH:mm:ss')
						}
					/>
					{/*
					<ItemRender
						title="Payment method"
						bankInfo
						methodBank={
							x && location.pathname.includes('withdraw')
								? x?.method?.methodName
								: x?.bankAdmin?.methodName
						}
						nameAccount={
							x && location.pathname.includes('withdraw')
								? x?.method?.accountName
								: x?.bankAdmin?.accountName
						}
						numberAccount={
							x && location.pathname.includes('withdraw')
								? x?.method?.accountNumber
								: x?.bankAdmin?.accountNumber
						}
					/> */}
					{idDeposits && (
						<ItemRender
							title="Document"
							info={
								x && (
									<a
										href={`${URL_SERVER}/${x?.pathImage}`}
										target="_blank"
										rel="noreferrer"
									>
										{x?.pathImage ? (
											nameDocument?.replace(
												'/images/',
												'',
											)
										) : (
											<Skeleton width="30px" />
										)}
									</a>
								)
							}
						/>
					)}
				</div>
				{idDeposits && (
					<div className={`${cx('detail-container')}`}>
						<div className={`${cx('document-review-container')}`}>
							<div className={`${cx('document-review-title')}`}>
								Document Review
							</div>
							{x?.pathImage ? (
								<div className={`${cx('document-container')}`}>
									<Image
										src={`${URL_SERVER}/${x?.pathImage}`}
										alt={x?.pathImage.replace(
											'/images/',
											'',
										)}
										className={`${cx(
											'document-review-image',
										)}`}
									/>
								</div>
							) : (
								<Skeleton width="100%" height="200px" />
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default DepositsWithdrawDetail;
