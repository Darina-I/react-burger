import { ListOrderIngredients } from '@/components/list-order-ingredients/list-order-ingredients';
import { useGetIngredientsQuery } from '@/services/ingredients/ingredientsApi';
import { useGetAllOrdersQuery, useGetUserOrdersQuery } from '@/services/order/orderApi';
import {
  CurrencyIcon,
  Preloader,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import styles from './feed-order-details.module.css';

export const FeedOrderDetails = (): React.JSX.Element => {
  const { data: allOrders } = useGetAllOrdersQuery();
  const { data: ingredients } = useGetIngredientsQuery();
  const { data: userOrders } = useGetUserOrdersQuery();
  const { id } = useParams();
  const location = useLocation();

  const isProfilePage = location.pathname.startsWith('/profile');
  let currentOrder;
  if (isProfilePage) {
    currentOrder = userOrders?.orders.find((i) => i._id === id);
  } else {
    currentOrder = allOrders?.orders.find((i) => i._id === id);
  }

  const { orderIngredients, totalPrice } = useMemo(() => {
    if (!currentOrder || !ingredients) {
      return { orderIngredients: [], totalPrice: 0 };
    }

    const counts = new Map<string, number>();
    for (const id of currentOrder.ingredients) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }

    const orderIngredients = Array.from(counts.entries()).map(([id, count]) => {
      const ingredient = ingredients?.find((i) => i._id === id) ?? null;
      return { ingredient, count };
    });

    const totalPrice = orderIngredients.reduce((sum, { ingredient, count }) => {
      if (!ingredient) return sum;
      return sum + ingredient.price * count;
    }, 0);

    return { orderIngredients, totalPrice };
  }, [ingredients, currentOrder]);

  if (!currentOrder) {
    return <Preloader />;
  }

  return (
    <>
      <p className="text text_type_digits-medium">#{currentOrder.number}</p>
      <div className="mt-10 mb-10">
        <p className="text text_type_main-medium">{currentOrder.name}</p>
        <p className="text text_type_main-small" style={{ color: '#00cccc' }}>
          {currentOrder.status === 'done' ? 'Выполнен' : 'В работе'}
        </p>
      </div>
      <div>
        <p className="text text_type_main-medium">Состав:</p>
        <ListOrderIngredients list={orderIngredients} />
      </div>
      <div className={styles.itog_info}>
        <p className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(currentOrder.createdAt)} />
        </p>
        <div className={`${styles.total_price} text text_type_main-default`}>
          <CurrencyIcon type="primary" />
          <p>{totalPrice}</p>
        </div>
      </div>
    </>
  );
};
