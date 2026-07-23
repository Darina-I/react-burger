import { moveIngredient } from '@/services/order/orderSlice';
import {
  DragIcon,
  ConstructorElement,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import type { BurgerItem } from '@/utils/types';

import styles from './order-ingredient.module.css';

type BurgerIngredientProps = {
  isBuns?: boolean;
  item?: BurgerItem;
  onDelete?: () => void;
  type?: 'top' | 'bottom';
  isPlaceholder?: boolean;
  placeholder?: string;
  hasBorder?: boolean | undefined;
};

type DragItem = {
  id: string;
};

export const OrderIngredient = ({
  isBuns = false,
  item,
  onDelete,
  type,
  isPlaceholder = false,
  placeholder,
  hasBorder,
}: BurgerIngredientProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const [{ isDragging }, dragRef] = useDrag({
    type: 'MOVE_INGREDIENT',
    item: () => ({ id: item?.nanoid, isBuns: isBuns }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, dropRef] = useDrop({
    accept: 'MOVE_INGREDIENT',
    drop: (dragItem: DragItem) => {
      if (item?.nanoid && dragItem.id !== item?.nanoid) {
        dispatch(moveIngredient({ fromId: dragItem.id, toId: item?.nanoid }));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      style={{
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
        cursor: isDragging ? 'grab' : 'default',
      }}
      className={` ${isPlaceholder && type && styles.width_full}`}
    >
      {!isPlaceholder && item ? (
        <div
          ref={dragRef as unknown as React.Ref<HTMLDivElement>}
          className={styles.ingredient__one}
        >
          {!isBuns && <DragIcon type="primary" />}
          <ConstructorElement
            text={
              isBuns ? item.name + (type === 'top' ? ' (верх)' : ' (низ)') : item.name
            }
            price={item.price}
            thumbnail={item.image}
            type={type ?? undefined}
            isLocked={isBuns}
            handleClose={onDelete ?? undefined}
          />
        </div>
      ) : (
        <div
          className={`${styles.placeholder} constructor-element 
          ${hasBorder ? styles.placeholder_border : ''}
          ${type === 'top' ? 'constructor-element_pos_top ' : ''} 
          ${type === 'bottom' ? 'constructor-element_pos_bottom ' : ''}`}
        >
          <p>{placeholder}</p>
        </div>
      )}
    </div>
  );
};
