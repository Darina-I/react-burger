import { useGetIngredientsQuery } from '@/services/ingredients/ingredientsApi';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useParams, Navigate } from 'react-router-dom';

import styles from './ingredient-details.module.css';

export const IngredientDetails = (): React.JSX.Element => {
  const { data: ingredients, isLoading } = useGetIngredientsQuery();
  const { id } = useParams();

  if (isLoading) {
    return <Preloader />;
  }

  const ingredient = ingredients?.find((i) => i._id === id);

  if (!ingredient) {
    return <Navigate to="/" />;
  }

  return (
    <div className={`${styles.ingredient} mt-30`}>
      <img src={ingredient.image_large} alt={ingredient.name} />
      <p className="text text_type_main-medium">{ingredient.name}</p>
      <div
        className={`text text_type_main-default text_color_inactive mt-8 ${styles.ingredient__info}`}
      >
        <div>
          <p>Калории,ккал</p>
          <p>{ingredient.calories}</p>
        </div>
        <div>
          <p>Белки, г</p>
          <p>{ingredient.calories}</p>
        </div>
        <div>
          <p>Жиры, г</p>
          <p>{ingredient.calories}</p>
        </div>
        <div>
          <p>Углеводы, г</p>
          <p>{ingredient.calories}</p>
        </div>
      </div>
    </div>
  );
};
