import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import styles from './home.module.css';

export const Home = (): React.JSX.Element => {
  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 pl-5`}>
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5 mb-10`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </DndProvider>
  );
};
