import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../@shared/interface/pagination';
import { PostService } from '../../services/post.service';
import { DeleteDialogComponent } from '../users/delete-confirmation-dialog/delete-dialog.component';
import { Router } from '@angular/router';
import { FilterComponent } from '../../@shared/components/filter/filter.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../services/toast.service';
import { SocketService } from '../../services/socket.service';
declare var jwplayer: any;
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
  fromDate: Date;
  toDate: Date;
  startDate: Date;
  hasMoreData = false;
  shouldShowSearchInput: boolean = false;
  isOpenCommentsPostId: string | null = '';
  isExpand = false;
  commentList = [];
  activePage = 1;
  player: any;

  constructor(
    private modalService: NgbModal,
    private postService: PostService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastService,
    private socketService: SocketService,
  ) {}

  ngOnInit(): void {
    this.getPostList();
  }

  loadMore() {
    this.activePage++;
    this.getPostList();
  }

  getPostList(): void {
    this.spinner.show();
    const data = {
      page: this.activePage,
      size: 10,
      startDate: this.startDate,
      endDate: this.toDate,
    };
    this.postService.getAllPost(data).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res?.data?.data.length > 0) {
          this.postList = this.postList.concat(res.data.data);
          this.hasMoreData = false;
          this.postList.forEach((ele: any) => {
            if (ele.parentPostId) {
              return this.getPostById(ele.parentPostId);
            } else {
              return ele;
            }
          });
          this.postList.forEach((ele: any) => {
            if (
              (ele?.id && ele.streamname && ele?.posttype === 'V') ||
              ele?.posttype === 'R'
            ) {
              setTimeout(() => {
                this.playVideo(ele);
              }, 100);
            }
          });
        } else {
          this.hasMoreData = true;
        }
      },
      error: (error) => {
        this.spinner.hide();
        this.toaster.danger(error.message);
      },
    });
  }

  getPostById(id: number) {
    this.postService.getPostsByPostId(id).subscribe({
      next: (res: any) => {
        const index = this.postList.findIndex((ele) => ele.parentPostId === id);
        this.postList[index]['parentPost'] = res[0];
      },
      error(err) {
        console.log(err);
      },
    });
  }

  playVideo(post: any) {
    const config = {
      file: post?.streamname,
      image: post?.thumbfilename,
      mute: false,
      autostart: false,
      volume: 30,
      height: '300px',
      width: 'auto',
      pipIcon: 'disabled',
      displaydescription: true,
      playbackRateControls: false,
      aspectratio: '16:9',
      autoPause: {
        viewability: false,
      },
      controls: true,
    };
    if (post.id) {
      const jwPlayer = jwplayer('jwVideo-' + post.id);
      if (jwPlayer) {
        this.player = jwPlayer?.setup({
          ...config,
        });
        this.player?.load();
      }
    }
  }

  hidePost(Id: number, isdeleted: string) {
    const modalRef = this.modalService.open(DeleteDialogComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = isdeleted === 'Y' ? 'Hide Post' : 'Show Post';
    modalRef.componentInstance.successBtn = isdeleted === 'Y' ? 'Hide' : 'Show';
    modalRef.componentInstance.userId = Id;
    modalRef.componentInstance.message =
      `Are you sure want to ${isdeleted === 'Y' ? 'Hide' : 'Show'} this post from Newsfeed?`;
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.postService.hidePost(Id, isdeleted).subscribe({
          next: (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              modalRef.close();
              this.postList = [];
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

  deletePost(Id: any) {
    const modalRef = this.modalService.open(DeleteDialogComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Delete Post';
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
              this.postList = [];
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
    this.router.navigate([`newsfeed/${id}`]);
  }
  onVisibleChange(event: boolean) {
    this.visible = event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange(event: number) {
    this.percentage = event * 25;
  }

  onSearch(): void {
    this.startDate = this.filterComponent.startDate;
    this.toDate = this.filterComponent.toDate;
    this.postList = [];
    this.getPostList();
  }

  viewComments(id): void {
    this.isExpand = this.isOpenCommentsPostId == id ? false : true;
    this.isOpenCommentsPostId = id;
    if (!this.isExpand) {
      this.isOpenCommentsPostId = null;
    } else {
      this.isOpenCommentsPostId = id;
    }
    const data = {
      postId: id,
    };
    this.postService.getComments(data).subscribe({
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

  reactLikeOnPost(post: any) {
    post.likescount = post?.likescount + 1;
    post.totalReactCount = post?.totalReactCount + 1;
    const data = {
      postId: post.id,
      profileId: 1,
      likeCount: post.likescount,
      actionType: 'L',
      toProfileId: post.profileid,
    };
    this.likeDisLikePost(data);
  }

  likeDisLikePost(data): void {
    this.socketService.likeFeedPost(data, (res) => {
      return;
    });
  }
}
