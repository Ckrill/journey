// Components
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import SectionContainer from '../components/Section/SectionContainer';
import Page from '../components/SignIn/Page';
import SignInForm from '../components/SignIn/SignIn';
import Title from '../components/SignIn/Title';

// Types
import { User } from '../types/types';

type Props = { setUser: (user: User | null) => void };

const SignIn = ({ setUser }: Props) => {
  return (
    <>
      <Page>
        <Title>Journey</Title>

        <SectionContainer>
          <Heading>Welcome stranger</Heading>

          <Paragraph>
            What name would you like to be associated with your workouts?
          </Paragraph>

          <SignInForm setUser={setUser} />
        </SectionContainer>
      </Page>
    </>
  );
};

export default SignIn;
