import { Bot } from "grammy";
import { shellCommand } from "linux-shell-command";

const token = process.env.BOT_TOKEN || "";
const bot = new Bot(token);

bot.command("start", (ctx) => ctx.reply("👀 Nothing here for you... "));

bot.command("ls", (ctx) => {
  const sc = shellCommand("ls");
  sc.events
    .on("pid", (pid) => {
      console.log(`The pid of the command is ${pid}`);
    })
    .on("stdout", (stdout) => {
      console.log(stdout.trim());
    })
    .on("stderr", (stderr) => {
      console.warn(stderr.trim());
    })
    .on("error", (e) => {
      console.error(e);
    })
    .on("exit", (exitStatus) => {
      console.log(`Exit status: ${exitStatus}`);
    });
  ctx.reply("📁 Listing files...");
});

bot.start();

bot.catch((err) => console.log(err));
