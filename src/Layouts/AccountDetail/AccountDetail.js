/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import className from 'classnames/bind';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import {
	FormInput,
	Button,
	Icons,
	Modal,
	Image,
	ModalViewImage,
	SnackbarCp,
} from '../../components';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
	useAppContext,
	requestRefreshToken,
	deleteUtils,
	formUtils,
	refreshPage,
} from '../../utils';
import { actions } from '../../app/';
import styles from './AccountDetail.module.css';
import {
	blockUserSV,
	changePasswordUserSV,
	getUserByIdSV,
} from '../../services/users';
import { getAccountByIdSV } from '../../services/account';

const cx = className.bind(styles);

function AccountDetail() {
	const { idAccount } = useParams();
	const { state, dispatch } = useAppContext();
	const {
		edit,
		currentUser,
		pagination: { page, show },
		form: { password },
	} = state.set;
	const { modalDelete, selectStatus } = state.toggle;
	const [isModalImage, setIsModalImage] = useState(false);
	const [indexImage, setIndexImage] = useState(0);
	const [isProcessChangePwd, setIsProcessChangePwd] = useState(false);
	const [isProcessBlockUser, setIsProcessBlockUser] = useState(false);
	const [isProcessRefreshPwd, setIsProcessRefreshPwd] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		type: '',
		message: '',
	});
	const x = edit?.itemData;
	const getAccountById = (dataToken) => {
		getAccountByIdSV({
			idAccount,
			dispatch,
			state,
			setSnackbar,
			token: dataToken?.token,
		});
	};
	useEffect(() => {
		document.title = `Detail | ${process.env.REACT_APP_TITLE_WEB}`;
		requestRefreshToken(
			currentUser,
			getAccountById,
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
	useEffect(() => {}, [page, show]);
	function ItemRender({ title, info, colorInfo }) {
		return (
			<div className="detail-item">
				<div className="detail-title" style={{ minWidth: '120px' }}>
					{title}
				</div>
				<div className={`${cx('detail-status')}`}>
					<span className={`info ${colorInfo}`}>
						{info || info === 0 ? info : <Skeleton width={30} />}
					</span>
				</div>
			</div>
		);
	}
	return (
		<>
			<Button
				className="confirmbgc mt8-mobile"
				onClick={refreshPage.refreshPage}
			>
				<div className="flex-center">
					<Icons.RefreshIcon className="fz12" />
					<span className={`${cx('general-button-text')} ml8`}>
						Refresh Page
					</span>
				</div>
			</Button>
			<div className={`${cx('buySellDetail-container')}`}>
				<SnackbarCp
					openSnackbar={snackbar.open}
					handleCloseSnackbar={handleCloseSnackbar}
					messageSnackbar={snackbar.message}
					typeSnackbar={snackbar.type}
				/>
				<div className={`${cx('detail-container')}`}>
					<ItemRender
						title="IdUser"
						info={x && x.IdUser}
						colorInfo={'confirmbgc status'}
					/>
					<ItemRender
						title="Account name"
						info={x && x.accountName}
					/>
					<ItemRender title="Username" info={x && x.username} />
					<ItemRender
						title="Proxy username"
						info={x && x.proxyUsername}
					/>
					<ItemRender title="Password" info={x && x.password} />
					<ItemRender
						title="Proxy password"
						info={x && x.proxyPassword}
					/>
					<ItemRender title="Host" info={x && x.host} />
					<ItemRender title="Proxy host" info={x && x.proxyHost} />
					<ItemRender title="Port" info={x && x.port} />
					<ItemRender title="Proxy port" info={x && x.proxyPort} />
					<ItemRender
						title="Server broker"
						info={x && x.serverBroker}
					/>
					<ItemRender title="Type Acc" info={x && x.typeAcc} />
					<ItemRender
						title="Created At"
						info={
							x &&
							moment(x.createdAt).format('DD/MM/YYYY HH:mm:ss')
						}
					/>
				</div>
			</div>
		</>
	);
}

export default AccountDetail;
