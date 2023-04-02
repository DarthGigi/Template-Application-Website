import { DiscordAPIBase } from '../oauth/discord';
import { BOT_TOKEN } from '$env/static/private';
import { PUBLIC_SIRIUS_APPLICATION_ACCEPTED_LOG_ID, PUBLIC_SIRIUS_APPLICATION_REJECTED_LOG_ID, PUBLIC_SIRIUS_GUILD_ID } from '$env/static/public';
import type { DiscordUser } from '../types/database';
import type { APIDMChannel } from 'discord-api-types/v10';
import type { Application } from '$lib/types/application';

export const DiscordBotBase = DiscordAPIBase + 'v10/';

async function makeDiscordAPIRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: unknown, headers?: Record<string, unknown>) {
  // Reference the above fetch example
  const options = {
    method: method,
    headers: {
      Authorization: 'Bot ' + BOT_TOKEN,
      ...headers
    }
  };
  if (body) {
    // @ts-expect-error we don't care what the body is
    options['body'] = body;
  }

  return fetch(DiscordBotBase + endpoint, options);
}

export async function addUserAcceptedRole(userID: string, roleID: string, reason: string) {
  return await makeDiscordAPIRequest(`guilds/${PUBLIC_SIRIUS_GUILD_ID}/members/${userID}/roles/${roleID}`, 'PUT', undefined, { 'X-Audit-Log-Reason': reason });
}

export async function sendAcceptLog(user: DiscordUser, application: Application) {
  // dm user
  const dm: APIDMChannel = await (await makeDiscordAPIRequest('users/@me/channels', 'POST', `{"recipient_id":"${user.User.id}"}`, { 'Content-Type': 'application/json' })).json();
  await makeDiscordAPIRequest(`channels/${dm.id}/messages`, 'POST', '{"embeds":[{"title":"<:Sirius:1056924373648429096>  Application Accepted","description":"Your application has been accepted! Welcome to the team!","color":2829617}]}', { 'Content-Type': 'application/json' });
  await makeDiscordAPIRequest(`channels/${PUBLIC_SIRIUS_APPLICATION_ACCEPTED_LOG_ID}/messages`, 'POST', `{"embeds":[{"fields":[],"title":"Welcome ${application.name}!","description":"Welcome to the team <@${application.discord?.User.id}>! We are glad that you joined us!\\n\\nPlease take a look at the support documentation in order to understand what your job is.","color":2829617}],"components":[{"type":1,"components":[{"type":2,"label":"Support Documentation","style":5,"url":"https://docs.google.com/document/d/1SLvDAPQrkBBhN6vIK8XSKNW-N7PBKJeL5XWE07iQtsI/edit#"}]}],"content":"<@${application.discord?.User.id}>"}`, { 'Content-Type': 'application/json' });
}

export async function sendDenyLog(user: DiscordUser) {
  const dm: APIDMChannel = await (await makeDiscordAPIRequest('users/@me/channels', 'POST', `{"recipient_id":"${user.User.id}"}`, { 'Content-Type': 'application/json' })).json();
  await makeDiscordAPIRequest(`channels/${dm.id}/messages`, 'POST', `"embeds":[{"title":"<:Sirius:1056924373648429096> Application Denied","description":"Your application has been denied. Due to our privacy policy, we may not disclose the reason for the denial. You may reapply <t:${Math.floor(Date.now() / 1000) + 1209600}:R>","color":2829617}]`, { 'Content-Type': 'application/json' });
  // shlex told me to remove :heart:
  //await makeDiscordAPIRequest(`channels/${PUBLIC_SIRIUS_APPLICATION_REJECTED_LOG_ID}/messages`, 'POST', `{"embeds":[{"fields":[],"title":"Application Denied!","description":"HAHAHAHAHAHAH <@${application.discord?.User.id}> has been denied! WHAT A LOSER LMAOOOOO <a:pepeLaugh:939964833879711775>","color":2829617}],"content":"<@${application.discord?.User.id}>"}`, { 'Content-Type': 'application/json' });
}
