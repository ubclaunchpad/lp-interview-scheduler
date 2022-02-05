import moment, { Moment } from 'moment';
import Day from './Day';

interface Props {
    onDayClick: Function
    highlightDays: number[],
    year: number,
    month: number
}

const tableStyle = {
    margin: "0 auto",
    width: "60%",
    maxWidth: "500px",
};

export default function Calendar(props: Props) {
    const onDayClick = (day: number) => {
        props.onDayClick(props.year, props.month, day)
    }

    let referenceDate: Moment = moment(new Date(props.year, props.month, 1));
    let firstDay: Number = Number(referenceDate.format("d"));
    let numDays: Number = referenceDate.daysInMonth();

    let calendar = [];
    let week = [];

    // Pad the beginning of the table with empty cells to account for months that
    // do not start on a Sunday
    for (let i = 0; i < firstDay; i++) {
        week.push(
            <td key={-i} />
        );
    }

    for (let i = 1; i <= numDays; i++) {
        // If we have reached the end of a week, push the current week into the calendar
        // and start a new week
        if (week.length === 7) {
            calendar.push(<tr key={i}>{week}</tr>);
            week = [];
        }

        week.push(
            <td key={i}>
                <Day date={i} onClick={onDayClick} highlight={props.highlightDays.includes(i)} />
            </td>
        );
    }

    // Push the last, possibly incomplete, week into the calendar
    calendar.push(<tr key={0}>{week}</tr>);

    return (
        <div>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th>S</th>
                        <th>M</th>
                        <th>T</th>
                        <th>W</th>
                        <th>T</th>
                        <th>F</th>
                        <th>S</th>
                    </tr>
                </thead>
                <tbody>{calendar}</tbody>
            </table>
        </div>
    );
}