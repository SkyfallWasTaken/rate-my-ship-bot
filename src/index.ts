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

app.message(async ({ message, client }) => {
  if (!message.subtype && !message.thread_ts) {
    const text = `Hey <@${message.user}>, thanks for posting your ship! If you haven't already, make sure to check out other people's ships too - it helps keep the whole thing going!`;

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
