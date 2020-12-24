import React from 'react';

// Styles
import styles from './Form.module.scss';
import SectionContainer from '../Section/SectionContainer';

const Form = (props: any) => (
  <form className={styles.form} {...props}>
    <SectionContainer>{props.children}</SectionContainer>
  </form>
);

export default Form;
