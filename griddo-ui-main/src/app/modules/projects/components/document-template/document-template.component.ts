import { AfterViewInit, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { CONSTANT, DOC_TYPE } from 'src/app/constants';
@Component({
  selector: 'app-document-template',
  templateUrl: './document-template.component.html',
  styleUrls: ['./document-template.component.scss']
})
export class DocumentTemplateComponent implements OnInit {
  projectBase64Img: any;
  editorData: any = '';
  document1: any = '';
  document2: any = '';
  document3: any = '';
  document4: any = '';
  document5: any = '';
  document6: any = '';
  file: any;
  fileName = '';
  user = CONSTANT.getUser();
  docTypes: Array<{ value: string, text: string }> = Object.keys(DOC_TYPE).map(k => ({ value: k, text: DOC_TYPE[k] }));
  docType = DOC_TYPE

  dialogRef!: MatDialogRef<any>;
  @ViewChild('imgCropperTemplate1')
  imgCropperTemplate!: TemplateRef<any>;
  ckeConfig = {
    extraPlugins: 'placeholder'
  };
  form !: FormGroup
  @Output() formEmitter = new EventEmitter<FormGroup>();
  constructor(
    private snackbarWrapperService: SnackbarWrapperService,
    public dialog: MatDialog,
    private fb: FormBuilder) {
    this.initForm();
    this.form.valueChanges.subscribe(val => {
      this.formEmitter.emit(this.form);
    });
  }

  ngOnInit(): void {
    this.document1 = this.document1 != '' ? this.document1 : '';
    this.document2 = this.document2 != '' ? this.document2 : '';
    this.document3 = this.document3 != '' ? this.document3 : '';
    this.document4 = this.document4 != '' ? this.document4 : '';
    this.document5 = this.document5 != '' ? this.document5 : '';
    this.document6 = this.document6 != '' ? this.document6 : '';
  }


  get projectDocuments(): FormArray {
    return this.form.get('projectDocument') as FormArray;
  }
  initForm() {
    this.form = this.fb.group({
      projectDocument: this.fb.array([]),
    })
  }
  markFormRead() {
    debugger;
    this.form.markAllAsTouched();
  }
  newDocument(documentId: number, projectId: number, documentType: number, documentText: string, file: any, path = '', name = '', createdBy, createdDate): FormGroup {
    let docs = this.fb.group({
      documentId: documentId,
      projectId: projectId,
      documentType: documentType,
      documentText: documentText,
      documentFile: file,
      documentFilePath: path,
      documentFileName: name,
      createdBy: createdBy,
      createdDate: createdDate
    })
    this.form.markAllAsTouched();
    return docs;
  }
  public onNamespaceLoaded(event) {
    event.on('dialogDefinition', function (event) {
      if ('placeholder' == event.data.name) {
        var input = event.data.definition.getContents('info').get('name');
        input.id = 'aps-placeholders',
          input.type = 'select';
        input.items = [['UnitNo'], ['Level'], ['CompanyName'], ['PaymentAfter30Days'], ['PaymentAfter90Days'], ['PaymentAfter180Days'],
        ['PaymentAfter365Days'], ['TotalPurchasePrice'], ['InitialDeposit'], ['NoOfParkingUnit'], ['NoOfStorageUnit'], ['NoOfBycycleUnit'],
        ['TentativeOccupancyDate'], ['Schedule'], ['LegalName1'], ['LegalName2'], ['LegalName3'], ['LegalName4'],
        ['LegalName5'], ['Address1'], ['Address2'], ['Address3'], ['Address4'], ['Address5'],
        ['CellNo1'], ['CellNo2'], ['CellNo3'], ['CellNo4'], ['CellNo5'], ['EmailAddress1'],
        ['EmailAddress2'], ['EmailAddress3'], ['EmailAddress4'], ['EmailAddress5'], ['BusinessNo1'], ['BusinesNo1'],
        ['BusinessNo2'], ['BusinessNo3'], ['BusinessNo4'], ['BusinessNo2']];
        input.setup = function () {
          this.setValue('UnitNo');
        };
      }
    });

  }

  fileChangeEvent(event: any, typeNo: any) {
    this.typeNo = parseInt(typeNo?.value as string);
    if (event?.target?.files[0]?.name?.split('.')[1] != 'docx' && (this.typeNo == 1 || this.typeNo == 2)) {
      this.snackbarWrapperService.open('Only docx file is allowed for APS or Worksheet.');
    } else {
      this.uploadTextFile(event);
    }
    this.form.markAllAsTouched();
  }
  openDialog() {

    this.dialogRef = this.dialog.open(this.imgCropperTemplate, {
      width: '60rem',
      maxWidth: '150vw',
      disableClose: true
    });


  }
  beforeLoad(editor) {

  }

  closeDialog() {
    this.dialogRef.close();
  }
  clearImg(name: string) {


  }
  typeNo: number = 0;

  onFileChange(event: any, typeNo: number) {
    this.typeNo = typeNo;
    this.uploadTextFile(event);
  }

  onSave() {
    //let randNo = this.generateRandomNDigits(5);
    switch (this.typeNo) {
      case 1:
        this.document1 = this.fileName;
        break
      case 2:
        this.document2 = this.fileName;
        break
      case 3:
        this.document3 = this.fileName;
        break
      case 4:
        this.document4 = this.fileName;
        break
      case 5:
        this.document5 = this.fileName;
        break
      case 6:
        this.document6 = this.fileName;
        break
    }

    //if (this.editorData) {
    let index = this.projectDocuments.value.findIndex(x => x.documentType === this.typeNo);
    // if (index == -1) {
    this.projectDocuments.push(this.newDocument(0, 0, this.typeNo, this.editorData, this.file, '', this.fileName, this.user?.userName, new Date().toISOString()));
    // }
    // else {
    // this.projectDocuments.removeAt(index);
    // this.projectDocuments.push(this.newDocument(0, 0, this.typeNo, this.editorData, this.file, '', this.fileName, this.user?.userName, new Date().toISOString()));
    // }
    //}
    // this.closeDialog();
    this.form.markAllAsTouched();
  }


  removeDoc(index) {
    this.projectDocuments.removeAt(index);
    this.projectDocuments.markAllAsTouched();
    this.form.markAllAsTouched();
  }

  checkValueChange(event: any, opcode: number) {
    this.editorData = '';
    if (event.target.checked) {
      this.typeNo = opcode;
      this.openDialog();
      this.form.markAllAsTouched();
    }
  }
  onEditorValueChange({ editor }) {
    let data = editor.getData();
    console.log("editor value change", data);
  }

  public uploadTextFile(event: any) {
    this.file = event.target.files[0];
    this.fileName = this.file?.name;
    this.onSave();
    // if (event.target.files[0].type == 'text/plain' || event.target.files[0].type == "application/msword" || event.target.files[0].type == 'application/pdf' || event.target.files[0].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    //   if (typeof (FileReader) !== undefined) {
    //     let reader = new FileReader();
    //     reader.onload = (e: any) => {
    //       this.editorData = e.target.result;
    //       this.openDialog();
    //     };
    //     reader.readAsText(this.file);
    //   }
    // } else {
    //   alert('Please file of correct format')
    // }
  }

  generateRandomNDigits = (n) => {
    return Math.floor(Math.random() * (9 * (Math.pow(10, n)))) + (Math.pow(10, n));
  }
}
