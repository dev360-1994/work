import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account-verification',
  templateUrl: './account-verification.component.html',
  styleUrls: ['./account-verification.component.scss']
})
export class AccountVerificationComponent implements OnInit {

  form: FormGroup;
  isProcessing: boolean = false;
  visibility: boolean = true;

  constructor(private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    localStorage.clear();
    const passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    const token = this.activatedRoute.snapshot.queryParams?.t;
    let email = this.activatedRoute.snapshot.queryParams?.userEmail;
    if (!token) {
      // window.alert('Link has been expired !');
      // this.router.navigate(['/login']);
    }
    if(!email)
    email="";
    
    this.form = new FormGroup({
      email: new FormControl(email, [Validators.email, Validators.required]),
      token: new FormControl(token, [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(passwordRegx)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegx)]),
    });
  }

  ngOnInit(): void {
  }

  submit() {
    const data = {
      Password: this.form.value.password,
      token: this.form.value.token,
      email: this.form.value.email,
    };
    this.isProcessing = true;
    this.authService.emailVerify(data).subscribe(res => {
      this.isProcessing = false;
      window.alert('Your account has been successfully updated!')
      this.router.navigate(['/auth/login']);
    }, err => {
      this.isProcessing = false;
      window.alert('Link has been expired !');
    })
  }

}
