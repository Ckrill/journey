import React, { useEffect, useState } from 'react';

// Helpers
import { getFromLocalStorage } from '../helpers/localStorage';

// Components
// import Calibration from '../components/Calibration/Calibration';
// import Commitment from '../components/Commitment/Commitment';
import Paragraph from '../components/Paragraph/Paragraph';
import SignUp from '../components/SignUp/SignUp';

// Types
import { User } from '../types/types';

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  // const [exercises, setExercises] = useState<Exercises | null>(null);
  // const [tests, setTests] = useState<Tests | null>(null);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (!firstRender) return;

    const user = getFromLocalStorage('user');
    // const exercises = getFromLocalStorage('exercises');
    // const tests = getFromLocalStorage('tests');

    setUser(user);
    // setExercises(exercises);
    // setTests(tests);

    setFirstRender(false);
  }, [firstRender]);

  return (
    <>
      <Paragraph>
        Good to see you{!user ? ', friend' : `, ${user!.name}`}
      </Paragraph>

      {/* User registration */}
      {!user && <SignUp handleUpdateUser={setUser} />}

      {/* {user && (
        <>
          {!exercises && <Commitment handleUpdateExercises={setExercises} />}

          {exercises && !tests && <Calibration exercises={exercises} />}
        </>
      )} */}
    </>
  );
};

export default Home;
