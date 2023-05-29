/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAppContext } from './utils';
import { DefaultLayout } from './Layouts';
import { actions } from './app/';
import {
	privateRouter,
	publicRouter,
	userRouter,
} from './routers/routerRender';
import routers from './routers/routers';

function App() {
	const { state, dispatch } = useAppContext();
	const { currentUser } = state.set;
	const [scrollToTop, setScrollToTop] = React.useState(false);
	// const Routers =
	// 	currentUser?.rule === 'admin' || currentUser?.rule === 'manager'
	// 		? privateRouter
	// 		: currentUser?.rule === 'user'
	// 		? userRouter
	// 		: publicRouter;
	const Routers = currentUser ? privateRouter : publicRouter;
	const history = useNavigate();

	useEffect(() => {
		const handleScrollToTop = () => {
			const heightY = window.scrollY;
			if (heightY > 100) {
				setScrollToTop(true);
			} else {
				setScrollToTop(false);
			}
		};
		window.addEventListener('scroll', handleScrollToTop);
		const isPath = publicRouter.filter((x) =>
			window.location.pathname.includes(x.path),
		);
		if (currentUser) {
			dispatch(
				actions.setData({
					...state.set,
					currentUser: currentUser,
				}),
			);
			if (isPath.length > 0) {
				history(routers.chat);
			} else {
				history(window.location.pathname);
			}
		} else {
			if (!currentUser && isPath.length <= 0) {
				history(routers.login);
			} else {
				history(window.location.pathname);
			}
		}
	}, []);
	return (
		<>
			<div className="app">
				<Routes>
					{Routers.map((route, index) => {
						const Layout = route.layout
							? route.layout
							: route.layout === null
							? Fragment
							: DefaultLayout;
						const Page = route.component;
						return (
							<Route
								key={index}
								path={route.path}
								element={
									<Layout>
										<Page />
									</Layout>
								}
							/>
						);
					})}
				</Routes>
				{scrollToTop && (
					<div
						className="scroll-to-top-container"
						onClick={() => {
							window.scrollTo({ top: 0, behavior: 'smooth' });
						}}
					>
						<i className="fa-solid fa-arrow-up"></i>
					</div>
				)}
			</div>
		</>
	);
}

export default App;
