import { useModal } from '@/hooks/useModal';
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
  const { isModalOpen, openModal, closeModal } = useModal();
  const [selectIngredient, setSelectIngredient] = useState<TIngredient>();

  const buns = useMemo(() => ingredients.filter((i) => i.type === 'bun'), [ingredients]);
  const mains = useMemo(
    () => ingredients.filter((i) => i.type === 'main'),
    [ingredients]
  );
  const sauces = useMemo(
    () => ingredients.filter((i) => i.type === 'sauce'),
    [ingredients]
  );

  const handleTabClick = useCallback(
    (tab: 'bun' | 'main' | 'sauce') => {
      setCurrentTab(tab);

      let ref: React.RefObject<HTMLParagraphElement | null> | null = null;
      if (tab === 'bun') ref = bunRef;
      else if (tab === 'sauce') ref = sauceRef;
      else if (tab === 'main') ref = mainRef;

      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [setCurrentTab]
  );

  const handleIngredientClick = useCallback((ingredient: TIngredient) => {
    setSelectIngredient(ingredient);
    openModal();
  }, []);

  return (
    <section className={`${styles.burger_ingredients}`}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={currentTab === 'bun'}
            onClick={() => handleTabClick('bun')}
          >
            Булки
          </Tab>
          <Tab
            value="sauce"
            active={currentTab === 'sauce'}
            onClick={() => handleTabClick('sauce')}
          >
            Соусы
          </Tab>
          <Tab
            value="main"
            active={currentTab === 'main'}
            onClick={() => handleTabClick('main')}
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
            <Ingredient
              key={i._id}
              item={i}
              onClick={handleIngredientClick}
              addClick={changeList}
              counter={counts[i._id] || 0}
            />
          ))}
        </ul>
        <p ref={sauceRef} className={styles.block_name}>
          Соусы
        </p>
        <ul className={`${styles.type_ingredients} custom-scroll`}>
          {sauces.map((i) => (
            <Ingredient
              key={i._id}
              item={i}
              onClick={handleIngredientClick}
              addClick={changeList}
              counter={counts[i._id] ?? 0}
            />
          ))}
        </ul>
        <p ref={mainRef} className={styles.block_name}>
          Начинки
        </p>
        <ul className={`${styles.type_ingredients} custom-scroll`}>
          {mains.map((i) => (
            <Ingredient
              key={i._id}
              item={i}
              onClick={handleIngredientClick}
              addClick={changeList}
              counter={counts[i._id] ?? 0}
            />
          ))}
        </ul>
      </div>
      {isModalOpen && selectIngredient && (
        <Modal title="Детали ингредиента" onClose={closeModal}>
          <IngredientDetails item={selectIngredient} />
        </Modal>
      )}
    </section>
  );
};

type IngredientProps = {
  item: TIngredient;
  onClick: (newIngredient: TIngredient) => void;
  counter: number;
  addClick: (newIngredient: TIngredient) => void;
};

const Ingredient = ({
  item,
  onClick,
  counter,
  addClick,
}: IngredientProps): React.JSX.Element => {
  const handleClick = (): void => {
    onClick(item);
  };

  return (
    <li className={`${styles.one_ingredients}`}>
      <div onClick={handleClick}>
        {counter > 0 && <Counter count={counter} />}
        <img src={item.image} alt={item.name} />
        <PriceIngredient price={item.price} />
        <p className={styles.ingredient_name}>{item.name}</p>
      </div>
      <Button
        htmlType="button"
        type="secondary"
        size="small"
        onClick={() => addClick(item)}
      >
        Временное добавление
      </Button>
    </li>
  );
};
