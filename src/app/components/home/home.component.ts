import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InstructionsComponent } from '../instructions/instructions.component';
import { CountdownComponent } from '../countdown/countdown.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, InstructionsComponent, CountdownComponent],
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  showInstructions = false;
  completlyHidden = true;

  toggleInstructions() {
    this.showInstructions = !this.showInstructions;
    setTimeout(() => {
      this.completlyHidden = !this.showInstructions;
    }, 400);
  }
}