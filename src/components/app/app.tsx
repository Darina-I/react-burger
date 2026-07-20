import { getIngredients } from '@/api/ingredientsApi';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState, useMemo } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type { TIngredient, TSelectBurger } from '@/utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectIngredient, setSelectIngredient] = useState<TSelectBurger>({
    ingredients: [],
    buns: undefined,
  });

  useEffect(() => {
    getIngredients()
      .then((response) => {
        const data = response.data;
        setIngredients(data);
      })
      .catch(() => setError('Произошшла ошибка'))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    selectIngredient.ingredients.map((item) => {
      result[item._id] = (result[item._id] || 0) + 1;
    });

    if (selectIngredient.buns) {
      const id = selectIngredient.buns._id;
      result[id] = (result[id] || 0) + 1;
    }

    return result;
  }, [selectIngredient.ingredients, selectIngredient.buns]);

  const handleChangeList = (newIngredient: TIngredient): void => {
    setSelectIngredient((prev) => {
      if (newIngredient.type === 'bun') {
        if (!prev.buns) {
          return { ...prev, buns: newIngredient };
        } else {
          return prev;
        }
      }

      return { ...prev, ingredients: [...prev.ingredients, newIngredient] };
    });
  };

  const handleDeleteIngredient = (indexDelete: number): void => {
    setSelectIngredient((prev) => {
      const ingredients = prev.ingredients.filter((_, index) => indexDelete !== index);

      return { ...prev, ingredients: ingredients };
    });
  };

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5 mb-10`}>
        <BurgerIngredients
          ingredients={ingredients}
          changeList={handleChangeList}
          counts={counts}
        />
        <BurgerConstructor
          selectBurger={selectIngredient}
          deleteIngredient={handleDeleteIngredient}
        />
      </main>
    </div>
  );
};

export default App;
