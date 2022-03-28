import { formatISO, sub } from "date-fns";
import knex from "knex";
import { Availability, Interviewer, OrganizationFields, Event } from "./models";

const database = knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "development",
    password: "development",
    database: "launch",
  },
});

enum Table {
  organization = "organization",
  interviewer = "interviewer",
  availability = "availability",
  event = "event",
}

enum OrganizationColumns {
  id = "id",
  name = "name",
  availabilityBlockLength = "availability_block_length",
  availabilityExpiryDays = "availability_expiry_days",
  clientID = "client_id",
  clientSecret = "client_secret",
  hoursBuffer = "hours_buffer",
  refreshToken = "refresh_token",
}

enum InterviewerColumns {
  id = "id",
  email = "email",
  interviewerUID = "uid",
  name = "name",
  organization = "organization",
}

enum AvailabilityColumns {
  id = "id",
  bookedByEmail = "booked_by_email",
  durationMins = "duration_mins",
  interviewerUID = "interviewer_uid",
  isBooked = "is_booked",
  startTime = "start_time",
}

enum EventColumns {
  id = "id",
  confirmedTime = "confirmed_time",
  eventLengthMins = "event_length_mins",
  eventUID = "uid",
  expires = "expires",
  intervieweeEmail = "interviewee_email",
  leads = "leads",
  organization = "organization",
}

export async function listTables() {
  const tables = await database
    .select()
    .from("pg_catalog.pg_tables")
    .where("schemaname", "!=", "pg_catalog")
    .andWhere("schemaname", "!=", "information_schema");
  return tables;
}

export async function checkOrganizationExists(
  organization: string
): Promise<boolean> {
  try {
    const res = await database.first(
      database.raw(
        "exists ? as present",
        database(Table.organization)
          .select(OrganizationColumns.id)
          .where(OrganizationColumns.name, "=", organization)
          .limit(1)
      )
    );

    return (res as any).present;
  } catch (error) {
    throw new Error("Unable to determine if given organization exists");
  }
}

export async function checkInterviewerExists(
  interviewer: Interviewer
): Promise<boolean> {
  try {
    const res = await database.first(
      database.raw(
        "exists ? as present",
        database(Table.interviewer)
          .select(InterviewerColumns.id)
          .where(
            InterviewerColumns.interviewerUID,
            "=",
            interviewer.interviewerUID
          )
          .limit(1)
      )
    );

    return (res as any).present;
  } catch (error) {
    throw new Error("Unable to determine if given interviewer exists");
  }
}

export async function getOrganizationExpiry(
  organization: string
): Promise<number> {
  try {
    const res = await database(Table.organization)
      .select(OrganizationColumns.availabilityExpiryDays)
      .where(OrganizationColumns.name, "=", organization)
      .limit(1);

    const organizationData = res[0];
    return organizationData[OrganizationColumns.availabilityExpiryDays];
  } catch (error) {
    throw new Error("Unable to retrieve organization expiry date");
  }
}

export async function getOrganizationFields(
  organization: string
): Promise<OrganizationFields | null> {
  try {
    const res = await database(Table.organization)
      .select()
      .where(OrganizationColumns.name, "=", organization)
      .limit(1);

    if (!res.length) {
      logRecoverableError("No organizations returned");
      return;
    }

    const organizationData = res[0];
    const organizationFields: OrganizationFields = {
      availabilityBlockLength:
        organizationData[OrganizationColumns.availabilityBlockLength],
      client_id: organizationData[OrganizationColumns.clientID],
      client_secret: organizationData[OrganizationColumns.clientSecret],
      availabilityExpiryDays:
        organizationData[OrganizationColumns.availabilityExpiryDays],
      hoursBuffer: organizationData[OrganizationColumns.hoursBuffer],
      refresh_token: organizationData[OrganizationColumns.refreshToken],
    };

    return organizationFields;
  } catch (error) {
    throw new Error("Unable to retrieve organization expiry date");
  }
}

export async function getInterviewer(
  interviewerUID: string
): Promise<Interviewer | null> {
  try {
    const res = await database(Table.interviewer)
      .select()
      .where(InterviewerColumns.interviewerUID, "=", interviewerUID)
      .limit(1);

    if (!res.length) {
      return null;
    }

    const interviewerData = res[0];
    const interviewer: Interviewer = {
      organization: interviewerData[InterviewerColumns.organization],
      interviewerUID: interviewerData[InterviewerColumns.interviewerUID],
      email: interviewerData[InterviewerColumns.email],
      name: interviewerData[InterviewerColumns.name],
    };

    return interviewer;
  } catch (error) {
    throw new Error("Unable to retrieve given interviewer");
  }
}

export async function setInterviewer(interviewer: Interviewer): Promise<void> {
  try {
    const orgExists = await checkOrganizationExists(interviewer.organization);

    if (!orgExists) {
      logRecoverableError(
        `Organization "${interviewer.organization}" does not exist in database`
      );
      return;
    }

    const interviewerExists = await checkInterviewerExists(interviewer);

    if (interviewerExists) {
      logRecoverableError("Duplicate interviewer already exists in database");
      return;
    }

    await database(Table.interviewer).insert({
      [InterviewerColumns.organization]: interviewer.organization,
      [InterviewerColumns.interviewerUID]: interviewer.interviewerUID,
      [InterviewerColumns.email]: interviewer.email,
      [InterviewerColumns.name]: interviewer.name,
    });
  } catch (error) {
    throw new Error("Unable to create interviewer");
  }
}

export async function listInterviewers(
  organization: string
): Promise<Interviewer[]> {
  try {
    const res = await database(Table.interviewer)
      .select()
      .where(InterviewerColumns.organization, "=", organization);

    const interviewers: Interviewer[] = [];
    for (const interviewerData of res) {
      const interviewer: Interviewer = {
        organization: interviewerData[InterviewerColumns.organization],
        interviewerUID: interviewerData[InterviewerColumns.interviewerUID],
        email: interviewerData[InterviewerColumns.email],
        name: interviewerData[InterviewerColumns.name],
      };

      interviewers.push(interviewer);
    }

    return interviewers;
  } catch (error) {
    throw new Error("Unable to retrieve all interviewers for organization");
  }
}

export async function setAvailability(
  availability: Availability
): Promise<void> {
  try {
    const availabilityExists = await getAvailability(
      availability.interviewerUID,
      availability.startTime
    );

    if (!!availabilityExists) {
      logRecoverableError(
        "Interviewer availability with same start time already present in database"
      );
      return;
    }

    await database(Table.availability).insert({
      [AvailabilityColumns.interviewerUID]: availability.interviewerUID,
      [AvailabilityColumns.startTime]: availability.startTime,
      [AvailabilityColumns.isBooked]: availability.isBooked,
      [AvailabilityColumns.bookedByEmail]: availability.bookedByEmail,
      [AvailabilityColumns.durationMins]: availability.durationMins,
    });
  } catch (error) {
    throw new Error("unable to set availability");
  }
}

export async function getAvailability(
  interviewerUID: string,
  startTime: string
): Promise<Availability | null> {
  try {
    const res = await database(Table.availability)
      .select()
      .where(AvailabilityColumns.interviewerUID, "=", interviewerUID)
      .andWhere(AvailabilityColumns.startTime, "=", startTime)
      .limit(1);

    if (!res.length) {
      return null;
    }

    const availabilityData = res[0];
    const availability: Availability = {
      interviewerUID: availabilityData[AvailabilityColumns.interviewerUID],
      startTime: availabilityData[AvailabilityColumns.startTime],
      isBooked: availabilityData[AvailabilityColumns.isBooked],
      bookedByEmail: availabilityData[AvailabilityColumns.bookedByEmail],
      durationMins: availabilityData[AvailabilityColumns.durationMins],
    };

    return availability;
  } catch (error) {
    throw new Error("Unable to retrieve availability for given interviewer");
  }
}

export async function getAllAvailabilities(
  interviewerUID: string
): Promise<Availability[]> {
  try {
    const res = await database(Table.availability)
      .select()
      .where(AvailabilityColumns.interviewerUID, "=", interviewerUID);

    const availabilities: Availability[] = [];
    for (const availabilityData of res) {
      const availability: Availability = {
        interviewerUID: availabilityData[AvailabilityColumns.interviewerUID],
        startTime: availabilityData[AvailabilityColumns.startTime],
        isBooked: availabilityData[AvailabilityColumns.isBooked],
        bookedByEmail: availabilityData[AvailabilityColumns.bookedByEmail],
        durationMins: availabilityData[AvailabilityColumns.durationMins],
      };

      availabilities.push(availability);
    }

    return availabilities;
  } catch (error) {
    throw new Error("Unable to retrieve availabilities for given interviewer");
  }
}

export async function deleteExpiredAvailabilities(
  organization: string,
  interviewerUID: string
): Promise<void> {
  try {
    const today: Date = new Date();
    const availabilityExpiryDays = await getOrganizationExpiry(organization);

    const validFromDate: Date = sub(today, { days: availabilityExpiryDays });

    const deleteRes = await database(Table.availability)
      .where(AvailabilityColumns.startTime, "<", formatISO(validFromDate))
      .andWhere(AvailabilityColumns.interviewerUID, "=", interviewerUID)
      .delete();

    if (deleteRes === 0) {
      log(
        "No expired availabilities found to delete... returning unaltered availabilities"
      );
    }
  } catch (error) {
    throw new Error("Unable to delete expired availabilities");
  }
}

export async function deleteAvailabilityCollection(
  interviewerUID: string
): Promise<void> {
  try {
    const res = await database(Table.availability)
      .where(AvailabilityColumns.interviewerUID, "=", interviewerUID)
      .delete();

    if (res === 0) {
      log("No availabilities found to delete");
    }
  } catch (error) {
    throw new Error("Unable to delete interviewer availabilities");
  }
}

export async function setEvent(event: Event, organization: string) {
  try {
    const organizationExists = await checkOrganizationExists(organization);
    if (!organizationExists) {
      logRecoverableError("organization does not exist");
      return;
    }

    const eventExists = await getEvent(event.eventUID);
    if (!!eventExists) {
      logRecoverableError("event with same UID already exists in database");
      return;
    }

    await database(Table.event).insert({
      [EventColumns.confirmedTime]: event.confirmedTime,
      [EventColumns.eventLengthMins]: event.eventLengthInMinutes,
      [EventColumns.eventUID]: event.eventUID,
      [EventColumns.expires]: event.expires,
      [EventColumns.intervieweeEmail]: event.intervieweeEmail,
      [EventColumns.leads]: JSON.stringify(event.leads),
      [EventColumns.organization]: organization,
    });
  } catch (error) {
    throw new Error("Unable to create event");
  }
}

export async function getEvent(eventUID: string): Promise<Event | null> {
  try {
    const res = await database(Table.event)
      .select()
      .where(EventColumns.eventUID, "=", eventUID)
      .limit(1);
    const eventData = res[0];

    if (!res.length) {
      logRecoverableError("No event exists with given eventUID");
      return;
    }

    const event: Event = {
      leads: eventData[EventColumns.leads],
      intervieweeEmail: eventData[EventColumns.intervieweeEmail],
      confirmedTime: eventData[EventColumns.confirmedTime],
      eventLengthInMinutes: eventData[EventColumns.eventLengthMins],
      expires: eventData[EventColumns.expires],
      eventUID: eventData[EventColumns.eventUID],
    };

    return event;
  } catch (error) {
    throw new Error("Unable to retrieve event with given eventUID");
  }
}

export async function listEvents(organization: string) {
  try {
    const res = await database(Table.event)
      .select()
      .where(EventColumns.organization, "=", organization);

    const events: Event[] = [];
    for (const eventData of res) {
      const event: Event = {
        leads: eventData[EventColumns.leads],
        intervieweeEmail: eventData[EventColumns.intervieweeEmail],
        confirmedTime: eventData[EventColumns.confirmedTime],
        eventLengthInMinutes: eventData[EventColumns.eventLengthMins],
        expires: eventData[EventColumns.expires],
        eventUID: eventData[EventColumns.eventUID],
      };

      events.push(event);
    }

    return events;
  } catch (error) {
    throw new Error("Unable to retrieve events for organization");
  }
}

export async function bookInterview(
  interviewerUIDs: string[],
  timesToBook: string[],
  eventUID: string,
  startTime: string
): Promise<Event> {
  try {
    const transactionRes = await database.transaction(async (trx) => {
      // returns true if availability exists
      const verifyAvailability = async (
        interviewerUID: string,
        startTime: string
      ): Promise<boolean> => {
        const res = await trx.first(
          database.raw(
            "exists ? as present",
            database(Table.availability)
              .select("id")
              .where(AvailabilityColumns.interviewerUID, "=", interviewerUID)
              .andWhere(AvailabilityColumns.startTime, "=", startTime)
              .limit(1)
          )
        );

        return (res as any)?.present;
      };

      // sets isBooked to true for availability
      const bookAvailability = async (
        interviewerUID: string,
        startTime: string
      ): Promise<void> => {
        await trx(Table.availability)
          .update({ [AvailabilityColumns.isBooked]: true })
          .where(AvailabilityColumns.interviewerUID, "=", interviewerUID)
          .andWhere(AvailabilityColumns.startTime, "=", startTime);
      };

      // sets confirmedTime for event and returns the updated event
      const bookEvent = async (
        eventUID: string,
        startTime: string
      ): Promise<Event> => {
        const updateRes = await trx(Table.event)
          .update({ [EventColumns.confirmedTime]: startTime })
          .where(EventColumns.eventUID, "=", eventUID)
          .whereNull(EventColumns.confirmedTime);

        const res = await trx(Table.event)
          .where(EventColumns.eventUID, "=", eventUID)
          .limit(1);

        const eventData = res[0];
        const event: Event = {
          leads: eventData[EventColumns.leads],
          intervieweeEmail: eventData[EventColumns.intervieweeEmail],
          confirmedTime: eventData[EventColumns.confirmedTime],
          eventLengthInMinutes: eventData[EventColumns.eventLengthMins],
          expires: eventData[EventColumns.expires],
          eventUID: eventData[EventColumns.eventUID],
        };

        return event;
      };

      for (const interviewerUID of interviewerUIDs) {
        for (const startTime of timesToBook) {
          // ensure availability exists
          const availabilityPresent = await verifyAvailability(
            interviewerUID,
            startTime
          );

          if (availabilityPresent) {
            // if it exists, set isBooked to true
            await bookAvailability(interviewerUID, startTime);
          }
        }
      }

      // book everything
      const bookedEvent = await bookEvent(eventUID, startTime);

      // run the transaction
      await trx.commit();

      return bookedEvent;
    });

    return transactionRes;
  } catch (error) {
    throw new Error(`unable to book event with id: ${eventUID}`);
  }
}

// internal helpers
function logRecoverableError(error: string) {
  console.error(`[db_error]: ${error}`);
}

function log(log: string) {
  console.log(`[db_log]: ${log}`);
}
