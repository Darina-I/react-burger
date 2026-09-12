import { useGetUserOrdersQuery } from '@/services/order/orderApi';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { FeedItem } from '../feed-item/feed-item';

import styles from './list-orders-user.module.css';

export const ListOrdersUser = (): React.JSX.Element => {
  const { data, isLoading } = useGetUserOrdersQuery();

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles.feed_list}>
      {data?.orders.map((order) => (
        <FeedItem key={order._id} order={order} />
      ))}
    </div>
  );
};
