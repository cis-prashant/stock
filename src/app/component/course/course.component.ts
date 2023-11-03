import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, CourseService, BlogService } from 'src/app/services';
import { faEdit, faTrash, faAdd, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent {

  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder, private courseService: CourseService, private blogService: BlogService) {

  }

  faEdit = faEdit;
  faDelete = faTrash;
  faAdd = faAdd;
  faEye = faEye;
  createCategoryForm: FormGroup | undefined;
  chapterForm: FormGroup | undefined;
  courseForm: FormGroup | undefined;
  activePane = 0;
  categories: any = [];
  chapters: any = [];
  courses: any = [];
  submitted = false;
  selectedCat: number = 0;
  selectedFile: any;
  msgClass: string = 'text-info';
  msg: any = null;
  chapterSubmit = false;
  courseSubmit = false;
  catSaving = false;
  chapterSaving = false;
  courseSaving = false;
  visible = false;
  modalMsg = '';
  ctype = '';
  deleteId: any = null;
  fileUploadResp: any = null;
  blogsArr: any = [];
  fillCourse: any = [];
  currentCat = 0;
  searchCat = '';
  searchBlog = '';
  fileForm: FormGroup | undefined;
  chapterResp: any = null;
  chapterRespClass: any = '';
  searchCourseStr: string = '';
  chapterSearchRes: string | null = null;
  filteredCourse: any = [];

  ngOnInit() {
    this.authService.checkActiveLogin().subscribe();

    this.courseForm = this.formBuilder.group({
      name: ['', Validators.required], heading: ['', Validators.required],
      meta: [''], image: [''], keywords: '',
      course_category: ['', Validators.required], id: ''
    });

    this.createCategoryForm = this.formBuilder.group({
      name: ['', Validators.required], heading: ['', Validators.required],
      meta: [''], img: [''], id: '', keywords: ''
    });

    this.chapterForm = this.formBuilder.group({
      course_category: ['', Validators.required], course_id: ['', Validators.required],
      title: ['', Validators.required],
      heading: ['', Validators.required], content: ['', Validators.required],
      meta: [''], keywords: [''], date: ['', Validators.required], id: ''
    });

    this.fileForm = this.formBuilder.group({
      file: [null]
    });

  }

  get f() { return this.createCategoryForm?.controls; }
  get chf() { return this.chapterForm?.controls; }
  get cf() { return this.courseForm?.controls; }

  onSubmit(): void {
    this.fileUploadResp = null;
    const formData = new FormData();
    formData.append('file', this.fileForm?.get('file')?.value);

    this.blogService.uploadFile(formData)
      .subscribe(response => {
        if (response.success) {
          this.fileUploadResp = window.location.protocol + '//' + window.location.host + '/uploads/' + response.data;
        } else {
          this.fileUploadResp = 'Could not upload File!';
        }
      });
  }

  cancelCategoryUpdate() {
    this.createCategoryForm?.reset();
  }

  cancelCourseUpdate() {
    this.courseForm?.reset();
  }

  cancelChapterUpdate() {
    this.chapterForm?.reset();
  }

  submitCourse() {
    this.courseSubmit = true;
    if (this.courseForm?.invalid) {
      return;
    }
    this.courseSaving = true;
    const fData = this.courseForm?.value;
    let formData = new FormData();
    formData.append('img', this.selectedFile);
    formData.append('heading', fData.heading);
    formData.append('name', fData.name);
    formData.append('course_category', fData.course_category);
    formData.append('meta', fData.meta);
    formData.append('keywords', fData.keywords);
    this.courseService.saveCourse(formData).subscribe((res: any) => {
      if (res.success) {
        this.courseSubmit = false;
        this.courseSaving = false;
        this.courses = res.data;
        this.categories = res.cates;
        this.courseForm?.reset();
      }
    });
  }

  updateCourse() {
    this.courseSubmit = true;
    if (this.courseForm?.invalid) {
      return;
    }
    this.courseSaving = true;
    const fData = this.courseForm?.value;
    let formData = new FormData();
    formData.append('img', this.selectedFile);
    formData.append('heading', fData.heading);
    formData.append('name', fData.name);
    formData.append('course_category', fData.course_category);
    formData.append('meta', fData.meta);
    formData.append('keywords', fData.keywords);
    formData.append('id', fData.id);
    this.courseService.updateCourse(formData).subscribe((res: any) => {
      if (res.success) {
        this.courseSubmit = false;
        this.courseSaving = false;
        this.courses = res.data;
        this.categories = res.cates;
        this.courseForm?.reset();
      }
    });
  }

  editCourse(id: number) {
    const cat = this.courses.find((obj: { id: number; }) => obj.id == id);
    this.courseForm?.setValue({
      name: cat.course_name,
      heading: cat.heading,
      meta: cat.meta,
      keywords: cat.keywords,
      course_category: cat.course_category,
      id: cat.id,
      image: ''
    });
  }

  saveChapter() {
    this.chapterResp = null;
    this.chapterSubmit = true;
    if (this.chapterForm?.invalid) {
      return;
    }
    this.chapterSaving = true;
    const fData = this.chapterForm?.value;
    let formData = new FormData();
    formData.append('img', this.selectedFile);
    formData.append('course_category', fData.course_category);
    formData.append('course_id', fData.course_id);
    formData.append('title', fData.title);
    formData.append('heading', fData.heading);
    formData.append('content', fData.content);
    formData.append('meta', fData.meta);
    formData.append('keywords', fData.keywords);
    formData.append('date', fData.date);

    this.courseService.saveChapter(formData).subscribe((res: any) => {
      this.chapterSaving = true;
      this.chapterSubmit = false;
      if (res.success) {
        this.chapterResp = 'Chapter added successfuly';
        this.chapterRespClass = 'text-success';
        this.chapterForm?.reset();
      } else {
        this.chapterResp = 'Could not add chapter!';
        this.chapterRespClass = 'text-danger';
      }
    });
  }

  updateChapter() {
    this.chapterResp = null;
    this.chapterSubmit = true;
    if (this.chapterForm?.invalid) {
      return;
    }
    this.chapterSaving = true;
    const fData = this.chapterForm?.value;
    let formData = new FormData();
    formData.append('img', this.selectedFile);
    formData.append('course_category', fData.course_category);
    formData.append('course_id', fData.course_id);
    formData.append('title', fData.title);
    formData.append('heading', fData.heading);
    formData.append('content', fData.content);
    formData.append('meta', fData.meta);
    formData.append('keywords', fData.keywords);
    formData.append('date', fData.date);
    formData.append('id', fData.id);

    this.courseService.updateChater(formData).subscribe((res: any) => {
      this.chapterSaving = false;
      this.chapterSubmit = false;
      if (res.success) {
        this.chapterResp = 'Chapter updated successfuly';
        this.chapterRespClass = 'text-success';
        this.chapterForm?.reset();
      } else {
        this.chapterResp = 'Could not add chapter!';
        this.chapterRespClass = 'text-danger';
      }
    });
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  onTabChange($event: number) {
    this.catSaving = false;
    if ($event == 0) this.getAllCategories();
    if ($event != 2) this.chapterForm?.reset();
    if ($event == 1) this.getCourses();
    if ($event == 3) this.searchChapter();
    this.activePane = $event;
    this.msg = null;
    this.allTabReset();
  }

  getAllCategories() {
    this.courseService.allCategory().subscribe((res: any) => {
      if (res.success) {
        this.categories = res.data;
      }
    });
  }

  getCourses() {
    this.courseService.allCourses().subscribe((res: any) => {
      if (res.success) {
        this.courses = res.data;
      }
    });
  }

  searchChapter() {
    this.chapterSearchRes = null;
    this.courseService.getChapters(this.searchCourseStr).subscribe((res: any) => {
      if (res.success) {
        this.filteredCourse = res.data;
      }
      if (res.data.length == 0) {
        this.chapterSearchRes = 'No Chapters found!';
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onCourseCategoryChange(event: any) {
    for (let cat of this.categories) {
      if (cat.id == event.target.value && cat.courses.length > 0) {
        this.fillCourse = cat.courses;
      }
    }
  }

  updateCategory() {
    this.submitted = true;
    if (this.createCategoryForm?.invalid) {
      return;
    }
    this.catSaving = true;
    const fData = this.createCategoryForm?.value;
    let formData = new FormData();
    formData.append('id', fData.id);
    formData.append('name', fData.name);
    formData.append('heading', fData.heading);
    formData.append('meta', fData.meta);
    formData.append('keywords', fData.keywords);
    formData.append('img', this.selectedFile);
    this.courseService.updateCategory(formData).subscribe((res: any) => {
      if (res.success) {
        this.categories = res.data;
        this.submitted = false;
        this.catSaving = false;
        this.createCategoryForm?.reset();
      }
    });
  }

  saveCategory() {
    this.submitted = true;
    if (this.createCategoryForm?.invalid) {
      return;
    }
    this.catSaving = true;
    const fData = this.createCategoryForm?.value;
    let formData = new FormData();
    formData.append('id', fData.id);
    formData.append('name', fData.name);
    formData.append('heading', fData.heading);
    formData.append('meta', fData.meta);
    formData.append('keywords', fData.keywords);
    formData.append('img', this.selectedFile);
    this.courseService.saveCategory(formData).subscribe((res: any) => {
      if (res.success) {
        this.categories = res.data;
        this.submitted = false;
        this.catSaving = false;
        this.createCategoryForm?.reset();
      }
    });
  }

  editCategory(id: number) {
    const cat = this.categories.find((obj: { id: number; }) => obj.id == id);
    this.createCategoryForm?.setValue({
      name: cat.name,
      heading: cat.heading,
      meta: cat.meta,
      keywords: cat.keywords,
      id: cat.id,
      img: ''
    });
  }

  editChapter(id: number) {
    const chapter = this.filteredCourse.find((obj: { id: number; }) => obj.id == id);
    this.chapterForm?.setValue({
      course_category: chapter.course_category,
      course_id: chapter.course_id,
      title: chapter.title,
      heading: chapter.heading,
      content: chapter.content,
      meta: chapter.meta,
      keywords: chapter.keywords,
      date: chapter.date,
      id: chapter.id
    });
    this.activePane = 2;
  }

  deleteChapter(id: number) {
    this.modalMsg = 'Are You Sure to DELETE this Chapter?';
    this.visible = !this.visible;
    this.ctype = 'chapter';
    this.deleteId = id;
  }

  deleteCategory(id: number) {
    this.modalMsg = 'Are You Sure to DELETE this Category and its all ASSOCIATED Courses and Chapters?';
    this.visible = !this.visible;
    this.ctype = 'category';
    this.deleteId = id;
  }

  addChapter(id: number) {
    this.chapterForm?.reset();
    this.activePane = 1;
    this.selectedCat = id;
    this.chapterForm?.get('category_id')?.setValue(id);
  }

  deleteCourse(id: number) {
    this.modalMsg = 'Are You Sure to DELETE this Course and its all ASSOCIATED Chapters?';
    this.visible = !this.visible;
    this.ctype = 'course';
    this.deleteId = id;
  }

  confirmYes(res: string) {
    this.visible = !this.visible;
    if (res == 'chapter') {
      this.courseService.deleteChapter(this.deleteId).subscribe((res: any) => {
        if (res.success) {
          if (this.filteredCourse.length) {
            this.filteredCourse = this.filteredCourse.filter((item: { id: any; }) => item.id !== this.deleteId);
          }
        }
        this.deleteId = null;
      });
    } else if (res == 'category') {
      this.courseService.deleteCourseCategory(this.deleteId).subscribe((res: any) => {
        if (res.success) {
          if (this.categories.length) {
            this.categories = this.categories.filter((item: { id: any; }) => item.id !== this.deleteId);
          }
        }
        this.deleteId = null;
      });
    } else if (res == 'course') {
      this.courseService.deleteCourse(this.deleteId).subscribe((res: any) => {
        if (res.success) {
          if (this.courses.length) {
            this.courses = this.courses.filter((item: { id: any; }) => item.id !== this.deleteId);
          }
        }
        this.deleteId = null;
      });
    }
  }

  allTabReset() {
    this.chapterSearchRes = null;
    this.chapterResp = null;
    this.fileUploadResp = null;
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileForm?.get('file')?.setValue(file);
    }
  }
}
