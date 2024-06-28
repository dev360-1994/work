import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-level-detail',
  templateUrl: './level-detail.component.html',
  styleUrls: ['./level-detail.component.scss']
})
export class LevelDetailComponent implements OnInit {
  levelForm!: FormGroup;
  @Output() formEmitter = new EventEmitter<FormGroup>(); 
  constructor(private fb: FormBuilder) {
    this.initForm();
    this.levelForm.valueChanges.subscribe(val=>this.formEmitter.emit(this.levelForm));
  }

  ngOnInit(): void {
  }
  initForm() {
    // const phoneRegx = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g);
    this.levelForm = this.fb.group({
      projecLeveltId: [0],
      ProjectId:[0],
      unitOfLenght: ['1',Validators.required],
      levels: [1 ,Validators.required],
      unitPerlevel: [1,Validators.required],
      stocks: [0,Validators.required],
      premium: this.fb.array([this.newPremium()])
    });
  }
  addField(name: string) {
    const phoneRegx = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
    const validators = [Validators.required];
    (this.levelForm.get(name) as FormArray).push(this.newPremium());

  }
  newPremium(): FormGroup {
    return this.fb.group({
      premiumId: 0,
      projecLeveltId:0,
      premium: [0],
      floors: [''],
    })
  }
  removeField(name: string, index: number) {
    (this.levelForm.get(name) as FormArray).removeAt(index);
  }
  get premium(): FormArray {
    return this.levelForm.get('premium') as FormArray;
  }
  save(){
  }
}
