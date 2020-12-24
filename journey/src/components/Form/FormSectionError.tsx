import React from 'react';
import PropTypes from 'prop-types';

// Components
import Section from '../Section/Section';

// Styling
import styles from './Form.module.scss'; // Import css modules stylesheet as styles

const FormSectionError = (props: any) => (
  // <div className="form__section form__section--no-margin">
  <Section spacing="narrow">
    <p className={styles.error} data-show-error={props.error ? true : false}>
      {props.prefix} {props.error}
    </p>
  </Section>
);

FormSectionError.propTypes = {
  prefix: PropTypes.string,
  error: PropTypes.string,
};

export default FormSectionError;
