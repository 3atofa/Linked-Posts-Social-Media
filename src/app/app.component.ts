import { NgxSpinnerConfig } from './../../node_modules/ngx-spinner/lib/config.d';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
declare const initFlowbite: any; // Declare Flowbite initialization function
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'social-app-angular-19';
  private spinner = inject(NgxSpinnerService)
  ngOnInit(): void {
    // Initialize Flowbite after component loads
    if (typeof initFlowbite === 'function') {
      initFlowbite();
    }

    // ~ spinnner
    this.spinner.show();
    
    // Simulate loading time
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  showSpinner() {
    this.spinner.show();
  }

  // Method to hide spinner
  hideSpinner() {
    this.spinner.hide();
  }
}
