import { Component, input, output, effect, signal, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Countdown timer component that displays time until a given date
 * Updates every second and emits when complete
 */
@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownTimerComponent implements OnDestroy {
  /**
   * ISO date string for when the countdown ends
   */
  targetDate = input<string>('');

  /**
   * Emits when countdown reaches zero
   */
  countdownComplete = output<void>();

  /**
   * Signal for the remaining time
   */
  remainingTime = signal<CountdownTime>({ hours: 0, minutes: 0, seconds: 0 });

  /**
   * Formatted time string (HH:MM:SS)
   */
  formattedTime = signal<string>('00:00:00');

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Set up effect to update countdown when targetDate changes
    effect(() => {
      const targetDateStr = this.targetDate();
      if (targetDateStr) {
        this.startCountdown(new Date(targetDateStr));
      }
    });
  }

  private startCountdown(target: Date): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    const updateTime = () => {
      const now = new Date();
      const diff = Math.max(0, target.getTime() - now.getTime());

      if (diff === 0) {
        this.countdownComplete.emit();
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.remainingTime.set({ hours, minutes, seconds });
      this.formattedTime.set(this.formatTime(hours, minutes, seconds));
    };

    updateTime();
    this.intervalId = setInterval(updateTime, 1000);
  }

  private formatTime(hours: number, minutes: number, seconds: number): string {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}