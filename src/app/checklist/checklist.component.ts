import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChecklistDataService } from '../checklist-data.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule,
    MatSelectModule, MatTabsModule, MatStepperModule, MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class ChecklistComponent implements OnInit {
  @Input() sections: any[] = [];
  @Input() articles: string[] = [];  // Accepting article options from AddParamComponent
  formGroups: { [key: string]: FormGroup } = {};
  paramTypes: string[] = ['Free Text', 'Date time', 'Dropdown'];
  submittedSections: { [key: string]: boolean } = {};
  submitted: boolean = false;
  checklistData: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private checklistDataService: ChecklistDataService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.sections = navigation?.extras.state?.['sections'] || [];
    this.articles = navigation?.extras.state?.['articles'] || [];
    console.log(this.articles);

    this.sections.forEach((section) => {
      this.submittedSections[section.section] = false;
    });
  }

  ngOnInit(): void {
    this.checklistData = this.checklistDataService.getChecklistData();
    if (this.sections.length > 0) {
      this.sections.forEach((section) => {
        const parameterControls: any = {};

        section.parameters.forEach((param: any) => {
          const controls: any = {
            paramName: new FormControl(param.paramName || '', Validators.required),
            paramType: new FormControl(param.paramType, Validators.required),
            value: new FormControl(param.value || (param.paramType === 'Dropdown' ? [] : ''), Validators.required)
          };

          if (param.paramType === 'Free Text' || param.paramType === 'Date time') {
            controls['value'] = new FormControl('', Validators.required);
          } else if (param.paramType === 'Dropdown') {
            controls['value'] = new FormControl([], Validators.required);
          }

          parameterControls[param.paramName] = this.fb.group(controls);
        });


        this.formGroups[section.section] = this.fb.group(parameterControls);
      });
    }
  }

  getDropdownOptions(paramType: string): string[] {
    return paramType === 'Dropdown' ? this.articles : [];
  }

  saveSection(sectionName: string): void {
    this.submittedSections[sectionName] = true;

    const savedData = {
      section: sectionName,
      parameters: this.formGroups[sectionName].value
    };

    this.checklistDataService.setChecklistData(savedData);

    const sectionIndex = this.sections.findIndex(s => s.section === sectionName);
    if (sectionIndex >= 0 && sectionIndex < this.sections.length - 1) {
      const nextSection = this.sections[sectionIndex + 1].section;
      this.submittedSections[nextSection] = true;
    }
    this.submitted = true;
  }

  finalizeChecklist(): void {
    if (this.checklistData && this.checklistData.length > 0) {
      const navigationExtras = {
        state: { checklistData: this.checklistData }
      };
      this.router.navigate(['/checklistview'], navigationExtras);
    } else {
      console.error('No checklist data available to pass');
    }
  }
}
