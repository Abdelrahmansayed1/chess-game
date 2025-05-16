import {
  Component,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  standalone: true,
})
export class MainPageComponent implements AfterViewInit {
  @ViewChildren('iframeRef') iframes!: QueryList<ElementRef<HTMLIFrameElement>>;

  ngAfterViewInit() {
    window.addEventListener('message', (event) => {
      // Only relay chess messages
      if (
        event.data &&
        event.data.type &&
        ['MOVE', 'RESET', 'SYNC', 'CHECKMATE'].includes(event.data.type)
      ) {
        this.iframes.forEach((iframe) => {
          // Don't send back to the sender
          if (event.source !== iframe.nativeElement.contentWindow) {
            iframe.nativeElement.contentWindow?.postMessage(event.data, '*');
          }
        });
      }
    });
  }
}
