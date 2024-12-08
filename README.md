# #rate-my-ship bot

![image](https://cloud-2gkh9q6ki-hack-club-bot.vercel.app/0image.png)

This is a bot for the [#rate-my-ship Slack channel](https://hackclub.slack.com/archives/C08358F9XU6) (which you should totally join if you want feedback on your ships and more doubloons ;)) It makes sure that new ships are valid (with repo links), and also reminds people to review other people's ships too!

## Features

### Repo link detection

The bot currently supports repo links from the following hosts:

- GitHub
- GitLab
- BitBucket
- SourceHut
- [Hack Club's Gitea](https://h.hackclub.app)
- Codeberg

If a repo link is detected, then the bot doesn't nag you about providing a repo link:

![image](<https://cloud-ca4gft4q4-hack-club-bot.vercel.app/0image.png>)

### Automatic deployment

The bot is automatically deployed to Nest when a new update is pushed to GitHub.
