import { z } from "zod";
const { App } = await import("@slack/bolt");

const Env = z.object({
  SLACK_BOT_TOKEN: z.string(),
  SLACK_SIGNING_SECRET: z.string(),
  SLACK_APP_TOKEN: z.string(),
});
const env = Env.parse(process.env);

const app = new App({
  token: env.SLACK_BOT_TOKEN,
  signingSecret: env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: env.SLACK_APP_TOKEN,
});

const REPO_DOMAINS = [
  "github.com",
  "gitlab.com",
  "bitbucket.org",
  "sourcehut.org",
  "sr.ht",
  "h.hackclub.com",
  "codeberg.org",
];
const URL_REGEX =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

app.message(async ({ message, client }) => {
  if (!message.subtype && !message.thread_ts) {
    let hasRepo = false;
    if (message.text) {
      const urls = message.text.match(URL_REGEX);
      if (urls) {
        for (const url of urls) {
          for (const domain of REPO_DOMAINS) {
            if (url.includes(domain)) {
              hasRepo = true;
              break;
            }
          }
        }
      }
    }

    const baseText = `Hey <@${message.user}>, thanks for posting your ship! If you haven't already, make sure to check out other people's ships too - it helps keep the whole thing going!`;
    let text = baseText;
    if (!hasRepo) {
      text = `${baseText}\n\nAlso, it looks like *you didn't include a link to your repo.* Make sure to add it so that people can check out your work!`;
    }

    await client.chat.postEphemeral({
      channel: message.channel,
      user: message.user,
      text,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Sure!",
                emoji: true,
              },
              value: message.ts,
              action_id: "delete_message",
            },
          ],
        },
      ],
    });
  }
});

app.action("delete_message", async ({ ack, respond }) => {
  await ack();
  await respond({
    response_type: "ephemeral",
    text: "",
    replace_original: true,
    delete_original: true,
  });
});

await app.start();

console.log("⚡️ And... we're off!");
