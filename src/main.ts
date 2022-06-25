import { Bot } from "grammy";
import { shellCommand, execute } from "linux-shell-command";

const token = process.env.BOT_TOKEN || "";
const myId = process.env.ADMIN_ID || ""
const bot = new Bot(token);

bot.command("start", (ctx) => {
  console.log("Launch start command")
  ctx.reply("👀 Nothing here for you... ")
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
  const command = ctx.match
  // console.log(command)
  if (ctx.from?.id === parseInt(myId)) {
    try {
      await execute(command).then(({ shellCommand: sc, success: success }) => {
        if (success === true) {
          console.log(sc.stdout);
          ctx.reply(">> " + command + ":\n" + sc.stdout);
          sc.kill()
        } else {
          console.error(sc.error);
        }
      }).catch(e => console.log(e))
    } catch (error) {
      console.error(error);
      ctx.reply(`<pre>${JSON.stringify(error)}</pre>`, { parse_mode: "HTML" });
    }
  }
})

bot.start();
console.log("BOT INICIADO");
bot.catch((err) => console.log(err));
