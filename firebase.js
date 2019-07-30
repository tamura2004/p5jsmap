firebase.initializeApp({
  apiKey: 'AIzaSyANamGza96l_HKbG-hsw73WvCFxNv_I_YY',
  authDomain: 'dd5tools.firebaseapp.com',
  databaseURL: 'https://dd5tools.firebaseio.com',
  projectId: 'dd5tools',
  storageBucket: 'dd5tools.appspot.com',
  messagingSenderId: '1096592466642',
});

const db = firebase.firestore();

// --- SEED
// const date = new Date();

// db.collection('units').get().then((q) => {
//   q.forEach((doc) => {
//     console.log(doc.data());
//   });
// });

// for (let i = 0; i < 1; i++) {
//   const monster = {
//     name: `${i}`,
//     type: "SPELL",
//     index: i,
//     x: 1,
//     y: 1,
//     hp: 100,
//     damage: 0,
//     visible: true,
//     updatedAt: date,
//   };

//   db.collection('units').add(monster)
//   .then((doc) => console.log(doc.id))
//   .catch((err) => console.log(err));
// }

// for (let i = 0; i < 15; i++) {
//   const monster = {
//     name: `${i}`,
//     type: "MONSTER",
//     index: i,
//     x: i % 5 + 2,
//     y: Math.floor(i / 5) + 2,
//     hp: 100,
//     damage: 0,
//     visible: true,
//     updatedAt: date,
//   };
//   db.collection('units').add(monster)
//   .then((doc) => console.log(doc.id))
//   .catch((err) => console.log(err));
// }
