import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityPostService } from '../../../services/community-post.service';
import { CommunityService } from '../../../services/community.service';
import { PostService } from '../../../services/post.service';
import { UserService } from '../../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner/lib/ngx-spinner.service';
@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class ViewCommunityPostComponent implements OnInit, AfterViewInit {
  // @Input() communityId: any;
  postDetails: any = {};
  postId: string | null;
  constructor(  
    private communityPostService: CommunityPostService,
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

  ngAfterViewInit(): void {}

  getPostDetails(): void {
    // const userId = this.userId;
    this.spinner.show();
    this.communityPostService.viewPost(this.postId).subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide();
          this.postDetails = res[0];
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }
}
