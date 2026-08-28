import { Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { Link, useLocation } from 'react-router-dom';

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

  const location = useLocation();

  return (
    <li
      ref={dragRef as unknown as React.Ref<HTMLLIElement>}
      className={`${styles.one_ingredients}`}
    >
      <Link
        to={`/ingredients/${item._id}`}
        state={{ backgroundLocation: location }}
        onClick={() => onClick(item)}
        className={styles.link}
      >
        {counter > 0 && <Counter count={counter} />}
        <img src={item.image} alt={item.name} />
        <PriceIngredient price={item.price} />
        <p className={styles.ingredient_name}>{item.name}</p>
      </Link>
    </li>
  );
};
