import { env } from '../../config/env.js';

export const inviteEmailTemplate = (name, token, role, batchName = null) => {
  const acceptUrl = `${env.clientUrl}/accept-invite/${token}`;

  let contextHtml = '';
  if (role === 'student' && batchName) {
    contextHtml = `<p>You have been assigned to the batch: <strong>${batchName}</strong>.</p>`;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1E2126;">
      <h1 style="color: #E8391D;">Welcome to Staxhaus</h1>
      <p>Hello ${name},</p>
      <p>You have been invited to join the Staxhaus Institute Management Application as a <strong>${role}</strong>.</p>
      ${contextHtml}
      <p>Click the button below to accept your invitation and set up your account.</p>
      <div style="margin: 30px 0;">
        <a href="${acceptUrl}" style="background-color: #E8391D; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 24px; font-weight: bold; display: inline-block;">
          Accept Invitation
        </a>
      </div>
      <p>This invitation will expire in ${env.jwt.inviteExpiresDays} days.</p>
      <hr style="border: 0; border-top: 1px solid #929292; margin: 30px 0; opacity: 0.3;" />
      <p style="color: #929292; font-size: 12px; font-family: monospace;">&lt;/the school of experience&gt;</p>
    </div>
  `;
};
