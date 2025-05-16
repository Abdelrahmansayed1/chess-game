import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule, NgxChessBoardModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.scss',
})
export class ChessBoardComponent implements AfterViewInit, OnChanges {
  @ViewChild('board') board!: any;
  @Input() isRotated: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() color: 'white' | 'black' = 'white';
  @Output() moveMade = new EventEmitter<any>();
  private suppressMoveEvent = false;
  isCheckmate = false;

  ngAfterViewInit() {
    if (this.isRotated && this.board && this.board.reverse) {
      this.board.reverse();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['isRotated'] &&
      !changes['isRotated'].firstChange &&
      this.board &&
      this.board.reverse
    ) {
      if (changes['isRotated'].currentValue) {
        this.board.reverse();
      }
    }
  }

  handleMove(move: any) {
    if (this.suppressMoveEvent) return;
    this.moveMade.emit(move);
  }

  makeMove(move: string) {
    if (this.board) {
      this.suppressMoveEvent = true;
      this.board.move(move);
      this.suppressMoveEvent = false;
    }
  }

  resetBoard() {
    if (this.board) {
      this.board.reset();
      this.isCheckmate = false;
    }
  }
}
