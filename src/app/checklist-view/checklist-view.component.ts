import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Parameter {
  paramName: string;
  paramType: string;
  value: string | string[];
}

interface ChecklistSection {
  section: string;
  parameters: { [key: string]: Parameter };
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-checklist-view',
  templateUrl: './checklist-view.component.html',
  styleUrls: ['./checklist-view.component.scss']
})
export class ChecklistViewComponent implements OnInit {
  checklistData: ChecklistSection[] = [];
  checkData: { section: string; parameters: Parameter[] }[] = [];

  constructor() {}

  ngOnInit(): void {
    const state = window.history.state;

    if (state && state.checklistData) {
      this.checklistData = state.checklistData;
      console.log(this.checklistData);

      this.checkData = this.checklistData.map(section => ({
        section: section.section,
        parameters: Object.values(section.parameters).map(param => ({
          ...param,
          value: Array.isArray(param.value) && param.value.length === 0 ? 'NA' : param.value
        }))
      }));

      console.log(this.checkData);
    } else {
      console.error('Checklist data not found');
    }
  }
}
