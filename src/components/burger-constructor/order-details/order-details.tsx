import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import type { Order } from '@/utils/types';

import styles from './order-details.module.css';

export const OrderDetails = ({ details }: { details: Order }): React.JSX.Element => {
  return (
    <div className={styles.order_details}>
      <p className="text text_type_digits-large mt-20">{details.order.number}</p>
      <p className="text text_type_main-medium mt-8 mb-15">идентификатор заказа</p>
      <CheckMarkIcon type="primary" />
      <p className="text text_type_main-medium mt-15 mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive mb-20">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
