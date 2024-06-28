import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { DomSanitizer } from '@angular/platform-browser';

export interface FolderFile {
  file: File;
  id: number;
  projectId: number;
  type: 'pdf' | 'img' | 'doc' | 'video';
  folderName: string;
  name: string;
  preview?: any;
  imagePath: string;
}

export interface Folder {
  name: string;
  files: Array<FolderFile>;
  selected: boolean,
}

@Component({
  selector: 'app-marketing-assets',
  templateUrl: './marketing-assets.component.html',
  styleUrls: ['./marketing-assets.component.scss']
})
export class MarketingAssetsComponent implements OnInit {

  form: FormGroup;
  folder!: Folder | null;
  folderFile!: FolderFile; 
  folders: Array<Folder> = [];
  accetpFiletypes: Array<string> = ["image/*", ".doc", ".docx", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf", 'video/*']
  accetpFiletype: string = this.accetpFiletypes.join(', ');

  // @Input() marketingAssetsForm!: FormGroup;
  @Output() formEmitter = new EventEmitter<FormGroup>();

  constructor(
    private snackbarWrapperService: SnackbarWrapperService,
    public dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder) {

    this.form = this.fb.group({
      projectMarketingAssets: new FormArray([])
    });
  }

  ngOnInit(): void {
    if (this.form?.value?.projectMarketingAssets?.length) {
      const groups = (this.form?.value?.projectMarketingAssets as Array<any>).reduce((accumulator, currentValue) => {
        accumulator[currentValue.folderName] = [...accumulator[currentValue.folderName] || [], currentValue];
        return accumulator;
      }, {});
      this.folders = Object.keys(groups).map(folderName => ({
        name: folderName,
        files: groups[folderName].map(fileItem => {
          let type!: 'pdf' | 'img' | 'doc' | 'video';
          const file = { name: '', type: '' };
          if (fileItem.assetsFile) {
            const file: File = fileItem.assetsFile;

            if (file?.type) {
              if (file.type.toLowerCase().startsWith("image")) {
                type = 'img';
              } else if (file.type.toLowerCase().startsWith("video")) {
                type = 'video';
              } else if (file.name.toLowerCase().endsWith('.pdf')) {
                type = 'pdf';
              } else if (file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) {
                type = 'doc';
              }
            }
          } else {

            file.type = fileItem?.assetsFilePath?.substring(fileItem?.assetsFilePath?.lastIndexOf('.') + 1);
            file.name = fileItem?.assetsFilePath?.split('/').pop();

            if (file?.type) {
              if (file.name.toLowerCase().endsWith('.png') || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) {
                type = 'img';
              } else if (file.type.toLowerCase().startsWith("video")) {
                type = 'video';
              } else if (file.name.toLowerCase().endsWith('.pdf')) {
                type = 'pdf';
              } else if (file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) {
                type = 'doc';
              }
            }
          }
          // else if (fileItem?.assetsFilePath) {
          //   if (file.type.toLowerCase().startsWith("image")) {
          //     type = 'img';
          //   } else if (file.type.toLowerCase().startsWith("video")) {
          //     type = 'video';
          //   } else if (file.name.toLowerCase().endsWith('.pdf')) {
          //     type = 'pdf';
          //   } else if (file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) {
          //     type = 'doc';
          //   }
          // }
          return { file, type, folderName, name: file?.name, id: fileItem.projectAssestsId, projectId: fileItem.projectId, imagePath: fileItem?.assetsFilePath }
        }),
        selected: false
      }));
    }
  }


  resetInput() {
    const ele: HTMLInputElement = document.getElementById('upload-file') as HTMLInputElement;
    if (ele) {
      ele.value = '';
    }
  }

  validateFileSize = (fsize, maxSize) => {
    if (fsize <= maxSize) {
      return true;
    } else {
      return false;
    }
  };

  removeFile(index: number) {
    if (this.folder?.files?.length && this.folder?.files[index]) {
      this.folder?.files.splice(index, 1);
    }
    this.resetInput();
    this.marketingAssets();
  }

  fileChangeEvent(event: any): void {
    if (!event?.target?.files?.length) {
      return this.resetInput();
    }
    let files: Array<File> = event?.target?.files?.length ? event.target.files : [];


    const erros = [];
    // if (files?.length && this.fileUploadPlaceholder.maxFileSize) {
    // const sizeInMb = this.fileUploadPlaceholder.maxFileSize / (1024 * 1024);
    // URL.createObjectURL(file)
    Array.prototype.forEach.call(files, (file: File, index: number) => {
      let type!: 'pdf' | 'img' | 'doc' | 'video';
      let preview!: any;
      if (file.type.toLowerCase().startsWith("image")) {
        type = 'img';
        preview = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      } else if (file.type.toLowerCase().startsWith("video")) {
        type = 'video';
        preview = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      } else if (file.name.toLowerCase().endsWith('.pdf')) {
        type = 'pdf';
      } else if (file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) {
        type = 'doc';
      }
      if (type) {
        this.folder?.files.unshift({ file: file, name: file.name, type, preview, folderName: this.folder.name, id: 0, projectId: 0, imagePath: "" })
      }
      // if (!this.validateFileSize(file.size, this.fileUploadPlaceholder.maxFileSize)) {
      //   erros.push(`${file.name} (${index}) : Max allowed file size ${sizeInMb}MB`)
      // }
    });
    // }

    // if (erros?.length) {
    //   this.resetInput();
    //   return this.snackBar.open(erros.join('  '), 'Close');
    // }
    this.resetInput();
    this.marketingAssets();
  }

  onFileChange(files: Array<File>) {
    if (files?.length) {
      this.fileChangeEvent({ target: { files } });
    }
    this.form.markAllAsTouched();
  }

  allFolders() {
    this.folders.forEach(f => f.selected = false);
    this.folder = null;
    this.form.markAllAsTouched();
  }

  selectFolder(folderIndex) {
    this.folders.forEach(f => f.selected = false);
    this.folders[folderIndex].selected = true;
    this.folder = this.folders[folderIndex];
    this.form.markAllAsTouched();
  }

  addFolder(addFolderTemplate: TemplateRef<any>) {
    const dialogRef = this.dialog.open(addFolderTemplate, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
    let sub = dialogRef.afterClosed().subscribe((val: string) => {
      if (val) {
        if (this.folders.find(f => f.name.toLowerCase() === val?.toLowerCase())) {
          this.snackbarWrapperService.open(`Folder ${val} already exists`);
        } else {
          this.folders.unshift({ name: val, files: [], selected: false })
        }
      }
      sub.unsubscribe();
    })
    this.form.markAllAsTouched();
  }

  preview(previewTemplate: TemplateRef<any>, folderFile: FolderFile) {
    this.folderFile = folderFile;
    const dialogRef = this.dialog.open(previewTemplate, {
      width: '100vw',
      maxWidth: '100vw',
      disableClose: true
    });
  }



  marketingAssets() {
    (this.form.get('projectMarketingAssets') as FormArray).clear();
    this.folders?.forEach(f => {
      f?.files?.forEach(fileItem => {
        (this.form.get('projectMarketingAssets') as FormArray).push(
          this.newMarketingAssets(fileItem.id, fileItem.projectId, true, fileItem.file, fileItem.imagePath, fileItem.folderName)
        )
      })
    })
    this.form.markAllAsTouched();
  }

  newMarketingAssets(projectAssestsId = 0, projectId = 0, makeItPublic = true, assetsFile: any = '', assetsFilePath = "", folderName = ""): FormGroup {
    return this.fb.group({
      projectAssestsId: projectAssestsId,
      projectId: projectId,
      makeItPublic: makeItPublic,
      assetsFile: assetsFile,
      assetsFilePath: assetsFilePath,
      folderName: folderName
    })
  }
}
