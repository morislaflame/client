// components/UserExchanges.js
import React from 'react';
import Slider from 'react-slick';
import styles from './UserComponents.module.css';
import { FcCancel, FcClock, FcOk } from 'react-icons/fc';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { Context } from '../../index';
import { AutoComplete } from 'antd';

const UserExchanges = observer(({ exchanges, sliderSettings, isAdminView = false }) => {
    const [exchangeSearch, setExchangeSearch] = useState('');
    const { user } = useContext(Context);
    const navigate = useNavigate();

    const exchangeOptions = user.userInfo.exchangeRequests.map(exchange => ({
        value: exchange.id.toString(),
    }));

    const filteredExchanges = exchangeSearch
        ? user.userInfo.exchangeRequests.filter(exchange =>
            exchange.id.toString().includes(exchangeSearch.trim())
          )
        : user.userInfo.exchangeRequests;

    const hasExchanges = user.userInfo.exchangeRequests && user.userInfo.exchangeRequests.length > 0;

  return (
    <>
    {hasExchanges && (
        <div className={styles.exchanges}>
            <div className={styles.order_top}>
                <h5>Exchanges</h5>
                <AutoComplete
                    options={exchangeOptions}
                    onSelect={value => setExchangeSearch(value)}
                    onSearch={value => setExchangeSearch(value)}
                    placeholder="Search Exchange"
                    allowClear
                    variant="filled"
                    className={styles.search}
                />
            </div>
            {filteredExchanges && filteredExchanges.length > 0 ? (
                <Slider {...sliderSettings} className={styles.slider}>
                    {filteredExchanges.map(exchange => (
                        <div className={styles.order_list} key={exchange.id}>
                            <div className={styles.exchange_item}>
                                <div className={styles.exchange_status}>
                                    <span>Exchange №{exchange.id}</span>
                                </div>
                                <div className={styles.exchange_details}>
                                    <div className={styles.old_new}>
                                        <div className={styles.old_new_names}>
                                            <div><strong>Swapped:</strong></div> {exchange.OldThing.name} - ${exchange.OldThing.price}
                                        </div>
                                        <div className={styles.old_new_names}>
                                            <div><strong>For:</strong></div> {exchange.NewThing.name} - ${exchange.NewThing.price}
                                        </div>
                                        <div className={styles.other_info}>
                                            <div className={styles.promocode_status}>
                                                <span>Currency:</span> <strong>{exchange.cryptoCurrency}</strong>
                                            </div>
                                            <div className={styles.promocode_status}>
                                                <span>Amount:</span> <strong>{exchange.cryptoPaymentAmount}</strong>
                                            </div>
                                            <div className={styles.promocode_status}>
                                                <span>Hash:</span> <strong>{exchange.cryptoTransactionHash}</strong>
                                            </div>
                                        </div>
                                        <div className={styles.total_price}>
                                            <strong>Price Difference:</strong> ${exchange.priceDifference}
                                        </div>
                                    </div>

                                    
                                    <div className={styles.mini_status}>

                                        {exchange.status === 'pending' && (
                                            <div className={styles.approved}><FcClock style={{ color: 'black' }} /><p>Your exchange request is being processed</p></div>
                                        )}
                                        {exchange.status === 'approved' && (
                                            <div className={styles.approved}><FcOk /><p>Exchange approved</p></div>
                                        )}
                                        {exchange.status === 'rejected' && (
                                            <div className={styles.approved}><FcCancel /><p>Exchange denied</p></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            ) : (
                <p>У вас нет запросов на обмен с указанным ID.</p>
            )}
        </div>
        )}
        </>
  );
});

export default UserExchanges;
