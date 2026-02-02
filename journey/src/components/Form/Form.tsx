// Styles
import styles from './Form.module.scss';
import SectionContainer from '../Section/SectionContainer';

type Props = React.FormHTMLAttributes<HTMLFormElement> & {
  children: React.ReactNode;
};

const Form = (props: Props) => (
  <form className={styles.form} {...props}>
    <SectionContainer>{props.children}</SectionContainer>
  </form>
);

export default Form;
