import React, { useEffect, useState } from 'react';

// Components
import Calibration from '../components/Calibration/Calibration';
import Commitment from '../components/Commitment/Commitment';
import Paragraph from '../components/Paragraph/Paragraph';
import SignUp from '../components/SignUp/SignUp';

// Helpers
import { getFromLocalStorage } from '../helpers/localStorage';

type User = {
  name: string;
} | null;

type Exercise = string;
type Exercises = Exercise[] | null;

type Test = {
  name: string;
  reps: number;
};
type Tests =
  | [
      {
        type: string;
        date: string;
        exercises: Test[];
      }
    ]
  | null;

const Home = () => {
  const [user, setUser] = useState<User>(null);
  const [exercises, setExercises] = useState<Exercises>(null);
  const [tests, setTests] = useState<Tests>(null);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (!firstRender) return;

    const user = getFromLocalStorage('user');
    const exercises = getFromLocalStorage('exercises');
    const tests = getFromLocalStorage('tests');

    setUser(user);
    setExercises(exercises);
    setTests(tests);

    setFirstRender(false);
  }, [firstRender]);

  return (
    <>
      <Paragraph>
        Good to see you{!user ? ', friend' : `, ${user!.name}`}
      </Paragraph>
      {!user && <SignUp handleUpdateUser={setUser} />}
      {user && (
        <>
          {!exercises && <Commitment handleUpdateExercises={setExercises} />}

          {exercises && !tests && <Calibration exercises={exercises} />}
        </>
      )}

      {/* TODO: Tip: Stretch instead of resting between sets */}
      {/* TODO: Tip: In that last set of a workout session, try to do as many reps as you can */}

      {/* <div className="start-training settings">
          Progress
          <form>
            <fieldset>
              <label htmlFor="difficluty">Difficulty (1-3)</label>
              <input type="number" id="difficulty" value="1" min="1" max="3" />
              <label htmlFor="week">Week (1-6)</label>
              <input type="number" id="week" value="1" min="1" max="6" />
              <label htmlFor="day">Day (1-3)</label>
              <input type="number" id="day" value="1" min="1" max="3" />
              <button>Start!</button>
            </fieldset>
          </form>
        </div>

        <div className="test"></div>

        <div className="workout">
          <div className="workout__sets"></div>
          <button>Next</button>
          <div className="workout__rest">
            <div className="workout__rest-text">
              Rest for <span className="workout__clock"></span> seconds!
            </div>
          </div>
        </div> */}
    </>
  );
};

export default Home;
