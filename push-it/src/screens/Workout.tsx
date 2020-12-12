import React, { useEffect, useState } from 'react';
import * as contentful from 'contentful-management';
import { useForm } from 'react-hook-form';

// Settings
import { settings } from '../settings/settings';

// Helpers
import { getFromLocalStorage } from '../helpers/localStorage';

// Components
import Button from '../components/Button/Button';
// import Checklist from '../components/Checklist/Checklist';
import Feedback from '../components/Feedback/Feedback';
import FormInput from '../components/Form/FormInput';
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import SignUp from '../components/SignUp/SignUp';

// Types
import { User } from '../types/types';
// import {
//   ChecklistItemType,
//   ChecklistType,
// } from '../components/Checklist/ChecklistTypes';

const client = contentful.createClient({
  accessToken:
    process.env.REACT_APP_CONTENTFUL_USER ||
    settings.accessTokenManagement ||
    '',
});

const Workout = () => {
  const { errors, register, reset, handleSubmit } = useForm();
  // const [exercises, setExercises] = useState<Exercises>([]);
  const [firstRender, setFirstRender] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  // const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (!submitSuccess) return;

    setShowFeedback(true);

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 1000);
  }, [submitSuccess]);

  // const [formState, setFormState] = useState<ChecklistType>([]);

  useEffect(() => {
    if (!firstRender) return;

    // const exercises = getFromLocalStorage('exercises') || [];
    // const workouts = getFromLocalStorage('workouts') || [];

    // If user exists in local
    const localUser = getFromLocalStorage('user');
    if (localUser) {
      setUser(localUser);
    }

    // setExercises(exercises);
    // setFormState(
    //   exercises.map((item: Exercise) => ({ ...item, checked: false }))
    // );
    // setWorkouts(workouts);

    setFirstRender(false);
  }, [firstRender]);

  const onSubmit = (data: any) => {
    setSubmitting(true);

    const date = new Date();

    // const finishedExercises: ChecklistType = formState.filter(
    //   (item) => item.checked
    // );

    // finishedExercises.forEach((item) => {
    //   delete item.checked;
    // });

    const finishedWorkout = {
      date: date,
      name: data.name,
      user: user?.name,
    };

    // const newWorkouts: Workouts = [
    //   ...workouts,
    //   finishedWorkout,
    // ];

    // Save workout.
    // saveToLocalStorage('workouts', newWorkouts);
    // Create and publish item.
    client
      .getSpace(settings.space)
      .then((space) => space.getEnvironment(settings.environment))
      .then((environment) =>
        environment.createEntry('workout', {
          fields: {
            date: {
              'en-US': finishedWorkout.date,
            },
            name: {
              'en-US': finishedWorkout.name,
            },
            user: {
              'en-US': {
                sys: {
                  id: user?.id,
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            },
          },
        })
      )
      .then((entry) => entry.publish())
      .then((entry) => {
        // Reset form.
        reset();

        // Reset submitError.
        setSubmitError(null);
        setSubmitSuccess(true);
      })
      .catch((error) => {
        console.error(error);
        setSubmitError(JSON.stringify(error));
      })
      .finally(() => setSubmitting(false));

    // Reset form.
    // const clearedForm = formState.map((item: ChecklistItemType) => {
    //   item.checked = false;
    //   return item;
    // });
    // setFormState(clearedForm);
  };

  return (
    <>
      {!user ? (
        <SectionContainer>
          <Section>
            <Heading>Stranger?</Heading>
            <Paragraph>
              What name would like to be associated with your workouts?
            </Paragraph>

            {/* User registration */}
            {!user && <SignUp setUser={setUser} />}
          </Section>
        </SectionContainer>
      ) : (
        <SectionContainer>
          <Section>
            <Heading>Today's workout</Heading>
          </Section>

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: 'contents' }}
          >
            {/* <Section>
              <Checklist
                items={formState}
                onChange={(exerciseName: string) => {
                  let newState = [...formState];

                  formState.forEach((item, index) => {
                    if (item.name === exerciseName) {
                      newState[index]['checked'] = !formState[index].checked;
                    }
                  });

                  setFormState(newState);
                }}
              />
            </Section> */}

            <Section>
              <FormInput
                labelText="What workout did you do?"
                name="name"
                ref={register({ required: true })}
                type="text"
              />
              {errors.name && <p>Please fill out this field.</p>}
            </Section>

            <Section>
              <Button disabled={submitSuccess || submitting} type="submit">
                {submitSuccess ? 'Saved!' : submitting ? 'Saving' : 'Save'}
              </Button>
            </Section>
          </form>

          <Feedback setShow={setShowFeedback} show={showFeedback} />

          {submitError && (
            <Section>
              <Heading>A terrible error happened!</Heading>
              <Paragraph>
                Let me know what you did and what it says below and I will fix
                it.
              </Paragraph>
              <code>{submitError}</code>
            </Section>
          )}
        </SectionContainer>
      )}
    </>
  );
};

export default Workout;
