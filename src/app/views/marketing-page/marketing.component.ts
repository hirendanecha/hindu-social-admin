import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from 'src/app/@shared/interface/pagination';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FilterComponent } from 'src/app/@shared/components/filter/filter.component';
import { ToastService } from 'src/app/services/toast.service';
import { PostService } from 'src/app/services/post.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.scss'],
})
export class MarketingComponent implements OnInit {
  @ViewChild(FilterComponent) filterComponent: FilterComponent;
  userData: any = [];
  searchCtrl: '';
  startDate: any;
  endDate: any;
  shouldShowSearchInput: boolean = false;
  constructor(
    private userService: UserService,
    private postService: PostService,
    private modalService: NgbModal,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastService
  ) {
    // this.searchCtrl = new FormControl('');
    // this.searchCtrl.valueChanges
    //   .pipe(distinctUntilChanged(), debounceTime(500))
    //   .subscribe((val: string) => {
    //     this.getUserList();
    //   });
  }

  ngOnInit(): void {
    const getFormattedDate = (daysOffset: number = 0): string => {
      const date = new Date();
      date.setDate(date.getDate() + daysOffset);
      return date.toISOString().split('T')[0];
    };
    this.startDate = getFormattedDate(-7),
    this.endDate = getFormattedDate(),
    this.getUserEmailList();
  }

  ngAfterViewInit(): void {
  }

  onSearch(): void {
    this.searchCtrl = this.filterComponent.searchCtrl.value;
    this.startDate = this.filterComponent.startDate;
    this.endDate = this.filterComponent.toDate;
    this.getUserEmailList()
  }
  
  getUserEmailList(): void {
    this.spinner.show();
    const data = {
      startDate: this.startDate,
      endDate: this.endDate
    }
    if (this.startDate) {
    this.userService.getUserEmailList(data).subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          this.userData = res.data
        }),
        error: (error) => {
          this.spinner.hide()
        }
      })
    } else {
      this.spinner.hide();
      this.toaster.danger('please select start date range!')
    }
  }

  downloadCsv() {
    if (this.userData.length) {
      const csvData = this.convertToCsv(this.userData);
      const blob = new Blob([csvData], { type: 'text/csv' });
      saveAs(blob, 'email.csv');
      this.toaster.success('File downloaded successfully')
    } else {
      this.toaster.danger('data not available')
    }
  }

  convertToCsv(data: any[]): string {
    const header = Object.keys(data[0]);
    const rows = data.map(obj => header.map(key => obj[key]));
    rows.unshift(header);
    return rows.map(row => row.join(',')).join('\n');
  }
}
