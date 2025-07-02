import { Component, HostListener, inject } from '@angular/core';
import { PostsService } from '../../core/services/posts/posts.service';
import { IPost } from '../../core/interfaces/IPost/ipost';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { CommentsComponent } from '../../shared/UI/comments/comments.component';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  imports: [CommonModule, DatePipe, CommentsComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private readonly _PostsService = inject(PostsService);
  private readonly _Toaster = inject(ToastrService);
  postList: IPost[] = [];
  saveFiles!: File;
  content: string = '';
  imagePreview: string | null = null; // Add this for image preview

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.displayPosts();
  }

  displayPosts(){
    this._PostsService.getAllPosts().subscribe({
      next: (res) => {
        console.log(res);
        this.postList = res.posts;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  changeImage(e: Event) {
    const input = e.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      console.log(input.files![0]);
      this.saveFiles = input.files[0];
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.saveFiles);
    }
  }

  createPost() {
    const formData = new FormData();
    formData.append('body', this.content);
    formData.append('image', this.saveFiles);
    
    this._PostsService.createPost(formData).subscribe({
      next: (res) => {
        console.log(res);
        if (res.message == 'success') {
          this._Toaster.success(res.message);
          this.closeModalAlternative(); // Use alternative method
          this.resetForm(); // Reset form data
          // Refresh posts list
          this.ngOnInit();
          this.displayPosts();
        }
      },
      error: (err) => {
        console.log(err);
        this._Toaster.error(err.message);
      }
    })
  }

  // Alternative method to close modal (Flowbite API)
  closeModalAlternative() {
    // Method 1: Use Flowbite's data attributes
    const closeButton = document.querySelector('[data-modal-hide="authentication-modal"]') as HTMLElement;
    if (closeButton) {
      closeButton.click();
      return;
    }
    
    // Method 2: Manual cleanup
    const modal = document.getElementById('authentication-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }
    
    // Remove all backdrop elements
    const backdrops = document.querySelectorAll('.fixed.inset-0.bg-gray-900, .bg-gray-900.bg-opacity-50, [data-modal-backdrop]');
    backdrops.forEach(backdrop => {
      backdrop.remove();
    });
    
    // Restore body scroll
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    
    // Force remove any remaining overlays
    setTimeout(() => {
      const remainingOverlays = document.querySelectorAll('.fixed.inset-0');
      remainingOverlays.forEach(overlay => {
        if (overlay.classList.contains('bg-gray-900') || overlay.classList.contains('bg-opacity-50')) {
          overlay.remove();
        }
      });
    }, 100);
  }

  // Method to reset form
  resetForm() {
    this.content = '';
    this.saveFiles = null as any;
    this.imagePreview = null;
    
    // Reset file input
    const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Method to remove image preview
  removeImage() {
    this.imagePreview = null;
    this.saveFiles = null as any;
    
    // Reset file input
    const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
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
  deletePost(id:string)
  {
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