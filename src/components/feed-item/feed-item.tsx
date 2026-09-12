import { useAppDispatch } from '@/hooks/useAppHooks';
import { useGetIngredientsQuery } from '@/services/ingredients/ingredientsApi';
import { openDetailsOrder } from '@/services/order/orderSlice';
import {
  FormattedDate,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import type { OrderIngredient } from '@/utils/types';

import styles from './feed-item.module.css';

type FeedItemProps = {
  order: OrderIngredient;
};

const statusText = {
  created: 'Создан',
  pending: 'В работе',
  done: 'Выполнен',
};

export const FeedItem = ({ order }: FeedItemProps): React.JSX.Element => {
  const { data: ingredients } = useGetIngredientsQuery();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const totalPrice = useMemo(() => {
    return order.ingredients.reduce((sum, id) => {
      const ingredient = ingredients?.find((i) => i._id === id);
      return sum + (ingredient?.price ?? 0);
    }, 0);
  }, [ingredients]);

  const handleOpenDetails = useCallback(() => {
    dispatch(openDetailsOrder(order));
  }, [dispatch]);

  return (
    <Link
      to={location.pathname + '/' + order._id}
      state={{ backgroundLocation: location }}
      onClick={handleOpenDetails}
      className={styles.order}
    >
      <div className={styles.feed_header}>
        <p className="text text_type_digits-default">#{order.number}</p>
        <p className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </p>
      </div>
      <div className=" mt-5 mb-5">
        <p className="text text_type_main-default mb-2">{order.name}</p>
        <p className={`${styles.feed_status} text text_type_main-small`}>
          {statusText[order.status as keyof typeof statusText]}
        </p>
      </div>

      <div className={styles.order_ingredients}>
        <div className={styles.list_ingredients}>
          {order.ingredients.map((item, index) => {
            const ingredient = ingredients?.find((i) => i._id === item);
            return (
              <img
                key={index}
                className={styles.img_ingredient}
                src={ingredient?.image}
                style={{ transform: `translate(${index * 50}px` }}
              />
            );
          })}
        </div>
        <div className={styles.order_price}>
          <CurrencyIcon type="primary" />
          <p className="text text_type_digits-default">{totalPrice}</p>
        </div>
      </div>
    </Link>
  );
};
