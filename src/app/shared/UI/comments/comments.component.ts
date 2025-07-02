import { Component, inject, Input, OnInit } from '@angular/core';
import { CommentsService } from '../../../core/services/comments/comments.service';
import { Comment } from '../../../core/interfaces/IPost/ipost';
import { IComment } from '../../../core/interfaces/IComment/icomment';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comments',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  private readonly _CommentsService = inject(CommentsService);
  private readonly Toaster = inject(ToastrService);
  @Input({ required: true }) postId!: string; // has to access in ngoninit

  commentsList: IComment[] = [];
  commentForm!: FormGroup;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.commentForm = new FormGroup({
      content: new FormControl(null),
      post: new FormControl(this.postId),
    });

    this._CommentsService.getPostComments(this.postId).subscribe({
      next: (res) => {
        console.log(res);
        this.commentsList = res.comments;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  sendComment() {
    this._CommentsService.createComment(this.commentForm.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.message == 'success') {
          this.Toaster.success(res.message, 'Comment Sent');
          this.commentForm.get('content')?.setValue(null);
          this.commentsList = res.comments;
        }
      },
      error: (err) => {
        console.log(err);
        this.Toaster.error(err.error.message, 'Error');
      }
    })
  }

}
