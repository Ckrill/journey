// External
import { getRouteApi } from '@tanstack/react-router';
import { useRef, useState } from 'react';

// Utilities
import { currentWeekStart, shiftWeek, weekDates } from '../../helpers/week';

// Miscellaneous
import Carousel, { type CarouselHandle } from '../Carousel/Carousel';
import HabitList from '../Habit/HabitList/HabitList';
import WeekSwitcher from './WeekSwitcher';

// Types
import type { Events, Habit } from '../../types/types';

const route = getRouteApi('/');

// Weeks rendered on each side of the current one, so a fast swipe doesn't hit the scroll edge.
const SLIDE_RADIUS = 2;

interface Props {
  datesByHabit: Map<string, Set<string>>;
  events: Events;
  habits: Habit[];
  openEdit: (habit: Habit) => void;
}

const WeekPager = ({ datesByHabit, events, habits, openEdit }: Props) => {
  const navigate = route.useNavigate();
  const { week } = route.useSearch();
  const carouselRef = useRef<CarouselHandle>(null);

  const weekStart = week ?? currentWeekStart();
  const canGoNext = weekStart < currentWeekStart();

  // Week the swipe is heading towards, shown in the switcher before the swipe settles.
  const [preview, setPreview] = useState<null | string>(null);
  const [previewedWeek, setPreviewedWeek] = useState(weekStart);
  if (previewedWeek !== weekStart) {
    setPreviewedWeek(weekStart);
    setPreview(null);
  }

  const slides = [];
  const current = currentWeekStart();
  for (let offset = -SLIDE_RADIUS; offset <= SLIDE_RADIUS; offset++) {
    const start = shiftWeek(weekStart, offset);
    if (start > current) break;
    slides.push({
      key: start,
      node: (
        <HabitList
          dates={weekDates(start)}
          datesByHabit={datesByHabit}
          events={events}
          habits={habits}
          openEdit={openEdit}
        />
      ),
    });
  }

  const goTo = (start: string) => {
    void navigate({
      search: { week: start === currentWeekStart() ? undefined : start },
    });
  };

  const goPrev = () => {
    carouselRef.current?.step(-1);
  };

  const goNext = () => {
    if (canGoNext) carouselRef.current?.step(1);
  };

  const goCurrent = () => {
    if (weekStart !== currentWeekStart()) goTo(currentWeekStart());
  };

  return (
    <>
      <WeekSwitcher
        canGoNext={canGoNext}
        onCurrent={goCurrent}
        onNext={goNext}
        onPrev={goPrev}
        weekStart={preview ?? weekStart}
      />

      <Carousel
        onPreview={setPreview}
        onSettle={goTo}
        ref={carouselRef}
        slideKey={weekStart}
        slides={slides}
      />
    </>
  );
};

export default WeekPager;
