import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChannelService } from 'src/app/services/channels.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss'],
})
export class CreateChannelComponent {
  userForm = new FormGroup({
    profileid: new FormControl(),
    feature: new FormControl(false),
    firstname: new FormControl(''),
    unique_link: new FormControl({ value: '', disabled: true }),
    profile_pic_name: new FormControl(''),
  });
  profilePic = '';
  profileImg: any = {
    file: null,
    url: '',
  };
  selectedFile: any;
  myProp: string;
  hasDisplayedError = false;
  isEdit = false;
  disabled = false;
  selectedItems = [];
  memberIds: any = [];
  userList: readonly any[];
  profileId: number

  constructor(
    private spinner: NgxSpinnerService,
    private userService: UserService,
    public toastService: ToastService,
    public activateModal: NgbActiveModal,
    // private channelService: ChannelService
    private channelService: ChannelService,
    private router: Router
  ) { }

  ngOnInit(): void { }

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
    this.userForm.get('unique_link').enable();
    const channelName = this.userForm.get('firstname').value;
    const uniqueLink = this.slugify(channelName);
    this.userForm.get('unique_link').setValue(uniqueLink);
  }

  saveChanges(): void {
    if (this.userForm.valid) {
      console.log(this.userForm.value)
      this.spinner.show();
      this.channelService.createChannel(this.userForm.value).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.createAdmin(res?.data)
          this.activateModal.close('success');
          this.toastService.success('Channel created successfully');
        },
        error: (err) => {
          this.spinner.hide();
          console.log(err);
        },
      });
    }
  }

  upload() {
    this.spinner.show();
    this.channelService.upload(this.profileImg.file, 1, 'channel').subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (this.profileImg.file?.size < 5120000) {
          if (res.body) {
            this.profilePic = res?.body?.url;
            this.userForm.get('profile_pic_name').setValue(this.profilePic);
            this.saveChanges();
          }
        } else {
          if (!this.hasDisplayedError) {
            this.toastService.danger('Image is too large!');
            this.hasDisplayedError = true;
          }
        }

      },
      error: (err) => {
        this.spinner.hide();
        this.profileImg = {
          file: null,
          url: '',
        };
        return 'Could not upload the file:' + this.profileImg.file.name;
      },
    });
    if (this.onSelectUser.length < 0)
      this.toastService.danger('Please Select User');

  }
  onItemSelect(event) {
    this.getUserList(event.term);
    this.isEdit = true;
  }

  onSelectUser(item: any): void {
    // this.selectedItems.push(item.Id);
    this.userForm.get('profileid').setValue(item.Id)
    this.profileId = item.Id
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
  onFileSelected(event: any) {
    this.profileImg.file = event.target?.files?.[0];
    this.selectedFile = URL.createObjectURL(event.target.files[0]);
  }

  removePostSelectedFile(): void {
    this.selectedFile = null;
  }

  createAdmin(channelId): void {
    const data = {
      profileId: this.profileId,
      channelId: Number(channelId),
      isAdmin: 'Y',
    };
    this.channelService.createChannalAdminByMA(data).subscribe({
      next: (res: any) => {
        if (res) {
          this.router.navigate(['/channels'])
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
}
