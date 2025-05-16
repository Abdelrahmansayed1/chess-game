import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChessMessage {
  type: 'MOVE' | 'RESET' | 'SYNC' | 'CHECKMATE';
  data: any;
  player: '1' | '2';
}

@Injectable({
  providedIn: 'root',
})
export class ChessCommunicationService {
  private messageSubject = new BehaviorSubject<ChessMessage | null>(null);

  constructor() {
    // Listen for messages from other iframes
    window.addEventListener('message', (event) => {
      if (event.data && typeof event.data === 'object') {
        this.messageSubject.next(event.data);
      }
    });
  }

  // Send a message to the parent window
  sendMessage(message: ChessMessage) {
    window.parent.postMessage(message, '*');
  }

  // Get messages as an observable
  getMessages(): Observable<ChessMessage | null> {
    return this.messageSubject.asObservable();
  }
}
