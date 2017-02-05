# hostapdjs

## Install

```bash
npm i https://github.com/deathslocus/hostapdjs
```

## Usage

```javascript
var hostapd = require('hostapdjs');

var host = new hostapd({
   interface: 'wlan0',
   ssid: 'MYNETWORK',
   wpa_passphrase: 'password' //Optional
});

host.updateConfig();
host.start();

```


