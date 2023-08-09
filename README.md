# PlusBot

An replica of Etsy's original plusbot.

## !! NOTE BEFORE PROCEEDING !!

I (@linzjax) have a confession to make. I did my best to get this set up with Primary specific login
information (faunadb, cloudflare, slack). However, I hit a blocker: cloudflare was returning a 302
error code for some reason, and I honestly couldn't spend anymore time on it.

As a result, all of this information lives in my personal accounts... I know I know I'm sorry.
However, if one day I've won the lottery and am off living my best life, please contact me and I
will do my best to work with you to transfer all of the records to whatever system works best
for y'all so that you don't lose the plus records.

Sincerly,
Lindsey

## Deploy

To push changes to Cloudflare

```
wrangler deploy
```

## Variables

### Secrets Needed

Found in the [PlusBots app Basic Settings](https://api.slack.com/apps/A05LY8Y7QTF/general)?

```
wrangler secret put SLACK_SIGNING_SECRET
```

Found here [PlusBots app OAuth Settings](https://api.slack.com/apps/A05LY8Y7QTF/oauth)?

```
wrangler secret put SLACK_BOT_ACCESS_TOKEN
```

Found in Eng 1Pass under the Fauna login credentials

```
wrangler secret put FAUNADB_SECRET
```

### Other Variables Needed

FAUNADB_ENDPOINT is set in the wrangler.toml

## Helpful Info

### Body for a slack request

```
{
  token: <token>,
  team_id: <id of the slack team>,
  team_domain: 'lindseysappfactory',
  channel_id: <id of the slack channel>,
  channel_name: 'random',
  user_id: <user id>,
  user_name: 'linzjax',
  command: '/++',
  text: '<@<user_id>|ljacks>',
  api_app_id: <api app id>,
  is_enterprise_install: 'false',
  response_url: <where to post the response to>,
  trigger_id: <trigger id string>
}
```

TODOs:

- [ ] Add companies if they don't exist
- [ ] Print out a help message if there's no user tagged in the message
- [ ] Provide a "list" option
- [ ] Add unit tests
- [ ] Clean up code
- [ ] Set up OAuth
- [ ] Prevent users from giving themselves plusses
- [ ] Rename "companies" "teams" to match slacks lingo

### Breadcrumbs

Things that I've learned along the way:

- @slack/web-api uses axios, which is incompatable with cloudflare workers.
- worktop, though convenient, does not use traditional request objects, so standard operations like `.clone()` are not available, making it incompatable with @sagi.io/workers-slack 's `verifyRequestSignature` function.
- Itty-router only parses requests that come in with application/json. Slack sends application/x-www-form-urlencoded
