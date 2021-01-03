const { ShardingManager } = require('discord.js');
const botconfig = require("./botconfig.json");
require('events').EventEmitter.prototype._maxListeners = 100;


const manager = new ShardingManager('./bot.js', { 
  token: botconfig.token,
  totalShards: 1
 });

manager.spawn(this.totalShards, 10000);
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));