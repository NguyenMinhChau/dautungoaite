import { actions } from '../app/';
import routers from '../routers/routers';
import { authPost } from '../utils/Axios/axiosInstance';
import {
	setStore,
	getStore,
	removeStore,
} from '../utils/localStore/localStore';

export const RegisterSV = async (props = {}) => {
	const { username, email, password, setIsProcess, history } = props;
	try {
		await authPost('register', {
			username,
			email,
			password,
		});
		setIsProcess(false);
		history(routers.login);
	} catch (err) {
		setIsProcess(false);
		alert(err?.response?.data?.message || 'Đăng kí thất bại');
	}
};
export const LoginSV = async (props = {}) => {
	const { email, password, setIsProcess, history, dispatch } = props;
	try {
		const resPost = await authPost('login', {
			email,
			password,
		});
		await setStore({
			token: resPost?.metadata?.token,
			username: resPost?.metadata?.user?.username,
			email: resPost?.metadata?.user?.email,
			rule: resPost?.metadata?.user?.roles,
			id: resPost?.metadata?.user?._id,
		});
		await dispatch(
			actions.setData({
				currentUser: getStore(),
			}),
		);
		setIsProcess(false);
		history(routers.chat);
	} catch (err) {
		setIsProcess(false);
		alert(err?.response?.data?.message || 'Đăng nhập thất bại');
	}
};
export const LogoutSV = async (props = {}) => {
	const { email, history, dispatch } = props;
	try {
		await authPost(`logout/${email}`, {});
		await removeStore();
		await dispatch(
			actions.setData({
				currentUser: getStore(),
			}),
		);
		history(routers.login);
	} catch (err) {
		alert(err?.response?.data?.message || 'Đăng xuất thất bại');
	}
};
