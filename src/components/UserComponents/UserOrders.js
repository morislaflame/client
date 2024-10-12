// components/UserOrders.js
import React, { useContext, useEffect, useState, useMemo } from 'react';
import Slider from 'react-slick';
import styles from './UserComponents.module.css';
import { FcCancel, FcClock, FcOk } from 'react-icons/fc';
import { GiHighHeel } from 'react-icons/gi';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { AutoComplete } from 'antd';
import CopyableButton from '../CopyableButton/CopyableButton';

const UserOrders = observer(({ orders, sliderSettings }) => {
  const { order } = useContext(Context); // Access OrderStore from context
  const [orderSearch, setOrderSearch] = useState('');

  const userOrders = orders || order.orders

  // Load user orders when component mounts
  useEffect(() => {
    if (!orders) {
    order.loadUserOrders();
    }
  }, [order, orders]);

  const orderOptions = useMemo(
    () =>
      userOrders.map((orderItem) => ({
        value: orderItem.id.toString(),
      })),
    [userOrders]
  );

  const filteredOrders = useMemo(() => {
    return orderSearch
      ? userOrders.filter((orderItem) => orderItem.id.toString().includes(orderSearch.trim()))
      : userOrders;
  }, [orderSearch, userOrders]);

  if (order.loading && !orders) {
    return <p>Loading orders...</p>;
  }

  if (!userOrders || userOrders.length === 0) {
    return <p>You have no orders.</p>;
  }

  return (
    <div className={styles.orders}>
      <div className={styles.order_top}>
        <h5>Orders</h5>
        <AutoComplete
          options={orderOptions}
          onSelect={(value) => setOrderSearch(value)}
          onSearch={(value) => setOrderSearch(value)}
          placeholder="Search Order"
          allowClear
          className={styles.search}
        />
      </div>

      {filteredOrders && filteredOrders.length > 0 ? (
        <Slider {...sliderSettings} className={styles.slider}>
          {filteredOrders.map((orderItem) => (
            <div className={styles.order_list} key={orderItem.id}>
              <div className={styles.order_item}>
                <div className={styles.order_status}>
                  <span>Order №{orderItem.id}</span>
                </div>
                <div className={styles.order_details}>
                  <div className={styles.ladies}>
                    {orderItem.order_things.map((item) => (
                      <div className={styles.name_price} key={item.id}>
                        <div className={styles.name_heel}>
                          <GiHighHeel />
                          model: <b>{item.thing.name}</b>
                        </div>
                        <span>${item.thing.price}</span>
                      </div>
                    ))}
                    <div className={styles.other_info}>
                      {orderItem.promo_code !== null && (
                        <div className={styles.promocode_status}>
                          <span>Promocode:</span>{' '}
                          <b>
                            {orderItem.promo_code.code} ${orderItem.promo_code.discountValue}
                          </b>
                        </div>
                      )}
                      <div className={styles.promocode_status}>
                        <span>Currency:</span> <b>{orderItem.cryptoCurrency}</b>
                      </div>
                      <div className={styles.promocode_status}>
                        <span>Amount:</span> <b>{orderItem.cryptoPaymentAmount}</b>
                      </div>
                    </div>
                    <div className={styles.hash}>
                            <span>Transaction Hash:</span> 
                            <CopyableButton 
                            value={orderItem.cryptoTransactionHash} 
                            className={styles.copyable_address}
                            title='Copy Hash'
                            />
                          </div>
                    <div className={styles.total_price}>Total: ${orderItem.totalPrice} </div>
                  </div>

                  <div className={styles.mini_status}>
                    {orderItem.status === 'created' && (
                      <div className={styles.approved}>
                        <FcClock style={{ color: 'black' }} />
                        <p>Your order is pending confirmation</p>
                      </div>
                    )}
                    {orderItem.status === 'paid' && (
                      <div className={styles.approved}>
                        <FcOk />
                        <span>Successfully paid</span>
                      </div>
                    )}
                    {orderItem.status === 'rejected' && (
                      <div className={styles.approved}>
                        <FcCancel />
                        <p>The order was rejected</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p>You have no orders with the specified ID.</p>
      )}
    </div>
  );
});

export default UserOrders;
