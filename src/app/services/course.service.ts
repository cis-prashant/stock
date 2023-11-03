import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './appConfig';


@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  allCategory() {
    return this.http.get(`${AppConfig.API_URL}api/v1/course/category`);
  }

  allChapters() {
    return this.http.get(`${AppConfig.API_URL}api/v1/course/chapter`);
  }

  allCourses() {
    return this.http.get(`${AppConfig.API_URL}api/v1/course`);
  }

  saveCategory(data:any) {
    return this.http.post(`${AppConfig.API_URL}api/v1/course/category`, data);
  }

  updateCategory(data:any) {
    return this.http.put(`${AppConfig.API_URL}api/v1/course/category`, data);
  }

  saveChapter(data:any) {
    return this.http.post(`${AppConfig.API_URL}api/v1/course/chapter`, data);
  }

  saveCourse(data:any) {
    return this.http.post(`${AppConfig.API_URL}api/v1/course`, data);
  }

  updateCourse(data:any) {
    return this.http.put(`${AppConfig.API_URL}api/v1/course`, data);
  }

  updateChater(data:any) {
    return this.http.put(`${AppConfig.API_URL}api/v1/course/chapter`, data);
  }

  getCourse(search: string) {
    return this.http.get(`${AppConfig.API_URL}api/v1/course?search=${search}`);
  }

  getChapters(search: string) {
    return this.http.get(`${AppConfig.API_URL}api/v1/chapters?search=${search}`);
  }

  deleteChapter(id:number) {
    return this.http.delete(`${AppConfig.API_URL}api/v1/chapter/${id}`);
  }

  deleteCourseCategory(id:number) {
    return this.http.delete(`${AppConfig.API_URL}api/v1/course/category/${id}`);
  }

  deleteCourse(id: number) {
    return this.http.delete(`${AppConfig.API_URL}api/v1/course/${id}`);
  }

}
