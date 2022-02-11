import React from "react";
import moment, { Moment } from 'moment';
import Calendar from "./calendar/Calendar";
import styles from './BookingPage.module.css';
import { isToday } from "date-fns/esm";

export default function BookingPage() {
  const getSlots = () => {
    // TODO: remove hard-coded availabilities
    return [
      moment(new Date(2022, 1, 12, 12)),
      moment(new Date(2022, 1, 12, 15)),
      moment(new Date(2022, 1, 12, 17)),
      moment(new Date(2022, 1, 13, 9)),
      moment(new Date(2022, 1, 13, 17)),
      moment(new Date(2022, 1, 15, 8)),
      moment(new Date(2022, 1, 15, 12)),
      moment(new Date(2022, 1, 15, 13)),
      moment(new Date(2022, 1, 15, 15)),
      moment(new Date(2022, 1, 15, 16)),
      moment(new Date(2022, 1, 15, 17)),
      moment(new Date(2022, 1, 15, 18))
    ];
  }

  const slots: Moment[] = getSlots();
  const [selectedSlot, setSelectedSlot] = React.useState<Moment>();
  const [displaySlots, setDisplaySlots] = React.useState(slots.filter(s => isToday(s.toDate())) as Moment[]);

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
    setDisplaySlots(slots.filter(a => sameDay(a, moment(new Date(year, month, day)))) as Moment[]);
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
      window.alert("You have successfully booked an interview for " + selectedSlot?.format('LLLL'));
    }
  }

  return (
    <div className={styles.apptPicker}>
      <Calendar onDayClick={handleDaySelect} highlightDays={slots} />
      <div className={styles.apptTimePicker}>
        <ul className={styles.apptList}>
          {displaySlotTimes}
        </ul>
        <button onClick={bookSlot} id={disableBooking() ? styles.disabled : ''}>Book Interview</button>
      </div>
    </div>
  );
}
