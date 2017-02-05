# hostapdjs

## Install

```bash
npm i https://github.com/deathslocus/hostapdjs
```

## Usage

```javascript
var hostapd = require('hostapdjs').default;

hostapd({
   interface: 'wlan0',
   ssid: 'MYNETWORK',
   wpa_passphrase: 'password' //Optional
});

```


