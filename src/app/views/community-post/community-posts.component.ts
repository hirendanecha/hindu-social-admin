import { Component, OnInit } from '@angular/core';
import { CommunityPostService } from '../../services/community-post.service';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs';
import { Pagination } from '../../@shared/interface/pagination';
import { DeleteDialogComponent } from '../users/delete-confirmation-dialog/delete-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-community-posts',
  templateUrl: './community-posts.component.html',
  styleUrls: ['./community-posts.component.scss'],
})
export class CommunityPostComponent implements OnInit {
  searchCtrl: FormControl;
  postList: any = [];
  pagination: Pagination = {
    activePage: 1,
    perPage: 15,
    totalItems: 0,
  };
  visible = false;
  percentage = 0;
  message = '';
  type = '';

  constructor(
    private communityPostService: CommunityPostService,
    private modalService: NgbModal,
    private router: Router,
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

  getPostList() {
    this.communityPostService
      .getPostList(
        this.pagination.activePage,
        this.pagination.perPage,
        this.searchCtrl.value
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.postList = res.data;
            this.pagination.totalItems = res.pagination.totalItems;
            this.pagination.perPage = res.pagination.pageSize;
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  onPageChange(config: Pagination): void {
    this.pagination = config;
    this.getPostList();
  }

  openCommunityPost(id) {}
  deleteCommunityPost(Id): void {
    const modalRef = this.modalService.open(DeleteDialogComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Community Post';
    modalRef.componentInstance.userId = Id;
    modalRef.componentInstance.message =
      'Are you sure want to delete this post?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.communityPostService.deletePost(Id).subscribe({
          next: (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              modalRef.close();
              this.getPostList();
            }
          },
          error: (error) => {
            this.toaster.danger(error.message);
            console.log(error);
          },
        });
      }
    });
  }

  onVisibleChange(event: boolean) {
    this.visible = event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange(event: number) {
    this.percentage = event * 25;
  }
  getPosts() {}
  viewPost(id): void {
    this.router.navigate([`community-post/${id}`]);
  }
}
