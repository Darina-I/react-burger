import type { TIngredient } from '@/utils/types';

import styles from './ingredient-details.module.css';

type DetailsProps = {
  item: TIngredient;
};

export const IngredientDetails = ({ item }: DetailsProps): React.JSX.Element => {
  return (
    <div className={styles.ingredient__modal}>
      <img src={item.image_large} />
      <p className="text text_type_main-medium">{item.name}</p>
      <div
        className={`text text_type_main-default text_color_inactive mt-8 ${styles.ingredient__info}`}
      >
        <div>
          <p>Калории,ккал</p>
          <p>{item.calories}</p>
        </div>
        <div>
          <p>Белки, г</p>
          <p>{item.calories}</p>
        </div>
        <div>
          <p>Жиры, г</p>
          <p>{item.calories}</p>
        </div>
        <div>
          <p>Углеводы, г</p>
          <p>{item.calories}</p>
        </div>
      </div>
    </div>
  );
};
