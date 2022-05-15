// Components
import SignInForm from '../components/SignIn/SignIn';
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';

// Types
import { User } from '../types/types';

type Props = { setUser: (user: User | null) => void };

const SignIn = ({ setUser }: Props) => {
  return (
    <>
      <SectionContainer>
        <Section>
          <Heading>Welcome stranger</Heading>

          <Paragraph>
            What name would you like to be associated with your workouts?
          </Paragraph>

          <SignInForm setUser={setUser} />
        </Section>
      </SectionContainer>
    </>
  );
};

export default SignIn;
