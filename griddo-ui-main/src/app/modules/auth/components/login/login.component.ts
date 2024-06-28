import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANT } from 'src/app/constants';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../services/auth.service';
// declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm!: FormGroup;
  isProcessing: boolean = false;
  isLogin: boolean = false;
  showLoginOptions = true;
  links: Array<{ title: string, url: string }> = [];
  user: User;
  loingas: string = 'Login';
  role!: string;
  roleLogins: Array<{ title: string, url: string }> = [];
  visibility: boolean = true;

  constructor(private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbarWrapperService: SnackbarWrapperService) {
    this.user = CONSTANT.getUser();
    if (this.user != null) {
      this.showLoginOptions = false;
      if (this.user?.role?.toLowerCase() === 'buyer') {
        this.router.navigate(['/buyer-admin']);
      } else if (this.user?.role?.toLowerCase() === 'masteradmin') {
        this.router.navigate(['/griddo-master']);
      } else if (this.user?.role?.toLowerCase() === 'builder') {
        this.router.navigate(['/builder-admin']);
      } else if (this.user?.role?.toLowerCase() === 'agent') {
        this.router.navigate(['/agent-admin']);
      }
      else if (this.user?.role?.toLowerCase() === 'agency') {
        this.router.navigate(['/agency-admin']);
      }
    }


    this.activatedRoute.data.subscribe(data => {
      this.isLogin = data?.login ?? false;
    });

    this.activatedRoute.params.subscribe(params => {
      this.role = params?.role?.toLowerCase();
      switch (this.role) {
        case 'agency':
          return this.loingas += ' as Agency';
        case 'agent':
          return this.loingas += ' as Agent';
        case 'builder':
          return this.loingas += ' as builder';
        case 'buyer':
          return this.loingas += ' as Buyer';
        case 'masteradmin':
          return this.loingas += ' as Superadmin';
        default:
          return this.loingas
      }
    });
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }


  // adc(e){
  //   alert(e)
  // }

  ngAfterViewInit(): void {
    // if (document.getElementById('2dmodel')) {
    // $(function () {
    //   $('.map').maphilight();
    // });
    // }
  }

  ngOnInit(): void {
    // this.links = this.isLogin ? [
    //   { title: 'About Us' },
    //   { title: 'Ask For a Trial' }
    // ] : [
    //   { title: 'Projects' },
    //   { title: 'Contact Us' }
    // ]
    this.links = [
      { title: 'About Us', url: '' },
      { title: 'Ask For a Trial', url: '' }
    ]
      ;
    this.roleLogins = [
      { title: 'Builder', url: 'login/builder' },
      { title: 'Agent', url: 'login/agent' },
      { title: 'Superadmin', url: 'login/masteradmin' },
      { title: 'Agency', url: 'login/agency' },
      { title: 'Buyer', url: 'login/buyer' },
    ]
  }


  login(rememberme: boolean) {
    localStorage.removeItem("agencyId");
    localStorage.removeItem("builderId");
    localStorage.removeItem("agency-admin");
    this.isProcessing = true;
    return this.authService.login(this.loginForm.value).subscribe(user => {
      this.isProcessing = false;
      // if (this.role !== user?.role?.toLowerCase()) {
      //   return this.snackbarWrapperService.open('Please login with ' + this.role)
      // }
      CONSTANT.setUser(user);
      CONSTANT.rememberme(rememberme);

      this.router.navigate(['/griddo-master'])

    }, err => {
      debugger
      if (err?.error?.error!= null || err?.error?.error!= undefined ){
        this.snackbarWrapperService.open(err?.error?.error)
      }
      else if (err?.status == 400) {
        this.snackbarWrapperService.open('Invalid credential')
      } else {
        this.snackbarWrapperService.open('Server error')
      }
      this.isProcessing = false;
    });
  }



}
