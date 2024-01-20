import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { UserService } from '../../../services/user.service';
import { DeleteDialogComponent } from '../delete-confirmation-dialog/delete-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterComponent } from 'src/app/@shared/components/filter/filter.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class ViewUserPostComponent implements OnInit, AfterViewInit {
  // @Input() communityId: any;
  @ViewChild(FilterComponent) filterComponent: FilterComponent;
  postList: any = [];
  profileId: string;
  isOpenCommentsPostId = '';
  isExpand = false;
  commentList = [];
  visible = false;
  percentage = 0;
  message = '';
  type = '';
  shouldShowSearchInput: boolean = false;
  startDate: any;
  endDate: any;
  activePage = 0;
  hasMoreData = false;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toaster: ToastService
  ) {
    this.profileId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getPostLists();
  }

  ngAfterViewInit(): void {}

  getPostLists(): void {
    // const userId = this.userId;
    // this.spinner.show();
    // const data = {
    //   page: this.activePage,
    //   size: 10,
    //   profileId: this.profileId,
    //   startDate: this.startDate,
    //   endDate: this.endDate
    // }
    // this.postService
    //   .viewPost(data)
    //   .subscribe({
    //     next: (res: any) => {
    //       this.spinner.hide();
    //       if (res) {
    //         this.postList = res.data.data;
    //       }
    //     },
    //     error: (error) => {
    //       this.spinner.hide();
    //       console.log(error);
    //     },
    //   });
    this.activePage = 0;
    this.loadMore();
  }

  loadMore() {
    this.activePage++;
    this.spinner.show();
    const data = {
      page: this.activePage,
      size: 10,
      profileId: this.profileId,
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.postService.viewPost(data).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res?.data?.data.length > 0) {
          this.postList = this.postList.concat(res.data.data);
          this.hasMoreData = false;
        } else {
          this.hasMoreData = true;
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  viewComments(id): void {
    this.isExpand = this.isOpenCommentsPostId == id ? false : true;
    this.isOpenCommentsPostId = id;
    if (!this.isExpand) {
      this.isOpenCommentsPostId = null;
    } else {
      this.isOpenCommentsPostId = id;
    }

    this.postService.getComments(id).subscribe({
      next: (res) => {
        if (res) {
          this.commentList = res.data.commmentsList.map((ele: any) => ({
            ...ele,
            replyCommnetsList: res.data.replyCommnetsList.filter((ele1) => {
              return ele.id === ele1.parentCommentId;
            }),
          }));
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
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
              this.getPostLists();
            }
          },
          error: (error) => {
            this.toaster.danger(error.message);
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

  onSearch(): void {
    // const searchTerm = this.filterComponent.searchCtrl.value;
    this.startDate = this.filterComponent.startDate;
    this.endDate = this.filterComponent.toDate;
    this.getPostLists();
    // Perform actions with the values obtained from the filter component
  }

  deleteComments(id): void {
    const modalRef = this.modalService.open(DeleteDialogComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Comment';
    modalRef.componentInstance.userId = id;
    modalRef.componentInstance.message =
      'Are you sure want to delete this comment?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.postService.deleteComments(id).subscribe({
          next: (res: any) => {
            this.toaster.success(res.message);
            this.viewComments(id);
            this.isOpenCommentsPostId = id;
            this.isExpand = true;
          },
          error: (error) => {
            console.log(error);
            this.toaster.danger(error.message);
          },
        });
      }
    });
  }
}
