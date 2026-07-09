import { FirebaseOptions } from 'firebase/app';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAZBfOyC3NNTyjZufy_xWkjRXmK8U5gItA',
    authDomain: 'ionic-task-manager-9e74b.firebaseapp.com',
    projectId: 'ionic-task-manager-9e74b',
    storageBucket: 'ionic-task-manager-9e74b.firebasestorage.app',
    messagingSenderId: '899321451400',
    appId: '1:899321451400:web:e4bcbb11743529e85de03d',
    measurementId: 'G-XDDE6DYEY8',
  } satisfies FirebaseOptions,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
