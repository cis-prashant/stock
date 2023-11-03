import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, BlogService } from 'src/app/services';
import { faEdit, faTrash, faAdd, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  
  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder, private blogService: BlogService) {
  
  }

  faEdit = faEdit;
  faDelete = faTrash;
  faAdd = faAdd;
  faEye = faEye;
  createCategoryForm: FormGroup | undefined;
  createBlogForm: FormGroup | undefined;
  activePane = 0;
  categories: any = [];
  submitted = false;
  showAddBlogTab: any = false;
  selectedCat: number = 0;
  selectedFile: any;
  msgClass: string = 'text-info';
  msg: any = null;
  blogSubmit = false;
  catSaving = false;
  blogSaving = false;
  visible = false;
  modalMsg = '';
  ctype = '';
  deleteId: any = null;
  fileUploadResp: any = null;
  blogsArr: any = [];
  currentCat = 0;
  visibleCatEdit = false;
  visibleBlogEdit = false;
  searchCat = '';
  searchBlog = '';
  fileForm: FormGroup| undefined;

  ngOnInit() {
    this.authService.checkActiveLogin().subscribe();
    this.createCategoryForm = this.formBuilder.group({
      name: ['', Validators.required], heading: ['', Validators.required],
      meta: [''], img: [''], id: '', keywords: ''
    });

    this.createBlogForm = this.formBuilder.group({
      title: ['', Validators.required],
      heading: ['', Validators.required],
      content: ['', Validators.required],
      meta: [''], category_id: [0, Validators.required],
      date: [''], image: [''], id: '', keywords: ''
    });

    this.fileForm = this.formBuilder.group({
      file: [null]
    });
  }

  get f() { return this.createCategoryForm?.controls; }
  get bf() { return this.createBlogForm?.controls; }

  onFileChange(event:any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileForm?.get('file')?.setValue(file);
    }
  }

  onSubmit(): void {
    this.fileUploadResp = null;
    const formData = new FormData();
    formData.append('file', this.fileForm?.get('file')?.value);

    this.blogService.uploadFile(formData)
      .subscribe(response => {
        if (response.success) {
          this.fileUploadResp = window.location.protocol+'//'+window.location.host+'/uploads/'+response.data;
        } else {
          this.fileUploadResp = 'Could not upload File!';
        }
    });
  }

  onTabChange($event: number) {
    if ($event == 0) this.getAllCategories();
    this.activePane = $event;
    this.msg = null;
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
    this.blogService.saveCategory(formData).subscribe((res: any) => {
      if (res.success) {
        this.categories = res.data;
        this.submitted = false;
        this.catSaving = false;
        this.createCategoryForm?.reset();
      }
    });
  }

  getAllCategories() {
    this.blogService.allCategory().subscribe((res: any) => {
      if (res.success) {
        this.categories = res.data;
      }
    });
  }

  addBlog(id: number) {
    this.createBlogForm?.reset();
    this.activePane = 1;
    this.selectedCat = id;
    this.createBlogForm?.get('category_id')?.setValue(id);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  saveBlog() {
    this.blogSubmit = true;
    if (this.createBlogForm?.invalid) {
      const formGroupErrors = this.createBlogForm.errors;
      return;
    }
    this.blogSaving = true;
    const fData = this.createBlogForm?.value

    let formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('heading', fData.heading);
    formData.append('meta', fData.meta);
    formData.append('keywords', fData.keywords);
    formData.append('content', fData.content);
    formData.append('date', fData.date);
    formData.append('category_id', fData.category_id);
    formData.append('title', this.createBlogForm?.get('title')?.value);

    this.blogService.saveBlog(formData).subscribe((res: any) => {
      this.blogSubmit = false;
      this.blogSaving = false;
      if (res.success) {
        this.categories = res.data;
        this.createBlogForm?.reset();
        this.createBlogForm?.get('category_id')?.setValue(this.selectedCat);
        this.msgClass = 'text-success';
        this.msg = 'Blog Created Successfully';
      } else {
        this.msgClass = 'text-danger';
        this.msg = 'Could not Blog!';
      }
    });
  }

  deleteBlogCat(id: number) {
    this.modalMsg = 'Are You Sure to DELETE this Category and its ALL BLOGS?';
    this.visible = !this.visible;
    this.ctype = 'blogCategory';
    this.deleteId = id;
  }

  confirmYes(res: string) {
    this.visible = !this.visible;
    if (res == 'blogCategory') {
      this.blogService.deleteBlogCategory(this.deleteId).subscribe((res: any) => {
        this.getAllCategories();
      });
    } else if (res == 'blog') {
      this.blogService.deleteBlog(this.deleteId).subscribe((res: any) => {
        this.listBlogs(this.currentCat);
      });
    }

  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  listBlogs(id: number) {
    this.activePane = 2;
    this.currentCat = id;
    this.blogService.listBlogs(id).subscribe((res: any) => {
      if (res.success) {
        this.blogsArr = res.data;
      }
    });
  }

  viewBlog(id: number) {
    if (!this.visibleBlogEdit) this.visibleBlogEdit = !this.visibleBlogEdit;
    this.createBlogForm?.reset();
    this.activePane = 1;
    this.selectedCat = id;
    this.createBlogForm?.get('category_id')?.setValue(id);
    for (const obj of this.blogsArr) {
      if (obj.id == id) {
        this.createBlogForm?.setValue({
          'heading': obj.heading,
          'meta': obj.meta,
          'keywords': obj.keywords,
          'content': obj.content,
          'date': obj.date?.substring(0, 10) ?? '',
          'category_id': obj.blog_category,
          'title': obj.title,
          'id': obj.id,
          'image': ''
        });
        break;
      }
    }
  }

  deleteBlog(id: number) {
    this.modalMsg = 'Are You Sure to DELETE this BLOG Permanently?';
    this.visible = !this.visible;
    this.ctype = 'blog';
    this.deleteId = id;
  }

  openEditCatModal(id: number) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!this.visibleCatEdit) this.visibleCatEdit = !this.visibleCatEdit;
    for (const obj of this.categories) {
      if (obj.id == id) {
        this.createCategoryForm?.setValue({
          name: obj.name,
          heading: obj.heading,
          meta: obj.meta,
          keywords: obj.keywords,
          id: obj.id,
          img: ''
        });
        break;
      }
    }
  }

  updateCategory() {
    const fData = this.createCategoryForm?.value;
    let formData = new FormData();
    formData.append('id', fData.id);
    formData.append('name', fData.name);
    formData.append('heading', fData.heading);
    formData.append('meta', fData.meta);
    formData.append('keywords', fData.keywords);
    formData.append('img', this.selectedFile);

    this.submitted = true;
    this.catSaving = true;

    this.blogService.updateCategory(formData).subscribe((res: any) => {
      this.categories = res.data;
      this.submitted = false;
      this.catSaving = false;
      this.createCategoryForm?.reset();
      this.visibleCatEdit = !this.visibleCatEdit;
      if (res.success) {
        this.msgClass = 'text-success';
        this.msg = 'Blog Updated Successfully';
      } else {
        this.msgClass = 'text-danger';
        this.msg = 'Could not Blog!';
      }
    });
  }

  cancelUpdate() {
    this.visibleCatEdit = !this.visibleCatEdit;
    this.createCategoryForm?.reset();
  }

  cancelBlogUpdate() {
    this.visibleBlogEdit = !this.visibleBlogEdit;
    this.createBlogForm?.reset();
    this.activePane = 2;
    this.selectedCat = 0;
  }

  updateBlog() {
    this.blogSubmit = true;
    if (this.createBlogForm?.invalid) {
      const formGroupErrors = this.createBlogForm.errors;
      return;
    }
    this.blogSaving = true;
    const fData = this.createBlogForm?.value

    let formData = new FormData();
    formData.append('id', fData.id);
    formData.append('file', this.selectedFile);
    formData.append('heading', fData.heading);
    formData.append('meta', fData.meta);
    formData.append('keywords', fData.keywords);
    formData.append('content', fData.content);
    formData.append('date', fData.date);
    formData.append('category_id', fData.category_id);
    formData.append('title', this.createBlogForm?.get('title')?.value);

    this.blogService.updateBlog(formData).subscribe((res: any) => {
      this.blogSubmit = false;
      this.blogSaving = false;
      if (res.success) {
        this.categories = res.data;
        this.createBlogForm?.reset();
        this.createBlogForm?.get('category_id')?.setValue(this.selectedCat);
        this.msgClass = 'text-success';
        this.msg = 'Blog Updated Successfully';
        for (let i = 0; i < this.blogsArr.length; i++) {
          const obj = this.blogsArr[i];
          if (obj.id == fData.id) {
            this.blogsArr[i] = res.data;
            break;
          }
        }
      } else {
        this.msgClass = 'text-danger';
        this.msg = 'Could not Blog!';
      }
    });
  }

  searchCategory() {
    if (this.searchCat == '') return;
    this.blogService.searchCategory(this.searchCat).subscribe((res: any) => {
      if (res.success) {
        this.categories = res.data;
      }
    });
  }

  searchBlogs() {
    this.blogService.searchBlog(this.searchBlog).subscribe((res: any) => {
      if (res.success) {
        this.blogsArr = res.data;
      }
    });
  }

  resetSearchCat() {
    this.searchCat = '';
    this.getAllCategories();
  }

  resetSearchBlog() {
    this.searchBlog = '';
    this.searchBlogs();
  }
}
