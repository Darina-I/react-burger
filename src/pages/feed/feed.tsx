import { FeedItem } from '@/components/feed-item/feed-item';
import { useGetAllOrdersQuery } from '@/services/order/orderApi';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import styles from './feed.module.css';

export const FeedPage = (): React.JSX.Element => {
  const { data, isLoading } = useGetAllOrdersQuery();

  const { isDone, isCook } = useMemo(() => {
    const isDone: number[] = [];
    const isCook: number[] = [];

    data?.orders?.forEach((item) => {
      if (item.status === 'done' && isDone.length < 20) {
        isDone.push(item.number);
      } else if (item.status === 'pending' && isCook.length < 20) {
        isCook.push(item.number);
      }
    });

    return { isDone, isCook };
  }, [data]);

  if (isLoading) return <Preloader />;

  return (
    <div className={styles.feed_main}>
      <section className={styles.feed_list}>
        {data?.orders.map((order) => (
          <FeedItem order={order} key={order._id} />
        ))}
      </section>
      <section className={styles.feed_info}>
        <div className={styles.orders_list + ' text text_type_digits-default'}>
          <div>
            <p className="text text_type_main-default">Готовы:</p>
            <ul>
              {isDone.map((i) => (
                <li key={i} style={{ color: '#00cccc' }}>
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text text_type_main-default">В работе:</p>
            <ul>
              {isCook.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-15 mb-5">
          <p className="text text_type_main-default">Выполнено за все время:</p>
          <p className="text text_type_digits-large">{data?.total}</p>
        </div>
        <div>
          <p className="text text_type_main-default">Выполнено за сегодня:</p>
          <p className="text text_type_digits-large">{data?.totalToday}</p>
        </div>
      </section>
    </div>
  );
};
