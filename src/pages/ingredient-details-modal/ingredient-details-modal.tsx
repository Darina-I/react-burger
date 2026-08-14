import { useAppSelector } from '@/hooks/useAppHooks';
import { closeIngredientModal } from '@/services/ingredients/ingredientSlice';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { Modal } from '../../components/modal/modal';

import styles from './ingredient-details-modal.module.css';

export const IngredientDetailsModal = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const selectedIngredient = useAppSelector((state) => state.ingredient.details);

  if (!selectedIngredient) {
    return <Navigate to="/" />;
  }

  return (
    <Modal title="Детали ингредиента" onClose={() => dispatch(closeIngredientModal())}>
      <div className={styles.ingredient__modal}>
        <img src={selectedIngredient.image_large} alt={selectedIngredient.name} />
        <p className="text text_type_main-medium">{selectedIngredient.name}</p>
        <div
          className={`text text_type_main-default text_color_inactive mt-8 ${styles.ingredient__info}`}
        >
          <div>
            <p>Калории,ккал</p>
            <p>{selectedIngredient.calories}</p>
          </div>
          <div>
            <p>Белки, г</p>
            <p>{selectedIngredient.calories}</p>
          </div>
          <div>
            <p>Жиры, г</p>
            <p>{selectedIngredient.calories}</p>
          </div>
          <div>
            <p>Углеводы, г</p>
            <p>{selectedIngredient.calories}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
