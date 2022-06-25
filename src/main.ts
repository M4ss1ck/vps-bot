import { Bot } from "grammy";
import { shellCommand } from "linux-shell-command";

const token = process.env.BOT_TOKEN || "";
const bot = new Bot(token);

bot.command("start", (ctx) => ctx.reply("👀 Nothing here for you... "));

bot.command("ls", async (ctx) => {
  try {
    const sc = shellCommand("ls");
    await sc
      .execute()
      .then((success) => {
        if (success === true) {
          console.log(sc.stdout);
          ctx.reply("📁 Listing files...");
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
});

bot.start();
console.log("BOT INICIADO");
bot.catch((err) => console.log(err));
