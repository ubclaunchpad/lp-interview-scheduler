import { dataAccess } from "../data/dataAccess";

const sgMail = require("@sendgrid/mail");
var started = false;

export interface sendEmailBody {
  recipientEmail: string;
  message: string;
  subject: string;
}

export async function initModule() {
  if (started == true) {
    return;
  }
  const org_fields = await dataAccess.getOrganizationFields("launchpad").then();
  sgMail.setApiKey(org_fields["sendGridAPIKey"]);

  started = true;
}

async function checkInit() {
  if (started == false) {
    await initModule();
  }
}

export async function sendEmail(body: sendEmailBody) {
  await checkInit();
  const fromEmail = "strategy@ubclaunchpad.com";

  const msg = {
    to: body.recipientEmail, // Change to your recipient
    from: fromEmail, // Change to your verified sender
    subject: body.subject,
    text: body.message,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
