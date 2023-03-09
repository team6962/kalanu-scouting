import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyBzOfwXD-vCQWWCGFWREZAqyqKaPiAEQoo',
	authDomain: 'kalanu-scout.firebaseapp.com',
	projectId: 'kalanu-scout',
	storageBucket: 'kalanu-scout.appspot.com',
	messagingSenderId: '98676256275',
	appId: '1:98676256275:web:22396ae506dfbdc73a99e6'
};

export const firebase = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebase);
