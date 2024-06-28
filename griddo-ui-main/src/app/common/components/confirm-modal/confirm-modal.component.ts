import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-schedule-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

    heading="";
    content="";

  constructor(public dialogRef: MatDialogRef<ConfirmModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
   public dialog: MatDialog,  private fb: FormBuilder) {
       if(data){
           this.heading = data.heading;
           this.content = data.content;
       }
  }

  ngOnInit(): void {
  }

  onConfirm(){
    this.dialogRef.close(true);
  }

  onCancel(){
    this.dialogRef.close(false);
  }


}



