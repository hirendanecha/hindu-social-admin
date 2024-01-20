import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterComponent } from 'src/app/@shared/components/filter/filter.component';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class ViewPostComponent implements OnInit, AfterViewInit {
  // @Input() communityId: any;
  @ViewChild(FilterComponent) filterComponent: FilterComponent;
  postDetails: any = {};
  postId: string;
  isOpenCommentsPostId = '';
  isExpand = false;
  commentList = []
  constructor(
    private postService: PostService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.postId = this.route.snapshot.paramMap.get('id');
  }
  
  ngOnInit(): void {
    this.getPostDetails();
  }

  ngAfterViewInit(): void { }

  getPostDetails(): void {
    // const userId = this.userId;
    this.spinner.show();
    this.postService.getPostDetails(this.postId).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res) {
          this.postDetails = res[0];
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  viewComments(id): void {
    this.spinner.show();
    this.isExpand = this.isOpenCommentsPostId == id ? false : true;
    this.isOpenCommentsPostId = id;
    if (!this.isExpand) {
      this.isOpenCommentsPostId = null;
    } else {
      this.isOpenCommentsPostId = id;
    }

    this.postService.getComments(id).subscribe({
      next: (res) => {
        this.spinner.hide();
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
        this.spinner.hide();
        console.log(error);
      },
    });
  }
  onSearch(): void {
    const searchTerm = this.filterComponent.searchCtrl.value;
    const startDate = this.filterComponent.startDate;
    const toDate = this.filterComponent.toDate;
  }
}
