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
  selectedusers = [];
  communityId: any;
  channelId: any;
  isPage = false;
  memberIds: any = [];
  userNameSearch = '';
  userList = [];
  users: any;

  adminList: any;

  isEdit = false;
  selectedFile: any;
  channelImg: any = {
    file: null,
    url: '',
  };

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

  onFileSelected(event: any) {
    this.channelImg.file = event.target?.files?.[0];
    this.selectedFile = URL.createObjectURL(event.target.files[0]);
  }

  removePostSelectedFile(): void {
    this.selectedFile = null;
  }

  upload() {
    if (this.channelImg.file) {
      this.spinner.show();
      this.channelService.upload(this.channelImg.file).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (this.channelImg.file?.size < 5120000) {
            if (res.body) {
              this.channelDetails.profile_pic_name = res?.body?.url;
              this.saveChanges();
            }
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.channelImg = {
            file: null,
            url: '',
          };
          return 'Could not upload the file:' + this.channelImg.file.name;
        },
      });
    } else {
      this.saveChanges();
    }
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

  slugify = (str: string) => {
    return str?.length > 0
      ? str
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : '';
  };

  onChannelNameChange(): void {
    if (!this.isEdit) {
      this.isEdit = true;
    }
    this.channelDetails.unique_link = this.slugify(
      this.channelDetails.firstname
    );
  }

  onChangeTag(event: any) {
    if (!this.isEdit) {
      this.isEdit = true;
    }
    this.channelDetails.Username = event.target.value
      .replace(/\s+/g, '')
      .replace(/,+/g, ',');
  }

  saveChanges(): void {
    const id = this.channelDetails.id;
    const upadtedChannelData = {
      profileid: this.channelDetails.profileid,
      profile_pic_name: this.channelDetails.profile_pic_name,
      firstname: this.channelDetails.firstname,
      Username: this.channelDetails.Username,
      unique_link: this.channelDetails.unique_link,
      feature: this.channelDetails.feature,
    };
    this.channelService.editChannal(id, upadtedChannelData).subscribe({
      next: (res: any) => {
        if (res) {
          this.getUserDetails();
          this.removePostSelectedFile();
          if (this.isEdit) {
            this.isEdit = false;
          }
        }
      },
    });

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
        this.toastService.danger(error.error.message);
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

  resetSelect(event) {
    if (event?.value?.Id) {
      this.selectedItems = this.selectedItems.filter(
        (item) => item !== event.value.Id
      );
    } else {
      this.selectedItems = [];
    }
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
