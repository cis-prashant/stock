import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './appConfig';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  saveCategory(data:any) {
    return this.http.post(`${AppConfig.API_URL}api/v1/blog/category`, data);
  }

  updateCategory(data:any) {
    return this.http.put(`${AppConfig.API_URL}api/v1/blog/category`, data);
  }

  updateBlog(data:any) {
    return this.http.put(`${AppConfig.API_URL}api/v1/blog`, data);
  }

  allCategory() {
    return this.http.get(`${AppConfig.API_URL}api/v1/blog/category`);
  }

  searchCategory(search: string) {
    return this.http.get(`${AppConfig.API_URL}api/v1/blog/category?search=${search}`);
  }

  searchBlog(search: string) {
    return this.http.get(`${AppConfig.API_URL}api/v1/blogs/all?search=${search}`);
  }

  saveBlog(data:any) {
    return this.http.post<any>(`${AppConfig.API_URL}api/v1/blog`, data);
  }

  deleteBlogCategory(id:number) {
    return this.http.delete(`${AppConfig.API_URL}api/v1/blog/category/${id}`);
  }

  deleteBlog(id:number) {
    return this.http.delete(`${AppConfig.API_URL}api/v1/blog/${id}`);
  }

  listBlogs(id: number) {
    return this.http.get(`${AppConfig.API_URL}api/v1/blog/listing/${id}`);
  }

  uploadFile(data:any) {
    return this.http.post<any>(`${AppConfig.API_URL}api/v1/blog/file`, data);
  }
}
