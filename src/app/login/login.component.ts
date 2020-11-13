import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth-service';
import {Account, UserData} from '../api/Api';
import {Router} from '@angular/router';
import {UserService} from '../services/user-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe(async (data: UserData) => {
        localStorage.setItem('user', JSON.stringify(data));
        await this.router.navigateByUrl('/user').then(value => {
          if (value) {
            console.log('navigate to /user worked');
          } else {
            console.log('navigate to /user didnt work');
          }
        });
      });
    }
  }
}


