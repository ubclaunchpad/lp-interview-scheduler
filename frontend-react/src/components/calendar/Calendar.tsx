import moment, { Moment } from 'moment';
import React from 'react';
import Day from './Day';

interface Props {
    onDayClick: Function
    highlightDays: number[]
}

const titleStyle = {
    display: "flex",
    flexDirection: "row" as "row",
    justifyContent: "center"
}

const buttonStyle = {
    margin: "10px 10px"
}

const tableStyle = {
    margin: "0 auto",
    width: "60%",
    maxWidth: "500px",
};

export default function Calendar(props: Props) {
    const [month, setMonth] = React.useState(1);
    const [year, setYear] = React.useState(2022);
  
    let referenceDate: Moment = moment(new Date(year, month, 1));
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
                <Day date={i} onClick={props.onDayClick} highlight={props.highlightDays.includes(i)} />
            </td>
        );
    }

    // Push the last, possibly incomplete, week into the calendar
    calendar.push(<tr key={0}>{week}</tr>);

    const flip = (direction: number) => {
        // + 12 because TS doesn't do well with negative moduluo
        setMonth((month + direction + 12) % 12);
        if (month + direction < 0) {
            setYear(year - 1);
        } else if (month + direction >= 12) {
            setYear(year + 1);
        } 
    }

    return (
        <div>
            <div style={titleStyle}>
                <button style={buttonStyle} onClick={() => flip(-1)}>&lt;</button>
                <p>{moment().month(month).format('MMMM')} {year}</p>
                <button style={buttonStyle} onClick={() => flip(1)}>&gt;</button>
            </div>
            
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