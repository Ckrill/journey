// Miscellaneous
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Section from '../components/Section/Section';

// Styles
import styles from './UnsupportedBrowser.module.scss';

const UnsupportedBrowser = () => (
  <main className={styles.page}>
    <Section>
      <Heading level={1}>Browser not supported</Heading>

      <Paragraph>
        Journey relies on new web technologies. <br />
        Update your browser, or switch to Chrome or Firefox.
      </Paragraph>
    </Section>
  </main>
);

export default UnsupportedBrowser;
