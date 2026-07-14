import { Button, Counter, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, useRef, useMemo, useCallback } from 'react';

import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';
import { PriceIngredient } from '../price-ingredient/price-ingredient';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  changeList: (newIngredient: TIngredient) => void;
  counts: Record<string, number>;
};

export const BurgerIngredients = ({
  ingredients,
  changeList,
  counts,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const bunRef = useRef<HTMLParagraphElement>(null);
  const sauceRef = useRef<HTMLParagraphElement>(null);
  const mainRef = useRef<HTMLParagraphElement>(null);
  const [currentTab, setCurrentTab] = useState('bun');

  const buns = useMemo(() => ingredients.filter((i) => i.type === 'bun'), [ingredients]);
  const mains = useMemo(
    () => ingredients.filter((i) => i.type === 'main'),
    [ingredients]
  );
  const sauces = useMemo(
    () => ingredients.filter((i) => i.type === 'sauce'),
    [ingredients]
  );

  const scrollTo = (ref: React.RefObject<HTMLParagraphElement | null>): void => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTabClick = useCallback(
    (
      tab: 'bun' | 'main' | 'sauce',
      ref: React.RefObject<HTMLParagraphElement | null>
    ) => {
      setCurrentTab(tab);
      scrollTo(ref);
    },
    [setCurrentTab, scrollTo]
  );

  return (
    <section className={`${styles.burger_ingredients} custom-scroll`}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={currentTab === 'bun'}
            onClick={() => handleTabClick('bun', bunRef)}
          >
            Булки
          </Tab>
          <Tab
            value="sauce"
            active={currentTab === 'sauce'}
            onClick={() => handleTabClick('sauce', sauceRef)}
          >
            Соусы
          </Tab>
          <Tab
            value="main"
            active={currentTab === 'main'}
            onClick={() => handleTabClick('main', mainRef)}
          >
            Начинки
          </Tab>
        </ul>
      </nav>
      <div className={`${styles.list_ingredients} custom-scroll pr-2`}>
        <p ref={bunRef} className={styles.block_name}>
          Булки
        </p>
        <ul className={`${styles.type_ingredients}`}>
          {buns.map((i) => (
            <ItemIngredients
              key={i._id}
              item={i}
              onClick={changeList}
              counter={counts[i._id] || 0}
            />
          ))}
        </ul>
        <p ref={sauceRef} className={styles.block_name}>
          Соусы
        </p>
        <ul className={`${styles.type_ingredients} custom-scroll`}>
          {sauces.map((i) => (
            <ItemIngredients
              key={i._id}
              item={i}
              onClick={changeList}
              counter={counts[i._id] ?? 0}
            />
          ))}
        </ul>
        <p ref={mainRef} className={styles.block_name}>
          Начинки
        </p>
        <ul className={`${styles.type_ingredients} custom-scroll`}>
          {mains.map((i) => (
            <ItemIngredients
              key={i._id}
              item={i}
              onClick={changeList}
              counter={counts[i._id] ?? 0}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

type ItemIngredientsProps = {
  item: TIngredient;
  onClick: (newIngredient: TIngredient) => void;
  counter: number;
};

const ItemIngredients = ({
  item,
  onClick,
  counter,
}: ItemIngredientsProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = (): void => {
    setIsOpen(true);
  };

  return (
    <li className={`${styles.one_ingredients}`}>
      <div onClick={handleClick}>
        {counter > 0 && <Counter count={counter} />}
        <img src={item.image} />
        <PriceIngredient price={item.price} />
        <p className={styles.ingredient_name}>{item.name}</p>
        {isOpen && (
          <Modal title="Детали ингредиента" onClose={() => setIsOpen(false)}>
            <IngredientDetails item={item} />
          </Modal>
        )}
      </div>
      <Button
        htmlType="button"
        type="secondary"
        size="small"
        onClick={() => onClick(item)}
      >
        Временное добавление
      </Button>
    </li>
  );
};
