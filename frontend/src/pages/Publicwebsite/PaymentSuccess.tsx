import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import OrderDetailsView from '../../components/Publicwebsite/Order/OrderDetailsView';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const orderIdFromUrl = searchParams.get('order');
    if (orderIdFromUrl) {
      setOrderId(orderIdFromUrl);
    }
  }, [searchParams]);

  return (
    <Layout>
      {orderId ? (
        <OrderDetailsView orderId={orderId} isPaymentSuccess={true} />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading payment details...</p>
        </div>
      )}
    </Layout>
  );
};

export default PaymentSuccess;
