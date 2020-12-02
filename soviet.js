const { Client, Discord, MessageEmbed, Collection, WebhookClient } = require('discord.js');
const client = global.client = new Client({fetchAllMembers: true});
const qdb = require('quick.db');
const db = new qdb.table("ayarlar");
const fs = require("fs");
const conf = require("./ayarlar.json");
global.conf = conf; // guildMemberAdd, userUpdate gibi etkinliklerde işimiz kolaylaşsın.

const commands = new Map();
global.commands = commands;
const aliases = new Map();
global.aliases = aliases;
global.client = client;
fs.readdir("./Commands", (err, files) => {
    if(err) return console.error(err);
    files = files.filter(file => file.endsWith(".js"));
    console.log(`${files.length} komut yüklenecek.`);
    files.forEach(file => {
        let prop = require(`./Commands/${file}`);
        if(!prop.configuration) return;
        console.log(`${prop.configuration.name} komutu yükleniyor!`);
        if(typeof prop.onLoad === "function") prop.onLoad(client);
        commands.set(prop.configuration.name, prop);
        if(prop.configuration.aliases) prop.configuration.aliases.forEach(aliase => aliases.set(aliase, prop));
    });
});

fs.readdir("./Events", (err, files) => {
    if(err) return console.error(err);
    files.filter(file => file.endsWith(".js")).forEach(file => {
        let prop = require(`./Events/${file}`);
        if(!prop.configuration) return;
        client.on(prop.configuration.name, prop);
    });
});

client.emoji = function(x) {
  return client.emojis.cache.get(client.emojiler[x]);
};
const emoji = global.emoji;

const sayiEmojiler = {
  0: "",
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
  6: "",
  7: "",
  8: "",
  9: ""
};

client.emojiSayi = function(sayi) {
  var yeniMetin = "";
  var arr = Array.from(sayi);
  for (var x = 0; x < arr.length; x++) {
    yeniMetin += (sayiEmojiler[arr[x]] === "" ? arr[x] : sayiEmojiler[arr[x]]);
  }
  return yeniMetin;
};

client.emojiler = {
  onay: "emojiid",
  iptal: "emojiid",
  cevrimici: "emojiid",
  rahatsizetmeyin: "emojiid",
  bosta: "emojiid",
  gorunmez: "emojiid",
  erkekEmoji: "emojiid",
  kizEmoji: "emojiid",
  gif1: "emojiid",
  gif2: "emojiid",
  gif3: "emojiid",
  gif4: "emojiid"
};

global.emoji = client.emoji = function(x) {
  return client.emojis.cache.get(client.emojiler[x]);
};

Date.prototype.toTurkishFormatDate = function (format) {
  let date = this,
    day = date.getDate(),
    weekDay = date.getDay(),
    month = date.getMonth(),
    year = date.getFullYear(),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds();

  let monthNames = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
  let dayNames = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");

  if (!format) {
    format = "dd MM yyyy | hh:ii:ss";
  };
  format = format.replace("mm", month.toString().padStart(2, "0"));
  format = format.replace("MM", monthNames[month]);

  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy", year.toString());
  } else if (format.indexOf("yy") > -1) {
    format = format.replace("yy", year.toString().substr(2, 2));
  };

  format = format.replace("dd", day.toString().padStart(2, "0"));
  format = format.replace("DD", dayNames[weekDay]);

  if (format.indexOf("HH") > -1) format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
  if (format.indexOf("hh") > -1) {
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
  };
  if (format.indexOf("ii") > -1) format = format.replace("ii", minutes.toString().replace(/^(\d)$/, '0$1'));
  if (format.indexOf("ss") > -1) format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
  return format;
};

client.tarihHesapla = (date) => {
  const startedAt = Date.parse(date);
  var msecs = Math.abs(new Date() - startedAt);

  const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
  msecs -= years * 1000 * 60 * 60 * 24 * 365;
  const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
  msecs -= months * 1000 * 60 * 60 * 24 * 30;
  const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
  msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
  const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
  msecs -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(msecs / (1000 * 60 * 60));
  msecs -= hours * 1000 * 60 * 60;
  const mins = Math.floor((msecs / (1000 * 60)));
  msecs -= mins * 1000 * 60;
  const secs = Math.floor(msecs / 1000);
  msecs -= secs * 1000;

  var string = "";
  if (years > 0) string += `${years} yıl ${months} ay`
  else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
  else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
  else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
  else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
  else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
  else if (secs > 0) string += `${secs} saniye`
  else string += `saniyeler`;

  string = string.trim();
  return `\`${string} önce\``;
};

const {MessageEmbed}= require("discord.js");
const qdb = require("quick.db");
const jdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");

module.exports = async (member) => {
  let client = global.client;
  let ayarlar = ('../ayarlar.json') || {};
  let jaildekiler = ayarlar.jaildekiler || [];
  let tempjaildekiler = ayarlar.tempjaildekiler || [{id: null}];
  let muteliler = ayarlar.muteliler || [];
  let tempmute = ayarlar.tempmute || [{id: null}];
  let seslimute = ayarlar.seslimute || [{id: null}];
  let yasakTaglilar = ayarlar.yasakTaglilar || [];
  let guvenilirlik = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7;
  if (ayarlar.yasakTaglar && !ayarlar.yasakTaglar.some(tag => member.user.username.includes(tag)) && yasakTaglilar.some(x => x.includes(member.id))) await jdb.set('yasakTaglilar', yasakTaglilar.filter(x => !x.includes(member.id)));
  if(jaildekiler.some(x => x.includes(member.id)) || tempjaildekiler.some(x => x.id === member.id)){
    if(ayarlar.jailRolu) member.roles.set([ayarlar.jailRolu]).catch();
  } else if (ayarlar.yasakTaglar && ayarlar.yasakTaglar.some(tag => member.user.username.includes(tag))) {
    if(ayarlar.jailRolu) member.roles.set([ayarlar.jailRolu]).catch();
    if (!yasakTaglilar.some(id => id.includes(member.id))) jdb.push('yasakTaglilar', `y${member.id}`);
    member.send(`**${member.guild.name}** adlı sunucumuzun yasaklı taglarından birine sahip olduğun için jaile atıldın! Tagı bıraktığın zaman jailden çıkabilirsin.`).catch();
  } else if (guvenilirlik) {
    if(ayarlar.fakeHesapRolu) member.roles.set([ayarlar.fakeHesapRolu]).catch();
    if(ayarlar.fakeHesapLogKanali && member.guild.channels.cache.has(ayarlar.fakeHesapLogKanali)) return member.guild.channels.cache.get(ayarlar.teyitKanali).send(new MessageEmbed().setAuthor(member.guild.name, member.guild.iconURL({dynamic: true})).setDescription(`${member} üyesi sunucuya katıldı fakat hesabı ${member.client.tarihHesapla(member.user.createdAt)} açıldığı için jaile atıldı!`).setTimestamp().setFooter("YASHINU ❤️ ALOSHA"));
  } else if(ayarlar.teyitsizRolleri) member.roles.add(ayarlar.teyitsizRolleri).catch();
  if(tempmute.some(x => x.id === member.id) || muteliler.some(x => x.includes(member.id))) member.roles.add(ayarlar.muteRolu).catch();
  if(seslimute.some(x => x.id === member.id) && member.voice.channel) member.voice.setMute(true).catch();
  let embed = new MessageEmbed().setColor(member.client.randomColor())
  .setDescription(`
   **• Sunucuya hoş geldin ${member}, seninle \`${member.guild.memberCount}\` kişiyiz!**
   **• Yandaki Ses kanallarından birine girerek kayıt olabilirsin.**
   **• Seninle <@&rolid> , <@&rolid2> & <@&rolid3> ilgilenecektir.**
   **• Hesabın Açılış Süresi: ${member.client.tarihHesapla(member.user.createdAt)}**
   **• Hesap ${guvenilirlik ? "Güveli Değil" : "Güvenli"}**
  `)
  .setImage();
  if(ayarlar.ikinciTag) member.setNickname(`${ayarlar.ikinciTag} ${member.displayName}`).catch();
  else if(ayarlar.tag) member.setNickname(`${ayarlar.tag} ${member.displayName}`).catch();
  if (ayarlar.embedImage) embed.setImage(ayarlar.embedImage);
  if(ayarlar.teyitKanali && member.guild.channels.cache.has(ayarlar.teyitKanali)) member.guild.channels.cache.get(ayarlar.teyitKanali).send({ embed: embed });
}
module.exports.configuration = {
  name: "guildMemberAdd"
}

client.login(conf.token).then(console.log("Bot başarılı bir şekilde giriş yaptı.")).catch(err => console.error("Bot giriş yapamadı | Hata: " + err));
