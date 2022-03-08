import { dataAccess } from "../data/dataAccess";
import { getInterviewer } from "./interviewerController";

const { google } = require("googleapis");
const { OAuth2 } = google.auth;

var oAuth2Client = null;
var calendar = null;

export async function initModule() {
  if (calendar != null || oAuth2Client != null) {
    return;
  }
  const org_fields = await dataAccess.getOrganizationFields("launchpad").then();
  oAuth2Client = new OAuth2(
    org_fields["client_id"],
    org_fields["client_secret"]
  );

  oAuth2Client.setCredentials({
    refresh_token: org_fields["refresh_token"],
  });
  calendar = google.calendar({ version: "v3", oAuth2Client });
}

async function checkInit() {
  if (calendar == null || oAuth2Client == null) {
    await initModule();
  }
}

export async function createGoogleCalendarEvent(body: CreateCalendarEventBody) {
  await checkInit;

  var attendees = [];

  attendees.push(body.intervieweeEmail);
  for (let interviewer of body.interviewerUUIDs) {
    var i = await getInterviewer(body.organization, interviewer);
    attendees.push({
      email: i.email,
    });
  }

  var startDate = Date.parse(body.startTime);
  var endDate = Date.parse(body.endTime);

  const calendarEvent = {
    summary: "UBC Launchpad Interview",
    description: "Intake interview placeholder description",
    start: {
      dateTime: startDate,
      timeZone: "Canada/Pacific",
    },
    end: {
      dateTime: endDate,
      timeZone: "Canada/Pacific",
    },
    colorId: 1,
    attendees: attendees,
  };

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
        return err;
      }
      return null;
    }
  );
}

export interface CreateCalendarEventBody {
  organization: string;
  startTime: string;
  endTime: string;
  intervieweeEmail: string;
  interviewerUUIDs: string[];
}
