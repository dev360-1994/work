import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANT } from 'src/app/constants';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../services/auth.service';
// declare var $: any;

@Component({
  selector: 'app-password-changed-successfully',
  templateUrl: './password-changed-successfully.component.html',
  styleUrls: ['./password-changed-successfully.component.scss']
})
export class PasswordChangedSuccessfullyComponent { }
