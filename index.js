"use strict";
var pathExists = require("path-exists");
var fs = require("fs");
var json_add_1 = require("json-add");
var Promise = require("bluebird");
var exec = require("child_process").exec;

function Hostapdjs(options){
   this.options = options;
}

Hostapdjs.prototype.updateConfig = function(){ 
  var options = this.options;

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

var parseHostapdBlock = function(log){
	var bits = log.split('\n');
	console.log(bits);
}

Hostapdjs.prototype.start = function(){
  var command = [
	  'hostapd',
	  '-B',
	  this.config.path
  ].join(' ');
  console.log(command);
  exec(command, function(err, stdout, stderr){
	  console.log(stdout);
	  console.log(stderr);
	  console.log(err);
	var log = parseHostapdBlock(stdout);
  });
}

Hostapdjs.prototype.stop = function(){

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
