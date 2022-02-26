import { oauth2 } from "googleapis/build/src/apis/oauth2";

const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
  "683209822932-3v58hpbtm5nm6g6k0burfo7mqcm6jlor.apps.googleusercontent.com",
  "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"
);

oAuth2Client.setCredentials({
  refresh_token:
    "1//04llkE1qE_S0qCgYIARAAGAQSNwF-L9IrMGbIe-TSRtcdNIBefrklbA2vUOzqznFt4Tua54IJraXDMUlxGswsJ1i1zHpijGmMnbg",
});

const CALENDAR_ID = "si32mh0s0b5k32oipldq05hsq0@group.calendar.google.com";
const calendar = google.calendar({ version: "v3", oAuth2Client });

const eventStartTime = new Date();
eventStartTime.setDate(eventStartTime.getDay() + 25);

const eventEndTime = new Date();
eventEndTime.setDate(eventEndTime.getDay() + 25);
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);

const calendarEvent = {
  summary: "Meet with jimmy",
  location: "Some location",
  description: "Meeting",
  start: {
    dateTime: eventStartTime,
    timeZone: "Canada/Pacific",
  },
  end: {
    dateTime: eventEndTime,
    timeZone: "Canada/Pacific",
  },
  colorId: 1,
  attendees: [
    {
      email: "jink8036@gmail.com",
    },
  ],
};

export function insertTest() {
  calendar.events.insert(
    {
      auth: oAuth2Client,
      calendarId: "primary",
      resource: calendarEvent,
      sendUpdates: "all",
    },
    function (err, event) {
      if (err) {
        console.log("ERROR: " + err);
        return;
      }
      console.log(event);
    }
  );
}
