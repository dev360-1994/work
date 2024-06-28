import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANT } from 'src/app/constants';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../services/auth.service';
// declare var $: any;

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  form!: FormGroup;
  isProcessing: boolean = false;
  invalidLink: boolean = false;
  // passwordGenerated: boolean = true;
  visibility: boolean = false;


  constructor(private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbarWrapperService: SnackbarWrapperService) {

    const passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    if (!this.activatedRoute.snapshot.queryParams.token || !this.activatedRoute.snapshot.queryParams.email) {
      this.invalidLink = true;
    }

    this.form = new FormGroup({
      email: new FormControl(this.activatedRoute.snapshot.queryParams.email || '', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(passwordRegx)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegx)]),
      token: new FormControl(this.activatedRoute.snapshot.queryParams?.token || '', [Validators.required]),
    });

    this.invalidLink = this.form.get('email')?.invalid as boolean
  }



  ngOnInit(): void {

  }


  reset(): any {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return this.snackbarWrapperService.open('Please fill all required fields');;
    }
    if (this.form?.value?.password !== this.form?.value?.confirmPassword) {
      return this.snackbarWrapperService.open('Password & Confirm Password should match!');
    }
    this.isProcessing = true;
    this.authService.resetPassword(this.form.value.email, this.form.value.token, this.form.value.password).subscribe(done => {
      this.isProcessing = false;
      if (done) {
        this.router.navigate(['/password-changed-successfully'])
      } else {
        this.snackbarWrapperService.open(`something went wrong please try again`);
      }
    }, err => {
      if (err?.error?.error) {
        this.snackbarWrapperService.open(JSON.stringify(err?.error?.error));
      } else if (err.message || err?.data?.message) {
        this.snackbarWrapperService.open(JSON.stringify(err.message || err?.data?.message));
      } else {
        this.snackbarWrapperService.open(JSON.stringify(err));
      }
      this.isProcessing = false;
    });
  }




}
