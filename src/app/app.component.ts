import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogoutComponent } from './components/logout/logout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LogoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
