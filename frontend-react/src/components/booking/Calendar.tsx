import moment, { Moment } from 'moment';
import Day from './Day';
import styles from './Calendar.module.css';
import React from 'react';

interface Props {
    onDayClick: Function
    highlightDays: Moment[]
}

export default function Calendar(props: Props) {
    let todaysDate: Moment = moment(new Date());
    const [selected, setSelected] = React.useState(-1);
    const [month, setMonth] = React.useState(todaysDate.month());
    const [year, setYear] = React.useState(todaysDate.year());
    const [highlightedInMonth, setHighlightedInMonth] = React.useState(props.highlightDays.filter(d => d.year() === year && d.month() === month).map(d => d.date()) as number[]);

    React.useEffect(() => {
        setHighlightedInMonth(props.highlightDays.filter(d => d.year() === year && d.month() === month).map(d => d.date()));
    }, [props.highlightDays, year, month]);
    
    const flip = (direction: number) => {
        // + 12 because TS doesn't do well with negative moduluo
        let newMonth = (month + direction + 12) % 12;
        setMonth(newMonth);
        let newYear = year;
        if (month + direction < 0) {
          newYear = year - 1;
        } else if (month + direction >= 12) {
          newYear = year + 1;
        }
        setYear(newYear);
        setHighlightedInMonth(props.highlightDays.filter(d => d.year() === newYear && d.month() === newMonth).map(d => d.date()));
        setSelected(-1);
    }

    const onDayClick = (day: number) => {
        setSelected(day);
        props.onDayClick(year, month, day);
    }

    let referenceDate: Moment = moment(new Date(year, month, 1));
    let firstDay: Number = Number(referenceDate.format('d'));
    let numDays: Number = referenceDate.daysInMonth();

    let calendar = [];

    let weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
        calendar.push(
            <div>
                <p>{day}</p>
            </div>
        );
    });

    // Pad the beginning of the table with empty cells to account for months that
    // do not start on a Sunday
    for (let i = 0; i < firstDay; i++) {
        calendar.push(<div></div>);
    }

    for (let i = 1; i <= numDays; i++) {
        let disabled = todaysDate.isAfter(moment(new Date(year, month, i)));
        calendar.push(
            <Day date={i} onClick={onDayClick} highlight={highlightedInMonth.includes(i)} selected={selected === i} disabled={disabled}/>
        );
    }

    // Push the last, possibly incomplete, week into the calendar
    //calendar.push(<tr key={0}>{week}</tr>);

    return (
        <div className={styles.calendar}>
            <div className={styles.calendarHead}>
                <button onClick={() => flip(-1)}><i className={`${styles.arrow} ${styles.left}`}></i></button>
                <p>{moment().month(month).format('MMMM')} {year}</p>
                <button onClick={() => flip(1)}><i className={`${styles.arrow} ${styles.right}`}></i></button>
            </div>
            <div className={styles.calendarGrid}>
                {calendar}
            </div>
        </div>
    );
}