import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@/utils/types';

import styles from './list-order-ingredients.module.css';

type ListProps = {
  list: { ingredient: TIngredient | null; count: number | null }[];
};

export const ListOrderIngredients = ({ list }: ListProps): React.JSX.Element => {
  return (
    <ul className={styles.ingredients_list}>
      {list.map((item) => (
        <li className={styles.list_item} key={item.ingredient?._id}>
          <img src={item.ingredient?.image} />
          <p className="text text_type_main-default">{item.ingredient?.name}</p>
          <div className={`text text_type_main-default ${styles.ingredient_price}`}>
            <p>
              {item.count} × {item.ingredient?.price}
            </p>
            <CurrencyIcon type="primary" />
          </div>
        </li>
      ))}
    </ul>
  );
};
