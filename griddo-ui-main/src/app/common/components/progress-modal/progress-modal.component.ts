import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-progress-modal',
  templateUrl: './progress-modal.component.html',
  styleUrls: ['./progress-modal.component.scss']
})
export class ProgressModalComponent implements OnInit {

  heading = "";
  content = "";

  constructor(public dialogRef: MatDialogRef<ProgressModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, private fb: FormBuilder) {
    if (data) {
      this.heading = data.heading;
      this.content = data.content;
    }
  }

  ngOnInit(): void {
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }


}



