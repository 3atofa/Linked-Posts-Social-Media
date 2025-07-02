import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { UsersService } from '../../core/services/users/users.service';

import { User } from '../../core/interfaces/IPost/ipost';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() isLoggedIn: boolean = false;
  private readonly _UserService = inject(UsersService);
  private readonly router = inject(Router);
  
  userData!:User; 


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._UserService.getLoggedUserData().subscribe({
      next: (res) => {
        console.log('userDAta:', res);

        this.userData = res.user;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  displayProfile(){
    document.getElementById('ProfileList')?.classList.toggle('class-hidden');
  }

  logOut(){
    localStorage.removeItem('socialToken');
    this.router.navigate(['/login']);
  }
}
