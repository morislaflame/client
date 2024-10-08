
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
import { useMemo, memo } from 'react';

const UserOrders = observer(({ orders, sliderSettings, isAdminView = false }) => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [orderSearch, setOrderSearch] = useState('');

    const orderOptions = useMemo(() => user.userInfo.orders.map(order => ({
        value: order.id.toString(),
    })), [user.userInfo.orders]);

    const filteredOrders = useMemo(() => {
        return orderSearch
            ? user.userInfo.orders.filter(order =>
                order.id.toString().includes(orderSearch.trim())
            )
            : user.userInfo.orders;
    }, [orderSearch, user.userInfo.orders]);

    if (!orders || orders.length === 0) {
        return <p>Нет доступных заказов.</p>;
    }

  return (
    <div className={styles.orders}>
      
                <div className={styles.order_top}>
                    <h5>Orders</h5>
                    <AutoComplete
                        options={orderOptions}
                        onSelect={value => setOrderSearch(value)}
                        onSearch={value => setOrderSearch(value)}
                        placeholder="Search Order"
                        allowClear
                        variant="filled"
                        className={styles.search}
                    />
                </div>
                
                {filteredOrders && filteredOrders.length > 0 ? (
                    <Slider {...sliderSettings} className={styles.slider}>
                        {filteredOrders.map(order => (
                            <div className={styles.order_list} key={order.id}>
                                <div className={styles.order_item}>
                                    <div className={styles.order_status}>
                                        <span>Order №{order.id}</span>
                                    </div>
                                    <div className={styles.order_details}>
                                        <div className={styles.ladies}>
                                            {order.order_things.map(item => (
                                                <div className={styles.name_price} key={item.id}>
                                                    <div className={styles.name_heel}>
                                                        <GiHighHeel />
                                                        model: <b>{item.thing.name}</b>
                                                    </div>
                                                    <span>${item.thing.price}</span>
                                                </div>
                                            ))}
                                            <div className={styles.other_info}>
                                                {order.promo_code !== null && (
                                                    <div className={styles.promocode_status}>
                                                        <span>Promocode:</span> <strong>{order.promo_code.code} ${order.promo_code.discountValue}</strong>
                                                    </div>
                                                )}
                                                <div className={styles.promocode_status}>
                                                    <span>Currency:</span> <strong>{order.cryptoCurrency}</strong>
                                                </div>
                                                <div className={styles.promocode_status}>
                                                    <span>Amount:</span> <strong>{order.cryptoPaymentAmount}</strong>
                                                </div>
                                                <div className={styles.promocode_status}>
                                                    <span>Hash:</span> <strong>{order.cryptoTransactionHash}</strong>
                                                </div>
                                                
                                            </div>
                                            <div className={styles.total_price}>Total: ${order.totalPrice} </div>
                                        </div>
                                        
                                        <div className={styles.mini_status}>

                                            {order.status === 'created' && (
                                                <div className={styles.approved}><FcClock style={{ color: 'black' }} /><p>Your order is pending confirmation</p></div>
                                            )}
                                            {order.status === 'paid' && (
                                                <div className={styles.approved}><FcOk /><span>Successfully paid</span></div>
                                            )}
                                            {order.status === 'rejected' && (
                                                <div className={styles.approved}><FcCancel /><p>The order was rejected</p></div>
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
