import {
  Button,
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';
import { PriceIngredient } from '../price-ingredient/price-ingredient';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type SelectBurger = {
  ingredients: TIngredient[];
  buns?: TIngredient;
};

type TBurgerConstructorProps = {
  selectBurger: SelectBurger;
  deleteIngredient: (index: number) => void;
};

export const BurgerConstructor = ({
  selectBurger,
  deleteIngredient,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [summary, setSummary] = useState<number>(0);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    if (selectBurger.ingredients.length === 0) {
      setSummary(0);
      return;
    }
    let sum = selectBurger.ingredients.reduce((acc, ingredient) => {
      const price = Number(ingredient.price);
      return acc + price;
    }, 0);
    if (selectBurger.buns) {
      sum += selectBurger.buns.price * 2;
    }

    setSummary(sum);
  }, [selectBurger]);

  return (
    <section className={styles.burger_constructor}>
      <div className={styles.burger}>
        {selectBurger.buns && (
          <IngredientBurger isBuns item={selectBurger.buns} type="top" />
        )}
        <div className={`${styles.ingredients}`}>
          {selectBurger.ingredients.map((item, index) => (
            <IngredientBurger
              item={item}
              onDelete={() => deleteIngredient(index)}
              key={item._id}
            />
          ))}
        </div>
        {selectBurger.buns && (
          <IngredientBurger isBuns item={selectBurger.buns} type="bottom" />
        )}
      </div>
      <div className={`${styles.create_order} mt-10`}>
        <PriceIngredient price={summary} />
        <Button htmlType="submit" onClick={() => setIsOpenModal(true)}>
          Оформить заказ
        </Button>
      </div>
      {isOpenModal && (
        <Modal onClose={() => setIsOpenModal(false)}>
          <OrderDetails />
        </Modal>
      )}
    </section>
  );
};

type IngredientBurgerProps = {
  isBuns?: boolean;
  item: TIngredient;
  onDelete?: () => void;
  type?: 'top' | 'bottom';
};

const IngredientBurger = ({
  isBuns = false,
  item,
  onDelete,
  type,
}: IngredientBurgerProps): React.JSX.Element => {
  return (
    <div className={styles.ingredient__one}>
      {!isBuns && <DragIcon type="primary" />}
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        type={type ?? undefined}
        isLocked={isBuns}
        handleClose={onDelete ?? undefined}
      />
    </div>
  );
};
