import React from "react";
import moment, { Moment } from 'moment';
import Calendar from "./Calendar";
import styles from './InterviewTimePicker.module.css';
import { isToday } from "date-fns/esm";

interface Props {
  availabilities: Moment[],
  onBook: Function
}

export default function InterviewTimePicker(props: Props) {
  const [selectedSlot, setSelectedSlot] = React.useState<Moment>();
  const [displaySlots, setDisplaySlots] = React.useState(props.availabilities.filter(s => isToday(s.toDate())) as Moment[]);

  const sameDay = (a: Moment, b: Moment) => {
    return a.year() === b.year() && a.month() === b.month() && a.date() === b.date();
  }

  const sameSlot = (a?: Moment, b?: Moment) => {
    if (a == null || b == null) {
      return false;
    }
    return sameDay(a, b) && a.hours() === b.hours() && a.minutes() === b.minutes();
  }

  const handleDaySelect = function (year: number, month: number, day: number) {
    if (moment().isBefore(new Date(year, month, day))) {
      setDisplaySlots(props.availabilities.filter(a => sameDay(a, moment(new Date(year, month, day)))) as Moment[]);
    }
  }

  const displaySlotTimes = displaySlots.length === 0 ? "No availability" : displaySlots.map((avail) =>
    <li key={avail.format('LT')} onClick={() => setSelectedSlot(avail)} className={sameSlot(selectedSlot, avail) ? styles.selectedTime : styles.defaultTime}>
      {avail.format('LT')}
    </li>
  );

  const disableBooking = () => {
    if (selectedSlot == null || selectedSlot?.hours() == null) {
      return true;
    }
    for (let i = 0; i < displaySlots.length; i++) {
      if (sameSlot(selectedSlot, displaySlots[i])) {
        return false;
      }
    }
    return true;
  }

  const bookSlot = () => {
    // TODO: actually book interview
    if (!disableBooking()) {
      props.onBook(selectedSlot);
    }
  }

  return (
    <div className={styles.slotPickerContainer}>
      <Calendar onDayClick={handleDaySelect} highlightDays={props.availabilities} />
      <div className={styles.timePicker}>
        <ul className={styles.timeList}>
          {displaySlotTimes}
        </ul>
        <button onClick={bookSlot} id={disableBooking() ? styles.disabled : ''}>Book Interview</button>
      </div>
    </div>
  );
}
