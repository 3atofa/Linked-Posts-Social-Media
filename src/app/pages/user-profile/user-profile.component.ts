import { Component, HostListener, inject } from '@angular/core';
import { UsersService } from '../../core/services/users/users.service';
import { IPost, User } from '../../core/interfaces/IPost/ipost';
import { PostsService } from '../../core/services/posts/posts.service';
import { CommentsComponent } from '../../shared/UI/comments/comments.component';
import { CommonModule } from '@angular/common';
import { EmailValidator, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare const initFlowbite: any; // Declare Flowbite initialization function

@Component({
  selector: 'app-user-profile',
  imports: [CommentsComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  private readonly _UsersService = inject(UsersService);
  private readonly _PostsService = inject(PostsService);
  private readonly _ToastrService = inject(ToastrService)
  userData!: User;
  userPosts: IPost[] = [];
  
  // Profile image upload properties
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isUploading: boolean = false;
  isModalOpen: boolean = false;
  
  userForm: FormGroup = new FormGroup({
    name: new FormControl(null),
    email: new FormControl(null)
  })

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (typeof initFlowbite === 'function') {
      initFlowbite();
    }
   
    this._UsersService.getLoggedUserData().subscribe({
      next: (res) => {
        console.log(res);
        this.userData = res.user;
        this.userForm.patchValue({
          name: res.user.name,
          email: res.user.email
        });
        this.displayPosts();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  displayPosts() {
    if (this.userData._id) {
      this._PostsService.getMyPosts(this.userData._id).subscribe({
        next: (res) => {
          console.log('posts:', res);
          this.userPosts = res.posts;
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  // Modal control methods
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.cancelImageUpload();
  }

  // Profile image upload methods
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      this.selectedImage = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfileImage(): void {
    if (!this.selectedImage) return;
    
    this.isUploading = true;
    const formData = new FormData();
    formData.append('photo', this.selectedImage);
    
    this._UsersService.uploadProfileImage(formData).subscribe({
      next: (res) => {
        console.log('Profile image uploaded successfully:', res);
        
        // Update userData with new photo URL
        this.userData.photo = res.user?.photo || res.photo;
        
        // Reset upload state
        this.selectedImage = null;
        this.imagePreview = null;
        this.isUploading = false;
        
        // Close modal
        this.closeModal();
        this._ToastrService.success('Profile image updated successfully!');
    
      },
      error: (err) => {
        console.log('Error uploading image:', err);
        this.isUploading = false;
        this._ToastrService.error('Failed to upload image. Please try again.')
        
        
      }
    });
  }

  cancelImageUpload(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  // ~  Post edit
  openEditMenuId: string | null = null;
  
  // Toggle edit menu for a specific post
  toggleEditMenu(postId: string, event: Event) {
    event.stopPropagation(); // Prevent the click from bubbling up
    this.openEditMenuId = this.openEditMenuId === postId ? null : postId;
  }
  
  // Close all edit menus when clicking anywhere
  @HostListener('document:click')
  closeAllEditMenus() {
    this.openEditMenuId = null;
  }
  
  // Check if a specific post's menu should be visible
  isMenuOpen(postId: string): boolean {
    return this.openEditMenuId === postId;
  }
  
  // ~ delete Post
  deletePost(id: string) {
    this._PostsService.deletePost(id).subscribe({
      next: (res) => {
        console.log(res);
        this.displayPosts();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}