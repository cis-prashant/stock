import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

  }

  loginForm: FormGroup | undefined;
  submitted = false;
  serverErr = null;
  returnUrl: string = '';

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() { return this.loginForm?.controls; }

  onSubmit(e: any) {
    this.submitted = true;
    this.serverErr = null;
    if (this.loginForm?.invalid) {
      return;
    }

    let formVal = this.loginForm?.value;

    this.authService.login(formVal).subscribe((res) => {
      if (res.success == true && typeof (res.data) != "undefined" && res.data.token != '') {
        this.router.navigate([this.returnUrl]);
      } else if (res.error != undefined) {
        this.serverErr = res.error;
      }
    })
  }
}
