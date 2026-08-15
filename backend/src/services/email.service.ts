import transporter from "../config/email.js";

interface SendInvitationEmailInput {
  email: string;
  name: string;
  invitationToken: string;
}

export const sendResidentInvitationEmail = async ({
  email,
  name,
  invitationToken,
}: SendInvitationEmailInput) => {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    "http://localhost:3000";

  const invitationLink =
    `${frontendUrl}/accept-invitation?token=${invitationToken}`;

  await transporter.sendMail({
    from:
      process.env.EMAIL_FROM ||
      process.env.SMTP_USER,

    to: email,

    subject:
      "You're invited to Society Manager",

    text: `
Hello ${name},

You have been invited to join your society on Society Manager.

Please use the following link to activate your account:

${invitationLink}

This invitation will expire in 24 hours.

If you did not expect this invitation, you can safely ignore this email.

Regards,
Society Manager
    `,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 30px;
      ">
        <h2>Welcome to Society Manager</h2>

        <p>
          Hello <strong>${name}</strong>,
        </p>

        <p>
          You have been invited to join your society
          on Society Manager.
        </p>

        <p>
          Click the button below to activate your
          account and create your password.
        </p>

        <div style="margin: 30px 0;">
          <a
            href="${invitationLink}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Activate Account
          </a>
        </div>

        <p>
          This invitation will expire in
          <strong>24 hours</strong>.
        </p>

        <p>
          If you did not expect this invitation,
          you can safely ignore this email.
        </p>

        <p>
          Regards,<br />
          Society Manager
        </p>
      </div>
    `,
  });
};