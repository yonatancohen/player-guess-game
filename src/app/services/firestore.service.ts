import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    constructor(private firestore: Firestore) { }

    async setDocTimestamp(gameNumber: number, fbId: string) {
        const docRef = doc(this.firestore, 'timestamps', `game_${gameNumber}_user_${fbId}`);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                game_number: gameNumber,
                fbid: fbId,
                lastUpdated: new Date().toISOString()
            });
        }
    }
} 