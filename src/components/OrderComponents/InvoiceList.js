// client/src/components/OrderComponents/InvoiceList.js
import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import InvoiceItem from './InvoiceItem';
import OrdersSkeletons from '../UI/Skeletons/OrdersSkeletons';
import Search from '../FuctionalComponents/Search/Search';

const InvoiceList = observer(({ orderId }) => {
    const { order } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [filteredInvoices, setFilteredInvoices] = useState([]);

    useEffect(() => {
        const loadInvoices = async () => {
            setLoading(true);
            try {
                await order.getOrderInvoices(orderId);
                setFilteredInvoices(order.orderInvoices);
            } catch (error) {
                console.error('Error loading invoices:', error);
            } finally {
                setLoading(false);
            }
        };
        loadInvoices();
    }, [orderId]);

    if (!loading && (!order.orderInvoices || order.orderInvoices.length === 0)) {
        return null;
    }

    const formatInvoiceOption = (invoice) => ({
        value: invoice.id.toString(),
        label: (
            <div className="search_options">
                <span className="search_options_label">Invoice #: {invoice.id}</span>
                <span className="search_options_label">Status: {invoice.status}</span>
                <span className="search_options_label">Amount: ${invoice.amountUSD}</span>
            </div>
        )
    });

    return (
        <div className="container-item">
            <h3>Payment History</h3>
            <Search 
                data={order.orderInvoices}
                setFilteredData={setFilteredInvoices}
                searchFields={['id', 'status']}
                placeholder="Search by invoice ID or status"
                formatOption={formatInvoiceOption}
            />
            <div className="container-item">
                {loading ? (
                    <OrdersSkeletons count={3} />
                ) : (
                    filteredInvoices.length > 0 ? (
                        filteredInvoices.map((invoice) => 
                            <InvoiceItem 
                                key={invoice.id} 
                                invoice={invoice} 
                            />
                        )
                    ) : (
                        <span className="no-info-container">No invoices found</span>
                    )
                )}
            </div>
        </div>
    );
});

export default InvoiceList;