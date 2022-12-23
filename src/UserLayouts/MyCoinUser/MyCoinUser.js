/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import className from 'classnames/bind';
import styles from './MyCoinUser.module.css';
import {
    axiosUtils,
    DataMyCoinsUser,
    handleUtils,
    numberUtils,
    useAppContext,
    useDebounce,
} from '../../utils';
import { General } from '../../Layouts';
import { Link } from 'react-router-dom';
import routers from '../../routers/routers';
import moment from 'moment';
import { TrObjectImage } from '../../components/TableData/TableData';

const cx = className.bind(styles);

export default function MyCoinUser() {
    const { state } = useAppContext();
    const {
        currentUser,
        searchValues: { settingCoin },
        pagination: { page, show },
    } = state.set;
    const [data, setData] = useState([]);
    const useDebounceCoin = useDebounce(settingCoin, 500);
    const getMyCoin = async () => {
        const resGet = await axiosUtils.userGet(
            `/getAllCoinOfUser/${currentUser?.id}?page=${page}&show=${show}&search=${useDebounceCoin}`
        );
        setData(resGet.data);
    };
    useEffect(() => {
        getMyCoin();
    }, [page, show, useDebounceCoin]);
    const dataSettingFlag = data?.coins || [];
    function RenderBodyTable({ data }) {
        return (
            <>
                {data.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{handleUtils.indexTable(page, show, index)}</td>
                            <td>
                                <TrObjectImage
                                    item={`${
                                        process.env.REACT_APP_URL_SERVER
                                    }${item?.coin?.logo?.replace(
                                        'uploads/',
                                        ''
                                    )}`}
                                />
                            </td>
                            <td className='item-w150'>{item?.coin?.name}</td>
                            <td className='vip item-w150'>{item?.amount}</td>
                            <td className='confirm item-w150'>
                                ~{' '}
                                {numberUtils
                                    .coinUSD(item?.amount * item?.coin?.price)
                                    .replace('USD', '')}
                            </td>
                            <td className='item-w100'>
                                {moment(item?.createdAt).format(
                                    'DD/MM/YYYY HH:mm:ss'
                                )}
                            </td>
                            <td>
                                <Link
                                    to={`${routers.sellCoinUser}/${item?.coin?.symbol}`}
                                    className={`${cx(
                                        'actions-item'
                                    )} cancelbgc`}
                                >
                                    Sell
                                </Link>
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
                className={cx('setting-coin')}
                valueSearch={settingCoin}
                nameSearch='settingCoin'
                dataFlag={dataSettingFlag}
                dataHeaders={DataMyCoinsUser().headers}
                totalData={data?.total}
                classNameButton='completebgc'
                isRefreshPage
            >
                <RenderBodyTable data={dataSettingFlag} />
            </General>
        </>
    );
}