import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() targetDate!: string;
  intervalId: any;
  remaining = '00:00';

  ngOnInit(): void {
    this.calculate();
    this.intervalId = setInterval(() => this.calculate(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private calculate(): void {
    const now = new Date();
    const target = new Date(this.targetDate);
    const diff = Math.max(0, target.getTime() - now.getTime());

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / 1000 / 60) % 60;
    const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    if (diff <= 0) {
      this.remaining = '00:00';
    } else {
      const pad = (n: number) => String(n).padStart(2, '0');
      this.remaining =
        (days > 0 ? `${pad(days)}:` : '') + `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
  }
}