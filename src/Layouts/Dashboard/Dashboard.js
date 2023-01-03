/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import className from 'classnames/bind';
import 'react-loading-skeleton/dist/skeleton.css';
import { actions } from '../../app/';
import moment from 'moment';
import styles from './Dashboard.module.css';
import {
    Button,
    Icons,
    Modal,
    Search,
    SearchDate,
    SelectValue,
    TableData,
} from '../../components';
import {
    DataDashboard,
    DataUserBalance,
    dateUtils,
    handleUtils,
    numberUtils,
    refreshPage,
    searchUtils,
    useAppContext,
    useDebounce,
} from '../../utils';
import { Link } from 'react-router-dom';
import routers from '../../routers/routers';
import { getCoinsUserBuy } from '../../services/coins';
import { SVtotal } from '../../services/dashboard';
import { FirstUpc } from '../../utils/format/LetterFirstUpc';
import periodDate from '../../utils/FakeData/PeriodDate';

const cx = className.bind(styles);

function Dashboard() {
    const { state, dispatch } = useAppContext();
    const {
        totalDeposit,
        totalWithdraw,
        totalBalance,
        totalCommission,
        dataUserBalance,
        data: { dataDashboard },
        searchValues: { dateFrom, dateTo, dashboard, userBalance },
        pagination: { page, show },
    } = state.set;
    const [isProcess, setIsProcess] = React.useState(false);
    const [isLoad, setIsLoad] = React.useState(false);
    const [isModalDate, setIsModalDate] = React.useState(false);
    const [isPeriod, setIsPeriod] = React.useState(false);
    const [period, setPeriod] = React.useState(null);
    const [date, setDate] = React.useState({
        from: null,
        to: null,
    });
    useEffect(() => {
        document.title = `Dashboard | ${process.env.REACT_APP_TITLE_WEB}`;
        SVtotal({
            state,
            dispatch,
            actions,
            page,
            show,
            search: userBalance,
        });
    }, []);
    const useDebounceDashboard = useDebounce(dashboard, 500);
    const useDebounceUserBalance = useDebounce(userBalance, 500);
    useEffect(() => {
        if (useDebounceDashboard || useDebounceUserBalance) {
            setTimeout(() => {
                dispatch(
                    actions.setData({
                        pagination: { page: 1, show: 10 },
                    })
                );
            }, 500);
        }
    }, [useDebounceDashboard, useDebounceUserBalance]);
    useEffect(() => {
        getCoinsUserBuy({
            page,
            show: dashboard ? dataDashboard?.data?.total : show,
            dispatch,
            state,
            actions,
        });
        SVtotal({
            state,
            dispatch,
            actions,
            page,
            show,
            search: useDebounceUserBalance,
            setIsLoad,
        });
    }, [page, show, useDebounceDashboard, useDebounceUserBalance]);
    // console.log(dataUserBalance);
    let data = dataDashboard?.data?.coins || [];
    if (dashboard) {
        data = data.filter((item) => {
            return (
                searchUtils.searchInput(dashboard, item.symbol) ||
                searchUtils.searchInput(dashboard, item.total)
            );
        });
    }
    let dataUser = dataUserBalance?.users || [];
    const openModalDate = (e) => {
        e.stopPropagation();
        setIsModalDate(true);
    };
    const closeModalDate = (e) => {
        e.stopPropagation();
        setIsModalDate(false);
        setPeriod(null);
        setDate({
            from: null,
            to: null,
        });
        dispatch(
            actions.setData({
                searchValues: {
                    dateFrom: null,
                    dateTo: null,
                },
            })
        );
    };
    const tooglePeriod = (e) => {
        e.stopPropagation();
        setIsPeriod(!isPeriod);
    };
    // GET WEEEK[YEAR, WEEK]
    // const getWeekNumber = (d) => {
    //     // Copy date so don't modify original
    //     d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    //     // Set to nearest Thursday: current date + 4 - current day number
    //     // Make Sunday's day number 7
    //     d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    //     // Get first day of year
    //     const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    //     // Calculate full weeks to nearest Thursday
    //     const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    //     // Return array of year and week number
    //     return [d.getUTCFullYear(), weekNo];
    // };
    const handleChangePeriod = (item) => {
        console.log(item);
        const date = new Date();
        let toDate = new Date();
        let fromDate = new Date();
        switch (item?.toLowerCase()?.replace(/\s/g, '')) {
            case 'today':
                fromDate = new Date();
                break;
            case 'yesterday':
                fromDate = new Date(date.setDate(date.getDate() - 1));
                break;
            case 'thisweek':
                //lấy ngày thứ 2 của tuần week[1]
                fromDate = new Date(
                    date.setDate(date.getDate() - date.getDay() + 1)
                );
                break;
            case 'lastweek':
                fromDate = new Date(
                    date.setDate(date.getDate() - date.getDay() + 1 - 7)
                );
                toDate = new Date(
                    date.setDate(date.getDate() - date.getDay() + 7)
                );
                break;
            case 'thismonth':
                // lấy ngày đầu tiên của tháng
                fromDate = new Date(date.setDate(1));
                break;
            case 'lastmonth':
                fromDate = new Date(date.setMonth(date.getMonth() - 1, 1));
                toDate = new Date(date.setMonth(date.getMonth() + 1, 0));
                break;
            case 'thisyear':
                // lấy ngày đầu tiên của năm
                fromDate = new Date(date.setMonth(0, 1));
                break;
            case 'lastyear':
                fromDate = new Date(
                    date.setFullYear(date.getFullYear() - 1, 0, 1)
                );
                toDate = new Date(
                    date.setFullYear(date.getFullYear() + 1, 0, 0)
                );
                break;
            default:
                fromDate = new Date();
                break;
        }
        dispatch(
            actions.setData({
                searchValues: {
                    dateFrom: dateUtils.dateVnFormat2(fromDate),
                    dateTo: dateUtils.dateVnFormat2(toDate),
                },
            })
        );
        setPeriod(item);
        setIsPeriod(false);
    };
    const handleChangeDate = (e) => {
        const { name, value } = e.target;
        dispatch(
            actions.setData({
                searchValues: { [name]: value },
            })
        );
    };
    const changeSearch = (e) => {
        return searchUtils.logicSearch(e, dispatch, state, actions);
    };
    const handleSend = async () => {
        try {
            await 1;
            setIsProcess(true);
            setIsLoad(true);
            setTimeout(() => {
                SVtotal({
                    state,
                    dispatch,
                    actions,
                    fromDate: dateFrom || new Date().toISOString(),
                    toDate: dateTo || new Date().toISOString(),
                    page,
                    show,
                    search: useDebounceUserBalance
                        ? useDebounceUserBalance
                        : '',
                    setIsLoad,
                });
                setIsProcess(false);
                setIsLoad(false);
            }, 1000);
        } catch (err) {
            console.log(err);
        }
    };
    const onSelectDate = (e) => {
        e.stopPropagation();
        setIsModalDate(false);
        setDate({
            from: dateFrom || dateUtils.dateVnFormat2(new Date()),
            to: dateTo || dateUtils.dateVnFormat2(new Date()),
        });
    };
    const ChartItem = ({ title, value, link, to }) => {
        return (
            <div className={`${cx('item')}`}>
                {link ? (
                    <Link to={to} className={`${cx('title-link')}`}>
                        {title}
                    </Link>
                ) : (
                    <div className={`${cx('title')}`}>{title}</div>
                )}
                <div className={`${cx('value')}`}>
                    {isLoad ? 'Loading...' : numberUtils.formatUSD(value || 0)}
                </div>
            </div>
        );
    };
    function RenderBodyTable({ data }) {
        return (
            <>
                {data.map((item, index) => {
                    return (
                        <tr key={item?._id} className='fz14'>
                            <td className='upc'>
                                {handleUtils.indexTable(page, show, index)}
                            </td>
                            <td>{item.symbol}</td>
                            <td className='text-left'>{item.total}</td>
                        </tr>
                    );
                })}
            </>
        );
    }
    function RenderBodyTableUser({ data }) {
        return (
            <>
                {data.map((item, index) => {
                    return (
                        <tr key={item?._id} style={{ fontSize: '14px' }}>
                            <td className='upc'>
                                {handleUtils.indexTable(page, show, index)}
                            </td>
                            <td className='item-w150'>
                                {item.payment.username}
                            </td>
                            <td className='item-w150 text-left'>
                                {item.payment.email}
                            </td>
                            <td className='text-left'>
                                {numberUtils.formatUSD(item.Wallet.balance)}
                            </td>
                            <td className='text-left'>
                                <span
                                    className={`${
                                        item.payment.rule + 'bgc'
                                    } status`}
                                >
                                    {item.payment.rule}
                                </span>
                            </td>
                            <td className='text-left'>
                                <span
                                    className={`${
                                        item.rank.toLowerCase() + 'bgc'
                                    } status`}
                                >
                                    {FirstUpc(item.rank)}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </>
        );
    }
    return (
        <div className={`${cx('dashboard-container')}`}>
            <div className={`${cx('general-top')}`}>
                <div className='flex-center mt8'>
                    <Button
                        className={`${cx('general-button')} cancelbgc`}
                        onClick={openModalDate}
                    >
                        <Icons.SearchDateIcon />
                        <span className={`${cx('general-button-text')}`}>
                            Select Date Report
                        </span>
                    </Button>
                    <Button
                        className={`${cx('general-button')} completebgc`}
                        onClick={handleSend}
                        isProcess={isProcess}
                        disabled={isProcess}
                    >
                        <span className={`${cx('general-button-icon')}`}>
                            <i className='fa-regular fa-paper-plane'></i>
                        </span>
                        <span className={`${cx('general-button-text')}`}>
                            Send
                        </span>
                    </Button>
                    <Button
                        className='confirmbgc'
                        onClick={refreshPage.refreshPage}
                        style={{ width: 'max-content' }}
                    >
                        <div className='flex-center'>
                            <Icons.RefreshIcon className='fz12' />
                            <span className={`${cx('general-button-text')}`}>
                                Refresh Page
                            </span>
                        </div>
                    </Button>
                </div>
            </div>
            {date.from && date.to && (
                <div className={`${cx('desc-report')}`}>
                    Report from{' '}
                    <span className='cancel'>
                        {moment(date.from).format('DD/MM/YYYY')}
                    </span>{' '}
                    to{' '}
                    <span className='cancel'>
                        {moment(date.to).format('DD/MM/YYYY')}
                    </span>
                </div>
            )}
            <div className={`${cx('chart-container')}`}>
                <div className={`${cx('chart-item-container')}`}>
                    <ChartItem
                        title='Total Deposits'
                        value={totalDeposit}
                        link
                        to={routers.deposits}
                    />
                    <ChartItem
                        title='Total Withdraw'
                        value={totalWithdraw}
                        link
                        to={routers.withdraw}
                    />
                    <ChartItem title='Balance' value={totalBalance} />
                    <ChartItem title='Commission' value={totalCommission} />
                </div>
            </div>
            <div className={`${cx('general-table-container')}`}>
                <div className={`${cx('title-header')}`}>Danh sách Symbol</div>
                <Search
                    name='dashboard'
                    value={dashboard}
                    onChange={changeSearch}
                    className={`${cx('search-coin')}`}
                />
                <TableData
                    data={data}
                    totalData={
                        dashboard ? data?.length : dataDashboard?.data?.total
                    }
                    headers={DataDashboard().headers}
                    search=''
                    noActions
                >
                    <RenderBodyTable data={data} />
                </TableData>
            </div>
            <div className={`${cx('general-table-container')}`}>
                <div className={`${cx('title-header')}`}>
                    Danh sách user còn balance
                </div>
                <Search
                    name='userBalance'
                    value={userBalance}
                    onChange={changeSearch}
                    className={`${cx('search-coin')}`}
                />
                <TableData
                    data={dataUser}
                    totalData={dataUserBalance?.totalUser}
                    headers={DataUserBalance().headers}
                    search=''
                    noActions
                >
                    <RenderBodyTableUser data={dataUser} />
                </TableData>
            </div>
            {isModalDate && (
                <Modal
                    titleHeader='Select date report'
                    actionButtonText='Select'
                    openModal={openModalDate}
                    closeModal={closeModalDate}
                    classNameButton='vipbgc'
                    onClick={onSelectDate}
                >
                    <SelectValue
                        label='Period'
                        toggleModal={tooglePeriod}
                        stateModal={isPeriod}
                        dataFlag={periodDate}
                        onClick={handleChangePeriod}
                        valueSelect={period ? period : 'Today'}
                    />
                    <div className={`${cx('search-container')}`}>
                        <div className={`${cx('search-title')}`}>From</div>
                        <SearchDate
                            name='dateFrom'
                            value={
                                dateFrom
                                    ? dateFrom
                                    : dateUtils.dateVnFormat2(new Date())
                            }
                            onChange={handleChangeDate}
                            className={`${cx('search')}`}
                        />
                    </div>
                    <div className={`${cx('search-container')}`}>
                        <div className={`${cx('search-title')}`}>To</div>
                        <SearchDate
                            name='dateTo'
                            value={
                                dateTo
                                    ? dateTo
                                    : dateUtils.dateVnFormat2(new Date())
                            }
                            onChange={handleChangeDate}
                            className={`${cx('search')}`}
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default Dashboard;
