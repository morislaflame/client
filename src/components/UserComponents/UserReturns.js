// components/UserReturns.js
import React, { useContext, useEffect, useState, useMemo } from 'react';
import Slider from 'react-slick';
import styles from './UserComponents.module.css';
import { FcCancel, FcClock, FcOk } from 'react-icons/fc';
import { GiHighHeel } from 'react-icons/gi';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { AutoComplete } from 'antd';

const UserReturns = observer(({ sliderSettings, isAdminView = false }) => {
  const { return: returnStore } = useContext(Context); // Access ReturnStore from context
  const [returnSearch, setReturnSearch] = useState('');

  // Load user returns when component mounts
  useEffect(() => {
    returnStore.loadUserReturns();
  }, [returnStore]);

  const returnOptions = useMemo(
    () =>
      returnStore.returns.map((ret) => ({
        value: ret.id.toString(),
      })),
    [returnStore.returns]
  );

  const filteredReturns = useMemo(() => {
    return returnSearch
      ? returnStore.returns.filter((ret) => ret.id.toString().includes(returnSearch.trim()))
      : returnStore.returns;
  }, [returnSearch, returnStore.returns]);

  const hasReturns = returnStore.returns && returnStore.returns.length > 0;

  if (returnStore.loading) {
    return <p>Loading returns...</p>;
  }

  if (!hasReturns) {
    return <p>You have no returns.</p>;
  }

  return (
    <>
      {hasReturns && (
        <div className={styles.returns}>
          <div className={styles.order_top}>
            <h5>Returns</h5>
            <AutoComplete
              options={returnOptions}
              onSelect={(value) => setReturnSearch(value)}
              onSearch={(value) => setReturnSearch(value)}
              placeholder="Search Return"
              allowClear
              className={styles.search}
            />
          </div>
          {filteredReturns && filteredReturns.length > 0 ? (
            <Slider {...sliderSettings} className={styles.slider}>
              {filteredReturns.map((returnItem) => (
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
                          <div className={styles.approved}>
                            <FcClock style={{ color: 'black' }} />
                            <p>The refund request is being reviewed</p>
                          </div>
                        )}
                        {returnItem.status === 'approved' && (
                          <div className={styles.approved}>
                            <FcOk />
                            <p>Refund confirmed</p>
                          </div>
                        )}
                        {returnItem.status === 'rejected' && (
                          <div className={styles.approved}>
                            <FcCancel />
                            <p>Refund denied</p>
                          </div>
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
