-- -------------------------------------------------------------
-- TablePlus 4.6.2(410)
--
-- https://tableplus.com/
--
-- Database: launch
-- Generation Time: 2022-03-27 17:33:47.6630
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."availability";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS interviewers_id_seq;

-- Table Definition
CREATE TABLE "public"."availability" (
    "id" int8 NOT NULL DEFAULT nextval('interviewers_id_seq'::regclass),
    "booked_by_email" text,
    "duration_mins" int2,
    "interviewer_uid" text,
    "is_booked" bool DEFAULT false,
    "start_time" text,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."event";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS event_id_seq;

-- Table Definition
CREATE TABLE "public"."event" (
    "id" int4 NOT NULL DEFAULT nextval('event_id_seq'::regclass),
    "confirmed_time" text,
    "event_length_mins" int2 DEFAULT 30,
    "uid" text,
    "expires" text,
    "interviewee_email" text,
    "leads" jsonb,
    "organization" text,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."interviewer";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS availability_id_seq;

-- Table Definition
CREATE TABLE "public"."interviewer" (
    "id" int4 NOT NULL DEFAULT nextval('availability_id_seq'::regclass),
    "email" text,
    "uid" text,
    "name" text,
    "organization" text,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."organization";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS interviewers_id_seq;

-- Table Definition
CREATE TABLE "public"."organization" (
    "id" int8 NOT NULL DEFAULT nextval('interviewers_id_seq'::regclass),
    "name" text,
    "availability_block_length" int2 DEFAULT 0,
    "availability_expiry_days" int2 DEFAULT 0,
    "client_id" text DEFAULT '0'::text,
    "client_secret" text,
    "hours_buffer" int2 DEFAULT 24,
    "refresh_token" text,
    PRIMARY KEY ("id")
);

INSERT INTO "public"."organization" ("id", "name", "availability_block_length", "availability_expiry_days", "client_id", "client_secret", "hours_buffer", "refresh_token") VALUES
(19, 'launchpad', 30, 10, '683209822932-3v58hpbtm5nm6g6k0burfo7mqcm6jlor.apps.googleusercontent.com', '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', 24, '1//04P2zzHI6Y-IeCgYIARAAGAQSNwF-L9Ir2SWOUs1cQ1ThxXDEHaqO_1A4uZT58g_zXMJ83bL299ma2W_NSxNj1TiXz_WA7_qgDG4');

