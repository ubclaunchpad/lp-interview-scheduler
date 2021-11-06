import React from "react";
import { Calendar, DateLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../App.css";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.

interface Props {
  localizer: DateLocalizer;
}

class CalendarEvent {
  // allDay?: boolean;
  start: string | Date;
  end: string | Date;
  // desc: string;
  // resourceId?: string;
  // tooltip?: string;

  constructor(
    _start: Date,
    _endDate: Date
    // _allDay?: boolean
    // _desc?: string,
    // _resourceId?: string
  ) {
    // this.allDay = _allDay || false;
    this.start = _start;
    this.end = _endDate;
    // this.desc = _desc || "";
    // this.resourceId = _resourceId;
  }
}

export default function InterviewerCalendar({ localizer }: Props) {
  const [events, setEvents] = React.useState([] as CalendarEvent[]);

  const handleSelect = ({
    start,
    end,
  }: {
    start: string | Date;
    end: string | Date;
  }): any => {
    let newEvent = {} as CalendarEvent;
    newEvent.start = moment(start).toDate();
    newEvent.end = moment(end).toDate();

    setEvents([...events, newEvent]);
  };

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    eventsToSave: CalendarEvent[]
  ): Promise<void> => {
    e.preventDefault();

    // const submitCalendarEvents = {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ events, user.uid }),
    // };

    // const response = await fetch("/", submitCalendarEvents);
    // const data = await response.json();
    // console.log(data);

    alert("events saved yay!");
    console.log(JSON.stringify(events));
  };

  return (
    <>
      <div>
        <Calendar
          selectable={true}
          localizer={localizer}
          events={events}
          defaultView="week"
          defaultDate={moment().toDate()}
          onSelectEvent={(event) => alert(event.start)}
          onSelectSlot={(slotInfo) => handleSelect(slotInfo)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          min={new Date(2020, 11, 3, 7, 0, 0, 0)}
          max={new Date(2020, 11, 3, 19, 0, 0, 0)}
        />
      </div>
      <div>
        <button onClick={(e) => handleClick(e, events)}>Save Changes</button>
      </div>
    </>
  );
}
