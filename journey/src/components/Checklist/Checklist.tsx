import React from 'react';

// Components
import ChecklistItem from './ChecklistItem';

// Types
import { ChecklistType } from './ChecklistTypes';

// Styles
import styles from './Checklist.module.scss';

type Props = { items: ChecklistType; onChange: Function };

const Checklist = ({ items, onChange }: Props) => (
  <ul className={styles.list}>
    {items.map((item, index) => (
      <li className={styles.item} key={index}>
        <ChecklistItem
          checked={items[index].checked}
          setChecked={() => onChange(item.name)}
        />
        {item.name}
      </li>
    ))}
  </ul>
);

export default Checklist;
