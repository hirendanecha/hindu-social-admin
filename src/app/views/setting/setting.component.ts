import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../@shared/interface/pagination';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FilterComponent } from '../../@shared/components/filter/filter.component';
import { ToastService } from '../../services/toast.service';
import { PostService } from '../../services/post.service';
import { BugReportService } from '../../services/bug-report.service';
import { saveAs } from 'file-saver';
import { DeleteDialogComponent } from '../users/delete-confirmation-dialog/delete-dialog.component';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  @ViewChild(FilterComponent) filterComponent: FilterComponent;
  userData: any = [];
  searchCtrl: '';
  startDate: any;
  endDate: any;
  shouldShowSearchInput: boolean = false;

  bugReports: any = []
  pagination: Pagination = {
    activePage: 1,
    perPage: 15,
    totalItems: 0,
  };

  constructor(
    private userService: UserService,
    private postService: PostService,
    private modalService: NgbModal,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastService,
    private bugReportService: BugReportService
  ) {
    // this.searchCtrl = new FormControl('');
    // this.searchCtrl.valueChanges
    //   .pipe(distinctUntilChanged(), debounceTime(500))
    //   .subscribe((val: string) => {
    //     this.getUserList();
    //   });
  }

  ngOnInit(): void {
    this.getBugReports();
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

  getBugReports(): void {
    this.spinner.show();
    const pages = {
      page: this.pagination.activePage,
      size: this.pagination.perPage
    }
    this.bugReportService.getBugreport(pages).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            this.bugReports = res?.data
            this.pagination.perPage = res?.pagination?.pageSize;
            this.pagination.totalItems = res?.pagination?.totalItems;
          }
        },
        error: (error) => {
          this.spinner.hide();
        },
      });
  }

  
  changeReportStatus(report, status): void {
    const data = {
      id : report.id,
      profileId : report.profileId,
      isResolved : status
    }
    this.bugReportService.changeBugStatus(data).subscribe({
        next: (res) => {
          this.toaster.success('Successfully change status.');
          this.getBugReports();
        },
        error: (error) => {
          this.toaster.danger(error.message);
        },
      });
  }

  deleteReport(Id): void {
    const modalRef = this.modalService.open(DeleteDialogComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Support Ticket';
    modalRef.componentInstance.message =
      'Are you sure want to delete this Ticket?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        console.log(Id);
        
        this.bugReportService.deleteReport(Id).subscribe({
          next: (res) => {
            this.toaster.success('Successfully delete ticket.');
            modalRef.close();
            this.getBugReports();
          },
          error: (error) => {
            this.toaster.danger(error.message);
          },
        });
      }
    });
  }

  openReport(id: any): void {
    this.router.navigate([`report-bugs/ticket/${id}`]);
  }

  onPageChange(config: Pagination): void {
    this.pagination = config;
    this.getBugReports();
  }
}
