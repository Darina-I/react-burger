import { detailsIngredient, closeIngredientModal } from '@/store/ingredientSlice';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Ingredient } from '../ingredient-card/ingredient-card';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';

import type { RootState } from '@/store/store';
import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const selectedIngredient = useSelector((state: RootState) => state.ingredient.details);
  const isModalOpen = useSelector((state: RootState) => state.ingredient.isModalOpen);
  const burger = useSelector((state: RootState) => state.burger);

  const bunRef = useRef<HTMLParagraphElement | null>(null);
  const sauceRef = useRef<HTMLParagraphElement | null>(null);
  const mainRef = useRef<HTMLParagraphElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [currentTab, setCurrentTab] = useState('bun');

  const { buns, mains, sauces } = useMemo(() => {
    const buns: TIngredient[] = [];
    const mains: TIngredient[] = [];
    const sauces: TIngredient[] = [];

    ingredients.forEach((item) => {
      switch (item.type) {
        case 'bun':
          buns.push(item);
          break;
        case 'main':
          mains.push(item);
          break;
        case 'sauce':
          sauces.push(item);
          break;
        default:
          break;
      }
    });

    return { buns, mains, sauces };
  }, [ingredients]);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    burger.ingredients.map((item) => {
      result[item._id] = (result[item._id] || 0) + 1;
    });

    if (burger.buns) {
      const id = burger.buns._id;
      result[id] = (result[id] || 0) + 2;
    }

    return result;
  }, [burger]);

  const handleScroll = useCallback(() => {
    if (!listRef.current) return;
    const refs = [
      { ref: bunRef, type: 'bun' as const },
      { ref: sauceRef, type: 'sauce' as const },
      { ref: mainRef, type: 'main' as const },
    ];

    const containerTop = listRef.current.getBoundingClientRect().top;

    let current: (typeof refs)[number] | null = null;
    let maxTop = -Infinity;

    for (const item of refs) {
      const element = item.ref.current;
      if (!element) continue;

      const top = element.getBoundingClientRect().top - containerTop;

      if (top <= 1 && top > maxTop) {
        maxTop = top;
        current = item;
      }
    }

    if (current) setCurrentTab(current.type);
  }, []);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return (): void => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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

  const handleIngredientClick = useCallback(
    (ingredient: TIngredient) => {
      dispatch(detailsIngredient(ingredient));
    },
    [dispatch]
  );

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
      <div className={`${styles.list_ingredients} custom-scroll pr-2`} ref={listRef}>
        <p ref={bunRef} className={styles.block_name}>
          Булки
        </p>
        <ul className={`${styles.type_ingredients}`}>
          {buns.map((i) => (
            <Ingredient
              key={i._id}
              item={i}
              onClick={handleIngredientClick}
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
              counter={counts[i._id] ?? 0}
            />
          ))}
        </ul>
      </div>
      {isModalOpen && selectedIngredient && (
        <Modal
          title="Детали ингредиента"
          onClose={() => dispatch(closeIngredientModal())}
        >
          <IngredientDetails item={selectedIngredient} />
        </Modal>
      )}
    </section>
  );
};
