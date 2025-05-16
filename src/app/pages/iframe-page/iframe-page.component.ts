import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessBoardComponent } from '../../components/chess-board/chess-board.component';
import { ActivatedRoute } from '@angular/router';
import {
  ChessCommunicationService,
  ChessMessage,
} from '../../services/chess-communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-iframe-page',
  standalone: true,
  imports: [CommonModule, ChessBoardComponent],
  templateUrl: './iframe-page.component.html',
  styleUrl: './iframe-page.component.scss',
})
export class IframePageComponent implements OnInit, OnDestroy {
  @ViewChild(ChessBoardComponent) chessBoard!: ChessBoardComponent;
  isRotated = false;
  isDisabled = false;
  currentPlayer: '1' | '2' = '1';
  playerReady = false;
  isCheckmate = false;
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private chessCommunication: ChessCommunicationService
  ) {
    this.subscription = this.chessCommunication
      .getMessages()
      .subscribe((message) => {
        if (message) {
          this.handleIncomingMessage(message);
        }
      });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.currentPlayer = params['player'] as '1' | '2';
      this.isRotated = this.currentPlayer === '2';
      this.isDisabled = this.currentPlayer === '2';
      this.playerReady = true;

      // Load FEN from LocalStorage if present
      const savedFen = localStorage.getItem('chessGameState');
      if (savedFen) {
        if (
          this.chessBoard &&
          this.chessBoard.board &&
          this.chessBoard.board.setFEN
        ) {
          this.chessBoard.board.setFEN(savedFen);
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleMove(move: any) {
    if (move.checkmate || move.mate) {
      this.isCheckmate = true;
      this.chessCommunication.sendMessage({
        type: 'CHECKMATE',
        data: null,
        player: this.currentPlayer,
      });
    }
    // Save FEN to LocalStorage
    if (
      this.chessBoard &&
      this.chessBoard.board &&
      this.chessBoard.board.getFEN
    ) {
      const fen = this.chessBoard.board.getFEN();
      localStorage.setItem('chessGameState', fen);
    }
    this.chessCommunication.sendMessage({
      type: 'MOVE',
      data: move.move,
      player: this.currentPlayer,
    });
    this.isDisabled = true;
  }

  private handleIncomingMessage(message: ChessMessage) {
    switch (message.type) {
      case 'MOVE':
        if (message.player !== this.currentPlayer) {
          this.chessBoard.makeMove(message.data);
          this.isDisabled = false;
        }
        break;
      case 'RESET':
        this.chessBoard.resetBoard();
        this.isCheckmate = false;
        this.isDisabled = this.currentPlayer === '2';
        localStorage.removeItem('chessGameState');
        break;
      case 'CHECKMATE':
        this.isCheckmate = true;
        break;
    }
  }

  createNewGame() {
    if (this.chessBoard) {
      this.chessBoard.resetBoard();
      this.isCheckmate = false;
      this.isDisabled = this.currentPlayer === '2';
      localStorage.removeItem('chessGameState');
      this.chessCommunication.sendMessage({
        type: 'RESET',
        data: null,
        player: this.currentPlayer,
      });
    }
  }
}
