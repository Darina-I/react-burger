import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => {
  return (
    <div className={styles.order_details}>
      <p className="text text_type_digits-large mt-20">034536</p>
      <p className="text text_type_main-medium mt-8 mb-15">идентификатор заказа</p>
      <CheckMarkIcon type="primary" />
      <p className="text text_type_main-medium mt-15 mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive mb-20">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
