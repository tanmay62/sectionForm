import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  selector: 'app-add-param-form',
  templateUrl: './add-param.component.html',
  styleUrls: ['./add-param.component.scss']
})
export class AddParamComponent {
  addParamForm: FormGroup;
  paramTypes: string[] = ['Free Text', 'Date time', 'Dropdown'];
  sectionOptions: string[] = ['Section 1', 'Section 2', 'Section 3'];
  articleOptions: string[] = ['Article 1', 'Article 2', 'Article 3'];

  constructor(private fb: FormBuilder, public dialog: MatDialog, private router: Router) {
    this.addParamForm = this.fb.group({
      sections: this.fb.array([]),
    });
    this.addSection();
  }

  get sections(): FormArray {
    return this.addParamForm.get('sections') as FormArray;
  }

  addSection() {
    const sectionGroup = this.fb.group({
      section: ['', Validators.required],
      parameters: this.fb.array([])
    });
    this.sections.push(sectionGroup);
    this.addParameter(this.sections.length - 1);
  }

  removeSection(index: number) {
    this.sections.removeAt(index);
  }

  getParameters(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('parameters') as FormArray;
  }

  addParameter(sectionIndex: number) {
    const parameterGroup = this.fb.group({
      paramName: ['', Validators.required],
      paramType: ['', Validators.required],
      article: [{ value: [], disabled: true }]
    });

    parameterGroup.get('paramType')?.valueChanges.subscribe(() => {
      this.onParamTypeChange(parameterGroup);
    });

    this.getParameters(sectionIndex).push(parameterGroup);
  }

  removeParameter(sectionIndex: number, paramIndex: number) {
    this.getParameters(sectionIndex).removeAt(paramIndex);
  }

  onParamTypeChange(parameterGroup: FormGroup) {
    const paramTypeControl = parameterGroup.get('paramType');
    const articleControl = parameterGroup.get('article');

    if (paramTypeControl?.value === 'Dropdown') {
      articleControl?.enable();
    } else {
      articleControl?.disable();
      articleControl?.setValue([]);
    }
  }

  save() {
    const formData = this.addParamForm.value.sections;
    const articOpt = this.articleOptions
    console.log(formData);
    this.router.navigate(['/checklist'], { state: { sections: formData, articles : articOpt } });
  }
}
