import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANT } from 'src/app/constants';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../services/auth.service';
// declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form!: FormGroup;
  isProcessing: boolean = false;
  emailSent: boolean = false

  constructor(private authService: AuthService,
    private router: Router,
    private snackbarWrapperService: SnackbarWrapperService) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }



  ngOnInit(): void {

  }


  sendLink() {
    this.isProcessing = true;
    this.authService.forgotPassword(this.form.value.email).subscribe(done => {
      this.isProcessing = false;
      if (done) {
        this.emailSent = true;
      } else {
        this.snackbarWrapperService.open(`could not found account associated with ${this.form.value.email}`);
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
