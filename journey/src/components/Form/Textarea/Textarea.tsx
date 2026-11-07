// External
import React from 'react';

// Miscellaneous
import FieldLabel from '../FieldLabel/FieldLabel';
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
    <FieldLabel htmlFor={props.id}>{labelText}</FieldLabel>

    <textarea
      aria-invalid={errorText ? true : undefined}
      className={styles.textarea}
      {...props}
    />

    <FieldMessage assistiveText={assistiveText} errorText={errorText} />
  </div>
);

export default FormTextarea;
