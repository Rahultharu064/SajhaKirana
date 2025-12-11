import { useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import OrderDetailsView from '../../components/Publicwebsite/Order/OrderDetailsView';

const OrderConfirmation = () => {
    const { id } = useParams();

    return (
        <Layout>
            <OrderDetailsView orderId={id || ''} />
        </Layout>
    );
};

export default OrderConfirmation;
