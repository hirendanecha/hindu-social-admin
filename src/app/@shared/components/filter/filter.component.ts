import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Input() showSearchInput: boolean = true;
  @Input() searchCtrl: FormControl = new FormControl();
  @Input() startDate: Date;
  @Input() toDate: Date;
  @Input() endDate: string;
  @Input() class: string;
  @Output() searchClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(){
    this.endDate = this.formatDate(new Date());
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSearchClick(): void {
    this.searchClick.emit();
  }
}
