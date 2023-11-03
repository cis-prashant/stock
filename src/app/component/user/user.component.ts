import { Component } from '@angular/core';
import { UsersService, AuthenticationService } from 'src/app/services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  constructor(private usersService: UsersService, private authService: AuthenticationService, private formBuilder: FormBuilder) {

  }

  users: any = [];
  activePane = 0;
  tableSize: number = 10;
  page: number = 1;
  count: number = 0;
  userForm: FormGroup | undefined;
  submitted = false;
  visibleEdit = false;
  userSaving = false;
  selectedUser: any;

  ngOnInit() {
    this.authService.checkActiveLogin().subscribe();
    this.getAllUsers();
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      is_active: [1, Validators.required],
      is_admin: [1],
      role_id: ['', Validators.required],
      access:'',
      id: ''
    });
  }

  get f() { return this.userForm?.controls; }

  getAllUsers() {
    this.usersService.getAllUsers().subscribe((resp: any) => {
      if (resp.success) this.users = resp.data
    });
  }

  onTabChange($event: number) {
    this.activePane = $event;
  }

  getStatus(status: number) {
    let ret;
    if (status == 1) ret = '<span class="badge ms-auto badge-sm bg-success">Active</span>';
    if (status == 0) ret = '<span class="badge ms-auto badge-sm bg-danger">Not Active</span>';
    return ret;
  }

  getRole(role: number) {
    let ret;
    if (role == 1) ret = 'Super Admin';
    if (role == 2) ret = 'Admin';
    if (role == 3) ret = 'User';
    return ret;
  }

  onTableDataChange(event: number) {
    this.getAllUsers();
  }

  updateUser() {
    this.submitted = true;
    if (this.userForm?.invalid) {
      return;
    }
    this.userSaving = true;
    const fData = this.userForm?.value;
    if (fData.role == 1 || fData.role_id == 2) fData.access = ["full"]
    this.usersService.updateUser(fData).subscribe((res: any) => {
      if (res.success) {
        
        for (let i = 0; i < this.users.length; i++) {
          const obj = this.users[i];
          if (obj.id == fData.id) {
            this.users[i] = res.data;
            break;
          }
        }
        this.activePane = 0;
        this.submitted = false;
        this.userSaving = false;
        this.userForm?.reset();
        this.userForm?.get('is_admin')?.setValue(1);
      }
    });
  }

  saveUser() {
    this.userForm?.get('password')?.setValidators([Validators.required]);
    this.submitted = true;
    if (this.userForm?.invalid) {
      return;
    }
    this.userSaving = true;
    const fData = this.userForm?.value;
    this.usersService.saveUser(fData).subscribe((res: any) => {
      if (res.success) {
        this.users = res.data;
        this.submitted = false;
        this.userSaving = false;
        this.userForm?.reset();
        this.userForm?.get('is_admin')?.setValue(1);
      }
    });
  }

  cancelUpdate() {
    this.activePane = 0;
    this.submitted = false;
    this.visibleEdit = false;
    this.userForm?.reset();
    this.userForm?.get('is_admin')?.setValue(1);
  }

  createNewUser() {
    this.activePane = 1;
    this.submitted = false;
    this.visibleEdit = false;
    this.userForm?.reset();
    this.userForm?.get('is_admin')?.setValue(1);
  }

  viewUser(id: number) {
    if (!this.visibleEdit) this.visibleEdit = !this.visibleEdit;
    
    this.submitted = false;
    this.userSaving = false;
    this.userForm?.reset();
    this.userForm?.get('password')?.setValidators(null);
    this.activePane = 1;
    this.selectedUser = id;
    for (const obj of this.users) {
      if (obj.id == id) {
        this.userForm?.setValue({
          'name': obj.name,
          'email': obj.email,
          'password': '',
          'is_active': obj.is_active,
          'role_id': obj.role_id,
          'id': obj.id,
          'is_admin': 1,
          'access': obj.access
        });
        break;
      }
    }
  }
}
