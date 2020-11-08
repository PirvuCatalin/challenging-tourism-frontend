import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get input() { return this.form.get('email'); }
  get pass() { return this.form.get('password'); }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/');
    }
  }
  hideError = true;
  login() {
    if (this.form.valid) {
      this.hideError = true;
      const val = this.form.value;

      if (val.email && val.password) {
        this.authService.login(val.email, val.password)
          .subscribe(
            () => {
              console.log("User is logged in");
              this.router.navigateByUrl('/dashboard');
            }
          );
      }
    } else {
      this.hideError = false;
    }
  }
}
