import { Modal } from '@/components/modal/modal';
import { useNavigate } from 'react-router-dom';

import { FeedOrderDetails } from '../feed-order-details/feed-order-details';
export const FeedOrderDetailsModal = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <Modal title="" onClose={() => void navigate(-1)}>
      <FeedOrderDetails />
    </Modal>
  );
};
