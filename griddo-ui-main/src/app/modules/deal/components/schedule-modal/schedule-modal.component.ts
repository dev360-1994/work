import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateValidator } from 'src/app/shared/date.validator';

@Component({
  selector: 'app-schedule-modal',
  templateUrl: './schedule-modal.component.html',
  styleUrls: ['./schedule-modal.component.scss']
})
export class ScheduleModalComponent implements OnInit {

  heading = "";
  content = "";
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<ScheduleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, private fb: FormBuilder) {
    if (data) {
      this.heading = data.heading;
      this.content = data.conetent;
    }

    this.form = this.fb.group({
      scheduleDate: new FormControl(null, [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/), DateValidator.expiryDateVaidator]),
      scheduleTime: new FormControl(null, [Validators.required])
    });

    this.form.get('scheduleDate')?.valueChanges.subscribe(val => {
      if (val?.toISOString) {
        this.form.get('scheduleDate')?.setValue(val.toISOString());
      }
    })
  }

  ngOnInit(): void {
  }

  onConfirm() {

    this.checkForm();
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);

      const dateTime = data.scheduleDate + ' '+ data.scheduleTime;

      this.dialogRef.close({ result: true, data: dateTime });

    }

  }

  onCancel() {
    this.dialogRef.close({ result: false, data: null });
  }


  checkForm() {
    Object.keys(this.form.controls).forEach(field => {
      const control: any = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

}



