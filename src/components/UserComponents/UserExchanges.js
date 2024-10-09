// components/UserExchanges.js
import React, { useContext, useEffect, useState, useMemo } from 'react';
import Slider from 'react-slick';
import styles from './UserComponents.module.css';
import { FcCancel, FcClock, FcOk } from 'react-icons/fc';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { AutoComplete } from 'antd';

const UserExchanges = observer(({ sliderSettings, isAdminView = false }) => {
  const { exchange } = useContext(Context); // Access ExchangeStore from context
  const [exchangeSearch, setExchangeSearch] = useState('');

  // Load user exchange requests when component mounts
  useEffect(() => {
    exchange.loadUserExchangeRequests();
  }, [exchange]);

  const exchangeOptions = useMemo(
    () =>
      exchange.exchangeRequests.map((exchangeItem) => ({
        value: exchangeItem.id.toString(),
      })),
    [exchange.exchangeRequests]
  );

  const filteredExchanges = useMemo(() => {
    return exchangeSearch
      ? exchange.exchangeRequests.filter((exchangeItem) =>
          exchangeItem.id.toString().includes(exchangeSearch.trim())
        )
      : exchange.exchangeRequests;
  }, [exchangeSearch, exchange.exchangeRequests]);

  const hasExchanges = exchange.exchangeRequests && exchange.exchangeRequests.length > 0;

  if (exchange.loading) {
    return <p>Loading exchanges...</p>;
  }

  return (
    <>
      {hasExchanges && (
        <div className={styles.exchanges}>
          <div className={styles.order_top}>
            <h5>Exchanges</h5>
            <AutoComplete
              options={exchangeOptions}
              onSelect={(value) => setExchangeSearch(value)}
              onSearch={(value) => setExchangeSearch(value)}
              placeholder="Search Exchange"
              allowClear
              className={styles.search}
            />
          </div>
          {filteredExchanges && filteredExchanges.length > 0 ? (
            <Slider {...sliderSettings} className={styles.slider}>
              {filteredExchanges.map((exchangeItem) => (
                <div className={styles.order_list} key={exchangeItem.id}>
                  <div className={styles.exchange_item}>
                    <div className={styles.exchange_status}>
                      <span>Exchange №{exchangeItem.id}</span>
                    </div>
                    <div className={styles.exchange_details}>
                      <div className={styles.old_new}>
                        <div className={styles.old_new_names}>
                          <div>
                            <strong>Swapped:</strong>
                          </div>{' '}
                          {exchangeItem.OldThing.name} - ${exchangeItem.OldThing.price}
                        </div>
                        <div className={styles.old_new_names}>
                          <div>
                            <strong>For:</strong>
                          </div>{' '}
                          {exchangeItem.NewThing.name} - ${exchangeItem.NewThing.price}
                        </div>
                        <div className={styles.other_info}>
                          <div className={styles.promocode_status}>
                            <span>Currency:</span> <strong>{exchangeItem.cryptoCurrency}</strong>
                          </div>
                          <div className={styles.promocode_status}>
                            <span>Amount:</span> <strong>{exchangeItem.cryptoPaymentAmount}</strong>
                          </div>
                          <div className={styles.promocode_status}>
                            <span>Hash:</span> <strong>{exchangeItem.cryptoTransactionHash}</strong>
                          </div>
                        </div>
                        <div className={styles.total_price}>
                          <strong>Price Difference:</strong> ${exchangeItem.priceDifference}
                        </div>
                      </div>

                      <div className={styles.mini_status}>
                        {exchangeItem.status === 'pending' && (
                          <div className={styles.approved}>
                            <FcClock style={{ color: 'black' }} />
                            <p>Your exchange request is being processed</p>
                          </div>
                        )}
                        {exchangeItem.status === 'approved' && (
                          <div className={styles.approved}>
                            <FcOk />
                            <p>Exchange approved</p>
                          </div>
                        )}
                        {exchangeItem.status === 'rejected' && (
                          <div className={styles.approved}>
                            <FcCancel />
                            <p>Exchange denied</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p>You have no exchange requests with the specified ID</p>
          )}
        </div>
      )}
    </>
  );
});

export default UserExchanges;
