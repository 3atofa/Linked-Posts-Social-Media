import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpClient: HttpClient) { }

  createPost(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}posts`, data);
  }

  getAllPosts(): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}posts`);
  }

  getMyPosts(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}posts/${id}?limit=2`);
  }

  updatePost(postId: string, data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseURL}posts/${postId}`, data);
  }

  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseURL}posts/${postId}`);
  }


}
