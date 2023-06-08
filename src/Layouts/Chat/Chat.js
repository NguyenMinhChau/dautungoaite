/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import className from 'classnames/bind';
import styles from './Chat.module.css';
import socketIO from 'socket.io-client';
import { requestRefreshToken, useAppContext } from '../../utils';
import { actions } from '../../app/';
import { Button } from '../../components';
import { TextareaAutosize } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getAllChatByEmailSV } from '../../services/users';

import moment from 'moment';

const cx = className.bind(styles);
const socket = socketIO(`${process.env.REACT_APP_URL_SOCKET}`, {
	jsonp: false,
});
const AVATAR_PLACEHOLDER =
	'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=2000';

function Chat() {
	const { state, dispatch } = useAppContext();
	const { chat, currentUser } = state.set;
	const from = currentUser?.email;
	const to = 'bot';
	const [openScrollToBottom, setOpenScrollToBottom] = useState(false);
	const [dataMessage, setDataMessage] = useState([]);
	const textareaRef = useRef();
	const contentChatRef = useRef();
	const scrollToBottom = () => {
		if (contentChatRef.current) {
			contentChatRef.current.scrollTop =
				contentChatRef.current.scrollHeight;
		}
	};
	const getAllChat = (dataToken) => {
		getAllChatByEmailSV({
			emailUser: currentUser?.email,
			setDataMessage,
			token: dataToken?.token,
		});
	};
	useEffect(() => {
		socket.on('get_messages', (data) => {
			// setDataMessage(data);
			setDataMessage((prev) => [...prev, data]);
		});
		if (dataMessage.length > 0) {
			requestRefreshToken(
				currentUser,
				getAllChat,
				state,
				dispatch,
				actions,
			);
		}
		const handleScrollTop = () => {
			if (
				contentChatRef.current.scrollTop +
					contentChatRef.current.clientHeight +
					250 <
				contentChatRef.current.scrollHeight
			) {
				setOpenScrollToBottom(true);
			} else {
				setOpenScrollToBottom(false);
			}
		};
		contentChatRef.current?.addEventListener('scroll', () => {
			handleScrollTop();
		});
		return () => {
			socket.off('get_messages');
			document.removeEventListener('scroll', () => {
				handleScrollTop();
			});
		};
	}, []);
	useEffect(() => {
		scrollToBottom();
	}, [dataMessage]);
	const handleChangeTextAreae = (e) => {
		dispatch(actions.setData({ chat: e.target.value }));
	};
	const handleSendMessage = () => {
		if (!chat) {
			textareaRef.current.focus();
		} else {
			socket.emit('message', {
				from: from,
				to: to,
				message: chat,
			});
			setDataMessage((prev) => [
				...prev,
				{
					createdAt: new Date(),
					email: currentUser?.email,
					text: chat,
				},
			]);
			requestRefreshToken(
				currentUser,
				getAllChat,
				state,
				dispatch,
				actions,
			);
			dispatch(actions.setData({ chat: '' }));
		}
	};
	const handleOnCopy = () => {};
	const DATA_CHAT =
		dataMessage.slice(dataMessage.length - 20, dataMessage.length) || [];
	const handleClearChat = () => {
		setDataMessage([]);
	};
	return (
		<div className={`${cx('container_chat')}`}>
			<div className={`${cx('list_btn_actions')} mb8`}>
				<Button className={'cancelbgc'} onClick={handleClearChat}>
					<i class="bx bx-trash mr4"></i> Clear Chat
				</Button>
			</div>
			<div className={`${cx('frame_chat_container')}`}>
				<div className={`${cx('chat_content')}`}>
					<div className={`${cx('content')}`} ref={contentChatRef}>
						{DATA_CHAT.length <= 0 ? (
							<div className={`${cx('no_chat_text')}`}>
								Bắt đầu trò chuyện thôi nào...
							</div>
						) : (
							<>
								{DATA_CHAT?.map((item, index) => {
									return (
										<div
											className={`${cx(
												'content_item',
												// item?.idUser === idUser
												(index + 1) % 2 === 0
													? // !item?._id
													  'right_align'
													: 'left_align',
											)}`}
											key={index}
											title={moment(
												item?.createdAt,
											).format('DD/MM/YYYY HH:mm:ss')}
										>
											<div
												className={`${cx(
													'content_item_text_image_container',
												)} ${
													(index + 1) % 2 === 0
														? // !item?._id
														  'flex-end flex-row-reverse'
														: 'flex-start'
												}`}
											>
												<img
													src={AVATAR_PLACEHOLDER}
													alt=""
													className={`${cx(
														'content_item_image',
													)} ${
														(index + 1) % 2 === 0
															? // !item?._id
															  'ml8'
															: 'mr8'
													}`}
												/>
												<div
													className={`${cx(
														'content_item_text',
													)}`}
													dangerouslySetInnerHTML={{
														__html: item?.text,
													}}
												></div>
											</div>
											<div
												className={`${cx(
													'content_item_time',
												)}`}
											>
												<span>
													{moment(
														item?.createdAt,
													).fromNow()}
												</span>
												<CopyToClipboard
													text={item?.text}
													onCopy={handleOnCopy}
												>
													<span
														className={`${cx(
															'icon_copy',
														)} ml8`}
													>
														<i class="bx bx-copy-alt"></i>
													</span>
												</CopyToClipboard>
											</div>
										</div>
									);
								})}
							</>
						)}
					</div>
					{openScrollToBottom && (
						<div
							className={`${cx('scroll_to_bottom')}`}
							onClick={scrollToBottom}
						>
							<i
								className="bx bx-chevrons-down bx-fade-down"
								style={{ color: '#f8c000' }}
							></i>
						</div>
					)}
				</div>

				<div className={`${cx('chat')}`}>
					<div className={`${cx('chat_textarea')}`}>
						<div className={`${cx('chat_textarea_relative')}`}>
							<TextareaAutosize
								minRows={1}
								maxRows={3}
								placeholder="Write something..."
								value={chat}
								onChange={handleChangeTextAreae}
								onKeyDown={(e) => {
									if (
										e.key === 'Enter' &&
										!e.shiftKey &&
										window.innerWidth > 768
									) {
										e.preventDefault();
										handleSendMessage();
									}
								}}
								name="chat"
								ref={textareaRef}
							/>
						</div>
						<div
							className={`${cx('send_icon')}`}
							onClick={handleSendMessage}
						>
							<i
								className="bx bx-send"
								style={{ color: '#f8c000' }}
							></i>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Chat;
