import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private httpClient: HttpClient) { }

  createComment(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}comments`, data);
  }

  getPostComments(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}posts/${postId}/comments`);
  }

  updatePostComment(commentId: string, data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseURL}comments/${commentId}`, data);
  }

  deletePostComment(commentId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseURL}comments/${commentId}`);
  }
}
