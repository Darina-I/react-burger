import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './price-ingredient.module.css';

export const PriceIngredient = ({ price }: { price: number }): React.JSX.Element => {
  return (
    <div className={styles.price_ingredient}>
      <p>{price}</p>
      <CurrencyIcon type="primary" />
    </div>
  );
};
