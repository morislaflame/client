import React from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import styles from './SellerInfoComponents.module.css';
import OrderTags from '../../../components/UI/OrderTags/OrderTags';
import FormatDate from '../../../components/UI/FormatDate/FormatDate';


const SellerOrdersInfo = observer(() => {
    const { seller } = useContext(Context);
    const orders = seller.sellerInfo?.sellerOrders || [];

    return (
        <div className={styles.orders_container}>
            <h3>Orders History</h3>
            {orders.length > 0 ? (
                <div className={styles.orders_list}>
                    {orders.map((order) => (
                        <div key={order.id} className={styles.order_card}>
                            <div className={styles.order_header}>
                                <div className={styles.order_id}>
                                    Order #{order.id}
                                </div>
                                <OrderTags status={order.status} />
                            </div>

                            <div className={styles.order_details}>
                                <div className={styles.order_info}>
                                    <p>
                                        <strong>Model:</strong> {order.modelProduct?.name}
                                    </p>
                                    <p>
                                        <strong>Price:</strong> ${order.totalPriceUSD}
                                    </p>
                                    <p>
                                        <strong>Created:</strong> <FormatDate date={order.createdAt} />
                                    </p>
                                    {order.payedAt && (
                                        <p>
                                            <strong>Paid:</strong> <FormatDate date={order.payedAt} />
                                        </p>
                                    )}
                                    {order.completedAt && (
                                        <p>
                                            <strong>Completed:</strong> <FormatDate date={order.completedAt} />
                                        </p>
                                    )}
                                    {order.closedAt && (
                                        <p>
                                            <strong>Closed:</strong> <FormatDate date={order.closedAt} />
                                        </p>
                                    )}
                                </div>

                                {order.returns && order.returns.length > 0 && (
                                    <div className={styles.returns_info}>
                                        <h4>Returns:</h4>
                                        {order.returns.map(returnItem => (
                                            <div key={returnItem.id} className={styles.return_item}>
                                                <OrderTags status={returnItem.status} />
                                                <p>
                                                    <strong>Reason:</strong> {returnItem.reason}
                                                </p>
                                                <p>
                                                    <strong>Refund Amount:</strong> ${returnItem.refundAmountUSD}
                                                </p>
                                                <p>
                                                    <strong>Created:</strong> <FormatDate date={returnItem.createdAt} />
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.no_orders}>No orders found</div>
            )}
        </div>
    );
});

export default SellerOrdersInfo;
