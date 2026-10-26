// External
import clsx from 'clsx';
import React from 'react';

// Miscellaneous
import FieldMessage from '../FieldMessage/FieldMessage';

// Styles
import styles from './Textarea.module.scss';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  assistiveText?: string;
  errorText?: string;
  id: string;
  labelText: string;
};

const FormTextarea = ({
  assistiveText,
  errorText,
  labelText,
  ...props
}: Props) => (
  <div className={styles.container}>
    <label className={styles.label} htmlFor={props.id}>
      {labelText}
    </label>

    <textarea
      className={clsx(styles.textarea, errorText && styles['textarea--error'])}
      {...props}
    />

    <FieldMessage assistiveText={assistiveText} errorText={errorText} />
  </div>
);

export default FormTextarea;
