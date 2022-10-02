import { Telegraf, Markup } from "telegraf";
import { shellCommand, execute } from "linux-shell-command";

const token = process.env.BOT_TOKEN || "";
const myId = process.env.ADMIN_ID || "";
const bot = new Telegraf(token);

bot.command("start", (ctx) => {
  console.log("Launch start command");
  ctx.reply("👀 Nothing here for you... ");
});

bot.command("ls", async (ctx) => {
  if (ctx.from?.id === parseInt(myId)) {
    try {
      const sc = shellCommand("ls");
      await sc
        .execute()
        .then((success) => {
          if (success === true) {
            console.log(sc.stdout);
            ctx.reply("📁 Listing files...\n" + sc.stdout);
          } else {
            console.error(sc.error);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (error) {
      console.error(error);
      ctx.reply(`<pre>${JSON.stringify(error)}</pre>`, { parse_mode: "HTML" });
    }
  }
});

bot.command("sh", async (ctx) => {
  const command = ctx.message.text.replace("/sh ", "");
  // console.log(command)
  if (ctx.from?.id === parseInt(myId)) {
    try {
      await execute(command)
        .then(({ shellCommand: sc, success: success }) => {
          if (success === true) {
            console.log(sc.stdout);
            ctx.reply(">> " + command + ":\n" + sc.stdout);
            sc.kill();
          } else {
            console.error(sc.error);
          }
        })
        .catch((e) => console.log(e));
    } catch (error) {
      console.error(error);
      ctx.reply(`<pre>${JSON.stringify(error)}</pre>`, { parse_mode: "HTML" });
    }
  }
});

bot.launch(process.env.WEBHOOK === 'ON' && process.env.DOMAIN ? {
  webhook: {
    domain: process.env.DOMAIN,
  }
} : {});
console.log("BOT INICIADO");

// Enable graceful stop
process.once("SIGINT", () => {
  bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
});
