import { Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import { PriceIngredient } from '../price-ingredient/price-ingredient';

import type { TIngredient } from '@/utils/types';

import styles from './ingredient-card.module.css';

type IngredientProps = {
  item: TIngredient;
  onClick: (newIngredient: TIngredient) => void;
  counter: number;
};

export const Ingredient = ({
  item,
  onClick,
  counter,
}: IngredientProps): React.JSX.Element => {
  const [, dragRef] = useDrag({
    type: 'INGREDIENT',
    item: () => ({ ...item }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const handleClick = (): void => {
    onClick(item);
  };

  return (
    <li
      ref={dragRef as unknown as React.Ref<HTMLLIElement>}
      className={`${styles.one_ingredients}`}
    >
      <div onClick={handleClick}>
        {counter > 0 && <Counter count={counter} />}
        <img src={item.image} alt={item.name} />
        <PriceIngredient price={item.price} />
        <p className={styles.ingredient_name}>{item.name}</p>
      </div>
    </li>
  );
};
