// External
import { getRouteApi } from '@tanstack/react-router';

// Utilities
import { currentWeekStart, shiftWeek, weekDates } from '../../helpers/week';

// Miscellaneous
import Carousel from '../Carousel/Carousel';
import HabitList from '../Habit/HabitList';
import WeekSwitcher from './WeekSwitcher';

// Types
import type { Events, Habit } from '../../types/types';

const route = getRouteApi('/');

interface Props {
  datesByHabit: Map<string, Set<string>>;
  events: Events;
  habits: Habit[];
  openEdit: (habit: Habit) => void;
}

const WeekPager = ({ datesByHabit, events, habits, openEdit }: Props) => {
  const navigate = route.useNavigate();
  const { week } = route.useSearch();

  const weekStart = week ?? currentWeekStart();
  const dates = weekDates(weekStart);
  const canGoNext = weekStart < currentWeekStart();

  const goPrev = () => {
    void navigate({ search: { week: shiftWeek(weekStart, -1) } });
  };

  const goNext = () => {
    if (!canGoNext) return;
    const next = shiftWeek(weekStart, 1);
    void navigate({
      search: { week: next === currentWeekStart() ? undefined : next },
    });
  };

  const goCurrent = () => {
    if (weekStart === currentWeekStart()) return;
    void navigate({ search: { week: undefined } });
  };

  return (
    <>
      <WeekSwitcher
        canGoNext={canGoNext}
        onCurrent={goCurrent}
        onNext={goNext}
        onPrev={goPrev}
        weekStart={weekStart}
      />

      <Carousel onNext={goNext} onPrev={goPrev} slideKey={weekStart}>
        <HabitList
          dates={dates}
          datesByHabit={datesByHabit}
          events={events}
          habits={habits}
          openEdit={openEdit}
        />
      </Carousel>
    </>
  );
};

export default WeekPager;
