import React from "react";
import { Calendar, DateLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.

interface Props {
  localizer: DateLocalizer;
}

class CalendarEvent {
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  desc: string;
  resourceId?: string;
  tooltip?: string;

  constructor(
    _title: string,
    _start: Date,
    _endDate: Date,
    _allDay?: boolean,
    _desc?: string,
    _resourceId?: string
  ) {
    this.title = _title;
    this.allDay = _allDay || false;
    this.start = _start;
    this.end = _endDate;
    this.desc = _desc || "";
    this.resourceId = _resourceId;
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
    const title = window.prompt("New Event name");

    if (title) {
      let newEvent = {} as CalendarEvent;
      newEvent.start = moment(start).toDate();
      newEvent.end = moment(end).toDate();
      newEvent.title = title;

      setEvents([...events, newEvent]);
    }
  };

  return (
    <div>
      <Calendar
        selectable
        localizer={localizer}
        events={events}
        defaultView="week"
        defaultDate={moment().toDate()}
        onSelectEvent={(event) => alert(event.title)}
        onSelectSlot={(slotInfo) => handleSelect(slotInfo)}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: 700 }}
      />
    </div>
  );
}
