import { useAppDispatch, useAppSelector } from '@/hooks/useAppHooks';
import { useModal } from '@/hooks/useModal';
import { usePostOrderMutation } from '@/services/order/orderApi';
import {
  addIngredient,
  cleanOrder,
  deleteIngredient,
} from '@/services/order/orderSlice';
import { Button, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useState, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { useNavigate } from 'react-router-dom';

import { Modal } from '../modal/modal';
import { PriceIngredient } from '../price-ingredient/price-ingredient';
import { OrderDetails } from './order-details/order-details';
import { OrderIngredient } from './order-ingredient/order-ingredient';

import type { Order, TIngredient } from '@/utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const isAuth = useAppSelector((state) => state.user.isAuthenticated);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isModalOpen, openModal, closeModal } = useModal();
  const [postOrder, { isLoading }] = usePostOrderMutation();
  const [orderDetails, setOrderDetails] = useState<Order>();

  const { ingredients, buns } = useAppSelector((state) => state.order);

  const [{ typeDrag }, dropRef] = useDrop<TIngredient, void, { typeDrag?: string }>({
    accept: 'INGREDIENT',
    drop: (item): void => {
      dispatch(addIngredient(item));
    },
    collect: (monitor) => {
      const dragItem = monitor.getItem();
      const typeDrag = dragItem?.type;

      return { typeDrag };
    },
  });

  const summary = useMemo(() => {
    if (ingredients.length === 0) {
      return 0;
    }
    let sum = ingredients.reduce((acc, ingredient) => {
      const price = Number(ingredient.price);
      return acc + price;
    }, 0);
    if (buns) {
      sum += buns.price * 2;
    }

    return sum;
  }, [ingredients, buns]);

  const handleSubmitOrder = (): void => {
    if (isAuth) {
      if (!buns || ingredients.length === 0) {
        return;
      }

      openModal();

      orderBurger().catch((err) => {
        console.error('Ошибка при оформлении заказа:', err);
        closeModal();
      });
    } else {
      void navigate('/login');
    }
  };

  const orderBurger = async (): Promise<void> => {
    if (ingredients.length > 0 && buns) {
      const ingredientsIds = ingredients.map((i) => i._id);
      const bunId = buns?._id;
      const payload = [bunId, ...ingredientsIds, bunId];
      const result = await postOrder({ ingredients: payload }).unwrap();
      setOrderDetails(result as Order);
      dispatch(cleanOrder());
    }
  };

  return (
    <section className={styles.burger_constructor}>
      <div
        ref={dropRef as unknown as React.Ref<HTMLDivElement>}
        className={styles.burger}
      >
        {buns ? (
          <OrderIngredient isBuns item={buns} type="top" />
        ) : (
          <OrderIngredient
            type="top"
            isPlaceholder
            placeholder="Выберите булку"
            hasBorder={typeDrag ? typeDrag === 'bun' : undefined}
          />
        )}
        <div className={`${styles.ingredients} p-1`}>
          {ingredients.length > 0 ? (
            <>
              {ingredients.map((item) => (
                <OrderIngredient
                  item={item}
                  onDelete={() => dispatch(deleteIngredient(item.nanoid))}
                  key={item.nanoid}
                />
              ))}
            </>
          ) : (
            <OrderIngredient
              isPlaceholder
              placeholder="Выберите начинку"
              hasBorder={typeDrag ? typeDrag !== 'bun' : undefined}
            />
          )}
        </div>
        {buns ? (
          <OrderIngredient isBuns item={buns} type="bottom" />
        ) : (
          <OrderIngredient
            type="bottom"
            isPlaceholder
            placeholder="Выберите булку"
            isBuns
            hasBorder={typeDrag ? typeDrag === 'bun' : undefined}
          />
        )}
      </div>
      <div className={`${styles.create_order} mt-10`}>
        <PriceIngredient price={summary} />
        <Button htmlType="submit" onClick={handleSubmitOrder}>
          Оформить заказ
        </Button>
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          {isLoading ? (
            <Preloader />
          ) : (
            <>
              {orderDetails ? (
                <OrderDetails details={orderDetails} />
              ) : (
                <p>Ошибка оформления заказа</p>
              )}
            </>
          )}
        </Modal>
      )}
    </section>
  );
};
