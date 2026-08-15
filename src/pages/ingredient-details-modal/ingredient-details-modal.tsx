import { useNavigate } from 'react-router-dom';

import { Modal } from '../../components/modal/modal';
import { IngredientDetails } from '../ingredient-details/ingredient-details';

export const IngredientDetailsModal = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <Modal title="Детали ингредиента" onClose={() => void navigate('/')}>
      <IngredientDetails />
    </Modal>
  );
};
