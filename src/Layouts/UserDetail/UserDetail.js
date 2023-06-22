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
import styles from './UserDetail.module.css';
import {
	blockUserSV,
	changePasswordUserSV,
	getUserByIdSV,
} from '../../services/users';

const cx = className.bind(styles);

function UserDetail() {
	const { idUser } = useParams();
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
	const getUserById = (dataToken) => {
		getUserByIdSV({
			idUser,
			token: dataToken?.token,
			dispatch,
			state,
			setSnackbar,
		});
	};
	useEffect(() => {
		document.title = `Detail | ${process.env.REACT_APP_TITLE_WEB}`;
		requestRefreshToken(currentUser, getUserById, state, dispatch, actions);
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
	const changeInput = (e) => {
		return formUtils.changeForm(e, dispatch, state, actions);
	};
	const modalChangePwdTrue = (e, id) => {
		return deleteUtils.deleteTrue(e, id, dispatch, state, actions);
	};
	const modalChangePwdFalse = (e) => {
		return deleteUtils.deleteFalse(e, dispatch, state, actions);
	};
	const DATA_IMAGE_MODAL = [
		x?.uploadCCCDFont?.replace('uploads/', ''),
		x?.uploadCCCDBeside?.replace('uploads/', ''),
		x?.uploadLicenseFont?.replace('uploads/', ''),
		x?.uploadLicenseBeside?.replace('uploads/', ''),
	];
	const modalImageTrue = (e) => {
		e.stopPropagation();
		setIsModalImage(true);
	};
	const modalImageFalse = (e) => {
		e.stopPropagation();
		setIsModalImage(false);
		setIndexImage(0);
	};
	const handleChangePassword = (dataToken) => {
		changePasswordUserSV({
			idUser,
			token: dataToken?.token,
			dispatch,
			state,
			password,
			setSnackbar,
			setIsProcessChangePwd,
		});
	};
	const changePwd = () => {
		dispatch(actions.toggleModal({ ...state.toggle, modalDelete: false }));
		setSnackbar({
			open: true,
			type: 'info',
			message: 'Functions under development!',
		});
	};
	const refreshPwd = async () => {
		setSnackbar({
			open: true,
			type: 'info',
			message: 'Functions under development!',
		});
	};
	const handleBlockSV = (dataToken) => {
		blockUserSV({
			idUser,
			token: dataToken?.token,
			dispatch,
			state,
			Lock: !x?.Lock,
			setSnackbar,
			setIsProcessBlockUser,
		});
	};
	const onBlockUser = () => {
		setIsProcessBlockUser(true);
		requestRefreshToken(
			currentUser,
			handleBlockSV,
			state,
			dispatch,
			actions,
		);
	};
	const URL_SERVER =
		process.env.REACT_APP_TYPE === 'development'
			? process.env.REACT_APP_URL_SERVER
			: process.env.REACT_APP_URL_SERVER_PRODUCTION;
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
	function ImageDocumentRender({
		label,
		isCheck,
		imageFrontUrl,
		imageBesideUrl,
	}) {
		return (
			<div className={`${cx('document-container')}`}>
				<div className={`${cx('document-user-title')}`}>{label}</div>
				{isCheck ? (
					<div className={`${cx('document-user-item')}`}>
						<Image
							src={`${URL_SERVER}/${imageFrontUrl?.replace(
								'uploads/',
								'',
							)}`}
							alt=""
							className={`${cx('document-user-item-image-view')}`}
							onClick={(e) => {
								modalImageTrue(e);
								const index = DATA_IMAGE_MODAL.findIndex(
									(item) =>
										item ===
										imageFrontUrl?.replace('uploads/', ''),
								);
								setIndexImage(index);
							}}
						/>
						<Image
							src={`${URL_SERVER}/${imageBesideUrl?.replace(
								'uploads/',
								'',
							)}`}
							alt=""
							className={`${cx('document-user-item-image-view')}`}
							onClick={(e) => {
								modalImageTrue(e);
								const index = DATA_IMAGE_MODAL.findIndex(
									(item) =>
										item ===
										imageBesideUrl?.replace('uploads/', ''),
								);
								setIndexImage(index);
							}}
						/>
					</div>
				) : (
					<Skeleton width="100%" height="200px" />
				)}
			</div>
		);
	}
	return (
		<>
			<div className={`${cx('buySellDetail-container')}`}>
				<SnackbarCp
					openSnackbar={snackbar.open}
					handleCloseSnackbar={handleCloseSnackbar}
					messageSnackbar={snackbar.message}
					typeSnackbar={snackbar.type}
				/>
				<div className={`${cx('detail-container')}`}>
					<ItemRender
						title="Roles"
						info={x && x?.roles}
						colorInfo={'confirmbgc status'}
					/>
					<ItemRender title="Email" info={x && x?.email} />
					<ItemRender
						title="chatIdLogin"
						info={x && x?.chatIdLogin}
					/>
					<ItemRender title="Point" info={x && x?.point} />
					<ItemRender
						title="Created At"
						info={
							x &&
							moment(x?.createdAt).format('DD/MM/YYYY HH:mm:ss')
						}
					/>
				</div>
				<div className={`${cx('detail-container')}`}>
					<div className={`${cx('document-user-container')} w100`}>
						<ImageDocumentRender
							label="1. Citizen Identification"
							isCheck={x?.uploadCCCDFont && x?.uploadCCCDBeside}
							imageFrontUrl={x?.uploadCCCDFont}
							imageBesideUrl={x?.uploadCCCDBeside}
						/>
						<ImageDocumentRender
							label="2. License"
							isCheck={
								x?.uploadLicenseFont && x?.uploadLicenseBeside
							}
							imageFrontUrl={x?.uploadLicenseFont}
							imageBesideUrl={x?.uploadLicenseBeside}
						/>
					</div>
				</div>
				<div className={`${cx('list-btn-container')}`}>
					<Button
						className={`${cx('btn')} confirmbgc`}
						onClick={refreshPage.refreshPage}
					>
						<div className="flex-center">
							<Icons.RefreshIcon className="fz12 mr8" />
							<span className={`${cx('general-button-text')}`}>
								Refresh Page
							</span>
						</div>
					</Button>
					<Button
						className={`${cx('btn')} cancelbgc`}
						onClick={onBlockUser}
						isProcess={isProcessBlockUser}
						disabled={isProcessBlockUser}
					>
						<div className="flex-center">
							{!x?.Lock ? (
								<Icons.BlockUserIcon />
							) : (
								<Icons.UnBlockUserIcon />
							)}{' '}
							<span className="ml8">
								{!x?.Lock ? 'Block User' : 'Unblock User'}
							</span>
						</div>
					</Button>
					<Button
						className={`${cx('btn')} confirmbgc`}
						onClick={refreshPwd}
						isProcess={isProcessRefreshPwd}
						disabled={isProcessRefreshPwd}
					>
						<div className="flex-center">
							<Icons.RefreshPageIcon />{' '}
							<span className="ml8">Refresh Password</span>
						</div>
					</Button>
					<Button
						className={`${cx('btn')} completebgc`}
						onClick={(e) => modalChangePwdTrue(e, idUser)}
					>
						<div className="flex-center">
							<Icons.EditIcon />{' '}
							<span className="ml8">Change Password</span>
						</div>
					</Button>
				</div>
			</div>
			<ModalViewImage
				stateModal={isModalImage}
				closeModal={modalImageFalse}
				uniqueData={DATA_IMAGE_MODAL}
				indexImage={indexImage}
				setIndexImage={setIndexImage}
			/>
			{modalDelete && (
				<Modal
					titleHeader="Change Password"
					actionButtonText="Change"
					closeModal={modalChangePwdFalse}
					openModal={modalChangePwdTrue}
					classNameButton="vipbgc"
					onClick={changePwd}
					isProcess={isProcessChangePwd}
				>
					<FormInput
						type="password"
						name="password"
						placeholder="Enter new password..."
						label="Password"
						showPwd
						onChange={changeInput}
					/>
				</Modal>
			)}
		</>
	);
}

export default UserDetail;
