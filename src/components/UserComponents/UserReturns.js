// components/UserReturns.js
import React from 'react';
import Slider from 'react-slick';
import styles from './UserComponents.module.css';
import { FcCancel, FcClock, FcOk } from 'react-icons/fc';
import { GiHighHeel } from 'react-icons/gi';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { Context } from '../../index';
import { AutoComplete } from 'antd';
import { useMemo } from 'react';

const UserReturns = observer(({ returns, sliderSettings, isAdminView = false }) => {
    const [returnSearch, setReturnSearch] = useState('');
    const { user } = useContext(Context);
    const navigate = useNavigate();


    const returnOptions = useMemo(() => user.userInfo.returns.map(ret => ({
        value: ret.id.toString(),
    })), [user.userInfo.returns]);


    const filteredReturns = useMemo(() => {
        return returnSearch
        ? user.userInfo.returns.filter(ret =>
            ret.id.toString().includes(returnSearch.trim())
          )
        : user.userInfo.returns;
    }, [returnSearch, user.userInfo.returns]);

    const hasReturns = user.userInfo.returns && user.userInfo.returns.length > 0;



  if (!returns || returns.length === 0) {
    return <p>Нет доступных возвратов.</p>;
  }

  return (
    <>
    {hasReturns && (
        <div className={styles.returns}>
            <div className={styles.order_top}>
                <h5>Returns</h5>
                <AutoComplete
                    options={returnOptions}
                    onSelect={value => setReturnSearch(value)}
                    onSearch={value => setReturnSearch(value)}
                    placeholder="Search Return"
                    allowClear
                    variant="filled"
                    className={styles.search}
                />
            </div>
            {filteredReturns && filteredReturns.length > 0 ? (
                <Slider {...sliderSettings} className={styles.slider}>
                    {filteredReturns.map(returnItem => (
                        <div className={styles.order_list} key={returnItem.id}>
                            <div className={styles.order_item}>
                                <div className={styles.order_status}>
                                    <span>Return №{returnItem.id}</span>
                                </div>
                                <div className={styles.return_details}>
                                    <div className={styles.ladies}>
                                        <div className={styles.name_price}>
                                            <div className={styles.name_heel}>
                                                <GiHighHeel />
                                                model: {returnItem.thing.name}
                                            </div>
                                            <span>${returnItem.thing.price}</span>
                                        </div>
                                        <div className={styles.other_info}>
                                            <div className={styles.promocode_status}>
                                                <span>Currency:</span> <strong>{returnItem.cryptoCurrency}</strong>
                                            </div>
                                            <div className={styles.promocode_status}>
                                                <span>Amount:</span> <strong>{returnItem.refundAmount}</strong>
                                            </div>
                                            <div className={styles.promocode_status}>
                                                <span>Hash:</span> <strong>{returnItem.cryptoTransactionHash}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.mini_status_return}>
                                        {returnItem.status === 'pending' && (
                                            <div className={styles.approved}><FcClock style={{ color: 'black' }} /><p>The refund request is being reviewed</p></div>
                                        )}
                                        {returnItem.status === 'approved' && (
                                            <div className={styles.approved}><FcOk /><p>Refund confirmed</p></div>
                                        )}
                                        {returnItem.status === 'rejected' && (
                                            <div className={styles.approved}><FcCancel /><p>Refund denied</p></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            ) : (
                <p>You have no returns with the specified ID</p>
            )}
        </div>
        )}
    </>
  );
});

export default UserReturns;
