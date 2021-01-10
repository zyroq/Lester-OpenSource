const { ShardingManager } = require('discord.js');
const config = require("./config.js");
require('events').EventEmitter.prototype._maxListeners = 100;


const manager = new ShardingManager('./bot.js', { 
  token: config.token,
  totalShards: 1
 });

manager.spawn(this.totalShards, 10000);
//test
manager.on('shardCreate', shard => console.log(`Chargement de l'instance : ${shard.id}`));