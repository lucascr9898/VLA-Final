import { Component, signal } from '@angular/core';
import { VlaViewer } from './componentes/vla-viewer/vla-viewer';

@Component({
  selector: 'app-root',
  imports: [VlaViewer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProjetoVLA');
}