import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  template: `
    <div class="user-container">
      <h1>User Settings</h1>
      <p>Manage your profile and preferences</p>
    </div>
  `,
  styles: [`
    .user-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
    }
  `]
})
export class UserComponent {}