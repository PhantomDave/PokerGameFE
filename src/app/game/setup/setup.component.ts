import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css',
})
export class SetupComponent {
  chips: number = 0;
  players: number = 0;
  bigblind: number = 0;
  smallblind: number = 0;

  onSubmit(form: NgForm) {}
}
