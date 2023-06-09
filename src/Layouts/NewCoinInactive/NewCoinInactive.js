/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import className from 'classnames/bind';
import { useParams, useNavigate } from 'react-router-dom';
import {
	useAppContext,
	formUtils,
	fileUploadUtils,
	requestRefreshToken,
	refreshPage,
} from '../../utils';
import routers from '../../routers/routers';
import { actions } from '../../app/';
import {
	FormInput,
	FileUpload,
	Button,
	Icons,
	SnackbarCp,
} from '../../components';
import styles from './NewCoinInactive.module.css';

const cx = className.bind(styles);

function NewCoinInactive() {
	const { idCoin } = useParams();
	const { state, dispatch } = useAppContext();
	const {
		fileRejections,
		edit,
		currentUser,
		pagination: { page, show },
		searchValues: { settingCoin },
		form: { nameCoin, symbolCoin, fullName, logo },
	} = state.set;
	const [snackbar, setSnackbar] = useState({
		open: false,
		type: '',
		message: '',
	});
	const [isProcess, setIsProcess] = useState(false);
	const refNameCoin = useRef();
	const refSymbolCoin = useRef();
	const refFullName = useRef();
	const refLogo = useRef();
	useEffect(() => {
		document.title = `${
			edit.itemData ? 'Update Coin Inactive' : 'Create Coin Inactive'
		} | ${process.env.REACT_APP_TITLE_WEB}`;
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
	useEffect(() => {}, []);
	// Modal + Input Form + File Upload
	const handleChange = (files) => {
		return fileUploadUtils.handleChange(files, dispatch, state, actions);
	};
	const handleRejected = (fileRejections) => {
		return fileUploadUtils.handleRejected(
			fileRejections,
			dispatch,
			state,
			actions,
		);
	};
	const handleRemove = () => {
		return fileUploadUtils.handleRemove(dispatch, state, actions);
	};
	const resetForm = (e) => {
		dispatch(
			actions.setData({
				form: {
					...state.set.form,
					nameCoin: '',
					symbolCoin: '',
					indexCoin: '',
					fullName: '',
					logo: null,
				},
				edit: {
					id: '',
					data: null,
					itemData: null,
				},
			}),
		);
	};
	const handleChangeForm = (e) => {
		return formUtils.changeForm(e, dispatch, state, actions);
	};
	// Add + Update Coin

	const addNewCoinInactive = (e) => {};

	const updateCoinInactive = async (e, id) => {};
	return (
		<>
			<div className={`${cx('newcoin-container')}`}>
				<div className="flex-space-between mb8">
					<h3 className={`${cx('newcoin-title')}`}>
						Coin Inactive Information
					</h3>
					<Button
						className="confirmbgc"
						onClick={refreshPage.refreshPage}
					>
						<div className="flex-center">
							<Icons.RefreshIcon className="fz12 mr8" />
							<span className={`${cx('general-button-text')}`}>
								Refresh Page
							</span>
						</div>
					</Button>
				</div>
				<SnackbarCp
					openSnackbar={snackbar.open}
					handleCloseSnackbar={handleCloseSnackbar}
					messageSnackbar={snackbar.message}
					typeSnackbar={snackbar.type}
				/>
				{/* FORM */}
				<div className={`${cx('newcoin-info-container')}`}>
					<div className={`${cx('newcoin-info')}`}>
						<FormInput
							label="Name"
							type="text"
							placeholder="Enter your full name"
							name="nameCoin"
							value={nameCoin}
							ref={refNameCoin}
							onChange={handleChangeForm}
							classNameField={`${cx('field-container')}`}
						/>
						<FormInput
							label="Symbol"
							type="text"
							placeholder="Enter coin short name"
							name="symbolCoin"
							value={symbolCoin}
							ref={refSymbolCoin}
							onChange={handleChangeForm}
							classNameField={`${cx('field-container')}`}
						/>
					</div>
					<div className={`${cx('newcoin-info')}`}>
						<FormInput
							label="FullName"
							type="text"
							placeholder="Enter fullName"
							name="fullName"
							value={fullName}
							ref={refFullName}
							onChange={handleChangeForm}
							classNameField={`${cx('field-container')}`}
						/>
					</div>
				</div>
				<FileUpload
					ref={refLogo}
					onChange={handleChange}
					onRemove={handleRemove}
					onRejected={handleRejected}
					fileRejections={fileRejections}
				/>
				<div className={`${cx('actions-container')}`}>
					<Button
						className="cancelbgc text-center"
						to={`${routers.coinInactive}`}
						onClick={resetForm}
					>
						Cancel
					</Button>
					<Button
						className="confirmbgc"
						onClick={
							edit?.itemData
								? (e) => updateCoinInactive(e, idCoin)
								: addNewCoinInactive
						}
						isProcess={isProcess}
						disabled={
							isProcess ||
							!fullName ||
							!logo ||
							!symbolCoin ||
							!nameCoin
						}
					>
						{edit?.itemData ? 'Update' : 'Add'}
					</Button>
				</div>
			</div>
		</>
	);
}

export default NewCoinInactive;
