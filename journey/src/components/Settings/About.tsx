// Miscellaneous
import Heading from '../Heading/Heading';
import Paragraph from '../Paragraph/Paragraph';
import ParagraphGroup from '../ParagraphGroup/ParagraphGroup';

const About = () => (
  <>
    <Heading>About</Heading>

    <ParagraphGroup
      more={
        <>
          <Paragraph>
            Journey makes use of newer web features that are not yet supported
            in all browsers.
          </Paragraph>

          <Paragraph>
            You can add Journey to your home screen for an app-like experience.
          </Paragraph>

          <Paragraph>
            Feedback is always welcome. You know where to find me.
          </Paragraph>
        </>
      }
    >
      <Paragraph>
        Journey is under development and subject to change. For the best
        experience, use Chrome on Android.
      </Paragraph>
    </ParagraphGroup>
  </>
);

export default About;
