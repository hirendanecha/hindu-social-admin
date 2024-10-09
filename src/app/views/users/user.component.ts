import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteDialogComponent } from './delete-confirmation-dialog/delete-dialog.component';
import { Pagination } from '../../@shared/interface/pagination';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FilterComponent } from '../../@shared/components/filter/filter.component';
import { ToastService } from '../../services/toast.service';
import { PostService } from '../../services/post.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @ViewChild(FilterComponent) filterComponent: FilterComponent;
  userData: any = [];
  pagination: Pagination = {
    activePage: 1,
    perPage: 100,
    totalItems: 0,
  };
  visible = false;
  percentage = 0;
  message = '';
  type = '';
  searchCtrl: '';
  startDate: any;
  endDate: any;
  currentView: 'list' | 'table' = 'list';

  constructor(
    private userService: UserService,
    private postService: PostService,
    private modalService: NgbModal,
    private router: Router,
    private spinner: NgxSpinnerService,
    private socketService: SocketService,
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
    this.getUserList();
  }

  ngAfterViewInIit(): void {
  }

  getUserList(startDate?, toDate?): void {
    this.spinner.show();
    this.userService
      .userList(
        this.pagination.activePage,
        this.pagination.perPage,
        this.searchCtrl,
        this.startDate,
        this.endDate
      ).subscribe({
        next: (res: any) => {
          this.spinner.hide()
          if (res?.data) {
            this.userData = res?.data;
            this.pagination.totalItems = res?.pagination?.totalItems;
          }
        },
        error: (error) => {
          this.spinner.hide()
          console.log(error);
        },
      });
  }

  ngAfterViewInit(): void {
  }

  onPageChange(config: Pagination): void {
    this.pagination = config;
    // this.getUser.emit();
    this.getUserList();
  }

  openEditUserPopup(profileId: any) {
    this.router.navigate([`user/${profileId}`])
  }

  deleteUser(userId: any) {
    const modalRef = this.modalService.open(DeleteDialogComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'User';
    modalRef.componentInstance.userId = userId;
    modalRef.componentInstance.message =
      'Are you sure want to delete this user?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.userService.deleteUser(userId).subscribe({
          next: (data: any) => {
            if (data) {
              this.toaster.success('User deleted successfully')
              modalRef.close();
              this.getUserList();

            }
          },
          error: (error) => {
            this.visible = true;
            this.type = 'danger';
            this.message = error.err.message;
            console.log(error);
          },
        });
      }
    });
  }

  deleteAllData(id: any) {
    const modalRef = this.modalService.open(DeleteDialogComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'User Data';
    modalRef.componentInstance.userId = id;
    modalRef.componentInstance.message =
      'Are you sure want to delete this user data?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.postService.deleteAllData(id).subscribe({
          next: (data: any) => {
            if (data) {
              this.toaster.success('User data deleted successfully')
              modalRef.close();
              this.getUserList();

            }
          },
          error: (error) => {
            // this.message = error.err.message;
            this.toaster.danger('Please try again')
            console.log(error);
          },
        });
      }
    });
  }

  changeAccountType(Id: any, status: string): void {
    this.userService.changeAccountType(Id, status).subscribe({
      next: (res) => {
        this.toaster.success(res.message);
        this.getUserList();
      },
      error: (error) => {
        this.toaster.danger(error.message);
      },
    });
  }

  changeIsActiveStatus(Id: any, status: any): void {
    this.userService.changeUserStatus(Id, status).subscribe({
      next: (res) => {
        this.toaster.success(res.message);
        this.getUserList();
      },
      error: (error) => {
        // this.toaster.danger(error.err.message);
        this.toaster.danger(error.message);
      },
    });
  }

  suspendUser(user: any, status: any): void {
    const userData = {
      id: user.Id,
      profileId: user.profileId,
      isSuspended: status
    }
    this.socketService.isSuspendUser(userData, (res) => {
      this.toaster.success(res.message);
      this.getUserList();
    });
  }
  
  activateAccount(id: any, status: any): void {
    this.userService.changeUserStatus(id, status).subscribe({
      next: (res) => {
        this.toaster.success(res.message);
        this.getUserList();

      },
      error: (error) => {
        this.toaster.danger(error.message);
      },
    });
  }

  onVisibleChange(event: boolean) {
    this.visible = event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange(event: number) {
    this.percentage = event * 25;
  }

  changeMediaType(id, status): void {
    this.userService.activateMedia(id, status).subscribe({
      next: (res) => {
        this.toaster.success(res.message);
        this.getUserList();

      },
      error: (error) => {
        this.toaster.danger(error.message);
      },
    });
  }
  onSearch(): void {
    this.searchCtrl = this.filterComponent.searchCtrl.value;
    this.startDate = this.filterComponent.startDate;
    this.endDate = this.filterComponent.toDate;
    this.getUserList()
  }

  showListView() {
    this.currentView = 'list';
  }

  showTableView() {
    this.currentView = 'table';
  }
}
