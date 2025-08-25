// Components
import Section from '../Section/Section';

// Styling
import styles from './Form.module.scss'; // Import css modules stylesheet as styles

interface FormSectionErrorProps {
  prefix?: string;
  error?: string;
}

const FormSectionError = (props: FormSectionErrorProps) => (
  // <div className="form__section form__section--no-margin">
  (<Section spacing="narrow">
    <p className={styles.error} data-show-error={props.error ? true : false}>
      {props.prefix} {props.error}
    </p>
  </Section>)
);

export default FormSectionError;
