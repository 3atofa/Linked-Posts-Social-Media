import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private requestCount = 0;

  // Observable that components can subscribe to
  loading$ = this.loadingSubject.asObservable();

  // Show loading spinner
  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  // Hide loading spinner
  hide(): void {
    if (this.requestCount > 0) {
      this.requestCount--;
    }

    if (this.requestCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  // Force hide loading (useful for error scenarios)
  forceHide(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }

  // Get current loading state
  get isLoading(): boolean {
    return this.loadingSubject.value;
  }
}
