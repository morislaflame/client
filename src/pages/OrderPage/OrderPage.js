import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { Context } from '../../index';
import { message } from 'antd';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import OrderTags from '../../components/UI/OrderTags/OrderTags';
import FormatDate from '../../components/UI/FormatDate/FormatDate';
import SellerInfo from '../../components/OrderComponents/SellerInfo';
import OrderModel from '../../components/OrderComponents/OrderModel';
import OrderPromoCode from '../../components/OrderComponents/OrderPromoCode';
import InvoiceIframe from '../../components/OrderComponents/InvoiceIframe';
import InvoiceList from '../../components/OrderComponents/InvoiceList';
import LoadingIndicator from '../../components/UI/LoadingIndicator/LoadingIndicator';
import OrderTotal from '../../components/OrderComponents/OrderTotal';

const OrderPage = observer(() => {
  const { order } = useContext(Context);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    LoadOrder();
  }, [id]);

  const LoadOrder = async () => {
    try {
      await order.getOrderById(id);
    } catch (error) {
      message.error('Error loading order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
        const invoice = await order.createInvoice(id);
        if (invoice?.link) {
            order.setCurrentInvoice(invoice);
            order.setIsInvoiceVisible(true);
        }
    } catch (error) {
        message.error('Error creating payment');
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  const currentOrder = order.currentOrder;

  return (
    <div className="container">
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <TopicBack title={`Order #${currentOrder.id}`} />
        <div style={{display: 'flex', alignItems: 'center', gap: 'var(--main-gap)'}}>
          <OrderTags status={currentOrder.status} />
          <FormatDate date={currentOrder.createdAt} />
        </div>
      </div>
      <div className="container-item">
        <SellerInfo seller={currentOrder.seller} />
        {currentOrder.modelProduct && (
          <OrderModel modelProduct={currentOrder.modelProduct} />
        )}
        <OrderPromoCode orderId={currentOrder.id} />
        <OrderTotal 
          totalPriceUSD={currentOrder.totalPriceUSD}
          onPayment={handlePayment}
          isLoadingInvoice={order.isLoadingInvoice}
        />
        <InvoiceList orderId={currentOrder.id} />
      </div>
      <InvoiceIframe
        isVisible={order.isInvoiceVisible}
        onClose={() => order.setIsInvoiceVisible(false)}
        invoiceUrl={order.currentInvoice?.link}
      />
    </div>
  );
});

export default OrderPage;
