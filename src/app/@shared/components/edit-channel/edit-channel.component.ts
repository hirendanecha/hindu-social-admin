import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, fromEvent } from 'rxjs';
import { ChannelService } from 'src/app/services/channels.service';
import { CommunityService } from 'src/app/services/community.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss'],
})
export class EditChannelComponent implements OnInit, AfterViewInit {
  channelDetails: any = {};
  memberDetails: any = {};
  selectedItems = [];
  communityId: any;
  channelId: any;
  isPage = false;
  memberIds: any = [];
  userNameSearch = '';
  userList = [];
  users: any;

  adminList: any;

  isEdit = false;

  constructor(
    private channelService: ChannelService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    public toastService: ToastService
  ) {
    this.channelId = this.route.snapshot.paramMap.get('id');
    this.isPage = this.router.routerState.snapshot.url.includes('pages');
  }

  ngOnInit(): void {
    this.getUserDetails();
  }
  ngAfterViewInit(): void {
    this.getUserList();
  }

  getUserDetails(): void {
    this.spinner.show();
    this.channelService.findChannelById(this.channelId).subscribe({
      next: (res: any) => {
        if (res) {
          this.spinner.hide();
          this.channelDetails = res[0];
          this.memberDetails = res[0].memberList[0];
          this.memberIds = res[0].memberList.map((member) => member.profileId);
          this.adminList = res[0].memberList.map((member) => member);
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  onItemSelect(event) {
    this.getUserList(event.term);
    this.isEdit = true;
  }

  saveChanges(): void {
    if (this.selectedItems.length) {
      this.selectedItems.forEach((e) => {
        this.createAdmin(e);
      });
    }
  }

  createAdmin(profileId): void {
    const data = {
      profileId: profileId,
      channelId: Number(this.channelId),
      isAdmin: 'Y',
    };
    this.channelService.createChannalAdminByMA(data).subscribe({
      next: (res: any) => {
        if (res) {
          this.getUserDetails();
        }
        // if (this.isPage) {
        // } else {
        //   this.router.navigate(['/channels']);
        // }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getUserList(search: string = ''): void {
    this.spinner.show();
    this.channelService.getProfileList(search).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res?.data?.length > 0) {
          this.userList = res.data;
        } else {
          this.selectedItems = [];
          this.userList = [];
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  onChangeData(): void {
    this.isEdit = true;
  }

  onSelectUser(item): void {
    this.selectedItems.push(item.Id);
    console.log(item);
  }

  removeasAdmin(profileId) {
    this.channelService
      .removeFromChannel(this.channelDetails?.id, profileId)
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.toastService.success(res.message);
            this.getUserDetails();
          }
        },
        error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        },
      });
  }
}
