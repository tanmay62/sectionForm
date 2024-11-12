import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChecklistDataService {
  private checklistData: any[] = [];
  private articleOptions: string[] = [];

  setChecklistData(data: any): void {
    const existingIndex = this.checklistData.findIndex(item => item.section === data.section);

    if (existingIndex !== -1) {
      this.checklistData[existingIndex] = { ...data };
    } else {
      this.checklistData.push({ ...data });
    }
  }

  getChecklistData(): any[] {
    return this.checklistData;
  }

  setArticleOptions(options: string[]): void {
    this.articleOptions = options;
  }

  getArticleOptions(): string[] {
    return this.articleOptions;
  }

  clearData(): void {
    this.checklistData = [];
  }

  isSectionSubmitted(sectionName: string): boolean {
    return this.checklistData.some(item => item.section === sectionName);
  }
}
