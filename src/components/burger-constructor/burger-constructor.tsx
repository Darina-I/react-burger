import { usePostOrderMutation } from '@/api/ingredientsApi';
import { useModal } from '@/hooks/useModal';
import { addIngredient, deleteIngredient } from '@/store/burgerSlice';
import { Button, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useState, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { Modal } from '../modal/modal';
import { PriceIngredient } from '../price-ingredient/price-ingredient';
import { OrderDetails } from './order-details/order-details';
import { OrderIngredient } from './order-ingredient/order-ingredient';

import type { RootState } from '@/store/store';
import type { Order, BurgerItem } from '@/utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { isModalOpen, openModal, closeModal } = useModal();
  const [postOrder, { isLoading }] = usePostOrderMutation();
  const [orderDetails, setOrderDetails] = useState<Order>();

  const burger = useSelector((state: RootState) => state.burger);

  const [, dropRef] = useDrop({
    accept: 'INGREDIENT',
    drop: (item): void => {
      dispatch(addIngredient(item as BurgerItem));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const summary = useMemo(() => {
    if (burger.ingredients.length === 0) {
      return 0;
    }
    let sum = burger.ingredients.reduce((acc, ingredient) => {
      const price = Number(ingredient.price);
      return acc + price;
    }, 0);
    if (burger.buns) {
      sum += burger.buns.price * 2;
    }

    return sum;
  }, [burger]);

  const handleSubmitOrder = (): void => {
    if (!burger.buns || burger.ingredients.length === 0) {
      alert('Соберите бургер: нужны булка и хотя бы один ингредиент');
      return;
    }

    openModal();

    orderBurger().catch((err) => {
      console.error('Ошибка при оформлении заказа:', err);
      closeModal();
    });
  };

  const orderBurger = async (): Promise<void> => {
    if (burger.ingredients.length > 0 && burger.buns) {
      const ingredientsIds = burger.ingredients.map((i) => i._id);
      const bunId = burger.buns?._id;
      const payload = [bunId, ...ingredientsIds, bunId];
      const result = await postOrder({ ingredients: payload }).unwrap();
      setOrderDetails(result as Order);
    }
  };

  return (
    <section className={styles.burger_constructor}>
      <div
        ref={dropRef as unknown as React.Ref<HTMLDivElement>}
        className={styles.burger}
      >
        {burger.buns ? (
          <OrderIngredient isBuns item={burger.buns} type="top" />
        ) : (
          <OrderIngredient type="top" isPlaceholder placeholder="Выберите булку" />
        )}
        <div className={`${styles.ingredients} p-1`}>
          {burger.ingredients.length > 0 ? (
            <>
              {burger.ingredients.map((item, index) => (
                <OrderIngredient
                  index={index}
                  item={item}
                  onDelete={() => dispatch(deleteIngredient(item.nanoid))}
                  key={item.nanoid}
                />
              ))}
            </>
          ) : (
            <OrderIngredient isPlaceholder placeholder="Выберите начинку" />
          )}
        </div>
        {burger.buns ? (
          <OrderIngredient isBuns item={burger.buns} type="bottom" />
        ) : (
          <OrderIngredient type="bottom" isPlaceholder placeholder="Выберите булку" />
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
