TropiBus is an application that enables user view the routes and bus stops of the buses in the Municipality of Mayaguez.
It also enables users to view if buses are active on any routes.

## How to use this project
Make sure you have ionic 2 and cordova installed by running:
```bash
$ npm install -g ionic cordova
```

To install the git project pull the repository from  git using:
```bash
$ git clone https://github.com/Wilfredo12/TropiBusTracker2.0.git
```

Then install the Ionic 2 geolocation and background geolocation plugins by running:
```bash
$ ionic cordova plugin add cordova-plugin-geolocation
$ npm install --save @ionic-native/geolocation
$ ionic cordova plugin add cordova-plugin-mauron85-background-geolocation
$ npm install --save @ionic-native/background-geolocation
```
Finally install the Leaflet map libraries on your project by running:
```bash
$ npm install leaflet --save
$ npm install @types/leaflet --save
```

After this you are ready to go!
