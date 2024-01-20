import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Pagination } from 'src/app/@shared/interface/pagination';
import { PostService } from 'src/app/services/post.service';
import { DeleteDialogComponent } from '../users/delete-confirmation-dialog/delete-dialog.component';
import { Router } from '@angular/router';
import { FilterComponent } from 'src/app/@shared/components/filter/filter.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent {
  @ViewChild(FilterComponent) filterComponent: FilterComponent;
  postList: any = [];
  pagination: Pagination = {
    activePage: 1,
    perPage: 100,
    totalItems: 0,
  };
  visible = false;
  percentage = 0;
  message = '';
  type = '';
  searchCtrl: FormControl;
  fromDate: Date
  toDate: Date

  constructor(
    private modalService: NgbModal,
    private postService: PostService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastService
  ) {
    this.searchCtrl = new FormControl('');
    this.searchCtrl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe((val: string) => {
        this.getPostList();
      });
  }

  ngOnInit(): void {
    this.getPostList();
  }

  onPageChange(config: Pagination): void {
    this.pagination = config;
    this.getPostList();
  }

  getPostList(): void {
    this.spinner.show();
    this.postService
      .getPostList(
        this.pagination.activePage,
        this.pagination.perPage,
        this.searchCtrl.value
      )
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            this.postList = res.data;
            this.pagination.totalItems = res.pagination?.totalItems;
          }
        },
        error: (error) => {
          this.spinner.hide();
          this.toaster.danger(error.message);
        },
      });
  }

  searchData(): void {
  }

  deletePost(Id: any) {
    const modalRef = this.modalService.open(DeleteDialogComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Post';
    modalRef.componentInstance.userId = Id;
    modalRef.componentInstance.message =
      'Are you sure want to delete this post?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.postService.deletePost(Id).subscribe({
          next: (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              modalRef.close();
              this.getPostList();
            }
          },
          error: (error) => {
            this.toaster.danger(error.message);
          },
        });
      }
    });
  }

  viewPost(id): void {
    this.router.navigate([`post-list/${id}`]);
  }
  onVisibleChange(event: boolean) {
    this.visible = event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange(event: number) {
    this.percentage = event * 25;
  }

  onSearch(): void {
    const searchTerm = this.filterComponent.searchCtrl.value;
    const startDate = this.filterComponent.startDate;
    const toDate = this.filterComponent.toDate;
  }
}
