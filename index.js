"use strict";
var pathExists = require("path-exists");
var fs = require("fs");
var json_add_1 = require("json-add");
var exec = require("child_process").exec;
var initd = require('initd');

function Hostapdjs(options){
   this.options = options; 

   var config = {
      path: '/etc/hostapd/hostapd.conf',
      driver: 'nl80211',
      hw_mode: 'g',
      channel: 2,
      macaddr_acl: 0,
      auth_algs: 1,
      ignore_broadcast_ssid: 0,
      test: false
  };

  if (options.wpa_passphrase) {
      var wpa_standard = {
          wpa: 2,
          wpa_key_mgmt: 'WPA-PSK',
          wpa_pairwise: 'TKIP',
          rsn_pairwise: 'CCMP'
      };
      json_add_1.default(config, wpa_standard);
  }
  json_add_1.default(config, options);
  
  if (!config.test) {
      fs.writeFileSync('/etc/default/hostapd', 'DAEMON_CONF="' + config.path + '"', 'utf-8');
  }

  fs.writeFileSync(config.path, parseConfig(config), 'utf-8');
  this.config = config;
}

Hostapdjs.prototype.start = function(){
   initd.restart('hostapd').on('close', function(code){
      if(code !== 0) return console.log("Hostapd failed to restart");
      console.log("Hostapd restarted");
   });
}

Hostapdjs.prototype.stop = function(){
   initd.stop('hostapd').on('close', function(code){
      if(code !== 0) return console.log("Hostapd failed to stop");
      console.log("Hostapd stopped");
   });
}

var parseConfig = function(config){
   var write = '';
   for(var k in config){
      if(k !== 'path' && k !== 'test'){
         write += k + '=' + config[k] + '\n';       
      }
   }
   return write;
}

module.exports = Hostapdjs;
