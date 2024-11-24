// components/UserExchanges.js
import React, { useContext, useEffect, useState, useMemo } from 'react';
import Slider from 'react-slick';
import styles from './UserComponents.module.css';
import { FcCancel, FcClock, FcOk } from 'react-icons/fc';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { AutoComplete } from 'antd';
import CopyableButton from '../UI/CopyableButton/CopyableButton';
import LoadingIndicator from '../UI/LoadingIndicator/LoadingIndicator';

const UserExchanges = observer(({ exchanges, sliderSettings }) => {
  const { exchange } = useContext(Context); // Access ExchangeStore from context
  const [exchangeSearch, setExchangeSearch] = useState('');

  const userExchanges = exchanges || exchange.exchangeRequests 
  // Load user exchange requests when component mounts
  useEffect(() => {
    if (!exchanges) {
      exchange.loadUserExchangeRequests();
    }
  }, [exchange, exchanges]);

  const exchangeOptions = useMemo(
    () =>
      userExchanges.map((exchangeItem) => ({
        value: exchangeItem.id.toString(),
      })),
    [userExchanges]
  );

  const filteredExchanges = useMemo(() => {
    return exchangeSearch
      ? userExchanges.filter((exchangeItem) =>
          exchangeItem.id.toString().includes(exchangeSearch.trim())
        )
      : userExchanges;
  }, [exchangeSearch, userExchanges]);

  const hasExchanges = userExchanges && userExchanges.length > 0;

  if (exchange.loading && !exchanges) {
    return <div><LoadingIndicator/></div>;
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
                            Swapped:
                          </div>{' '}
                          <b>{exchangeItem.OldThing.name} - ${exchangeItem.OldThing.price}</b>
                        </div>
                        <div className={styles.old_new_names}>
                          <div>
                            For:
                          </div>{' '}
                          <b>{exchangeItem.NewThing.name} - ${exchangeItem.NewThing.price}</b>
                        </div>
                        <div className={styles.other_info}>
                          <div className={styles.promocode_status}>
                            <span>Currency:</span> <strong>{exchangeItem.cryptoCurrency}</strong>
                          </div>
                          <div className={styles.promocode_status}>
                            <span>Amount:</span> <strong>{exchangeItem.cryptoPaymentAmount}</strong>
                          </div>
                        </div>
                        {exchangeItem.cryptoTransactionHash && (<div className={styles.hash}>
                            <span>Transaction Hash:</span> 
                            <CopyableButton 
                            value={exchangeItem.cryptoTransactionHash} 
                            className={styles.copyable_address}
                            title='Copy Hash'
                            />
                          </div>)}
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
