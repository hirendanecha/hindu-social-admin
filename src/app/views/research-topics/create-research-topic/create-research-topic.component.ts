import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { ResearchTopicsService } from 'src/app/services/research-topics.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-research-topic',
  templateUrl: './create-research-topic.component.html',
  styleUrls: ['./create-research-topic.component.scss'],
})
export class CreateResearchTopicComponent {
  researchTopicForm = new FormGroup({
    UserID: new FormControl(),
    FirstName: new FormControl(''),
    UniqueLink: new FormControl({ value: '', disabled: true }),
    ProfilePicName: new FormControl(''),
    CoverPicName: new FormControl(''),
    AccountType: new FormControl('G'),
  });
  researchTopicDetails: any = {};
  profilePic = '';
  selectedFile: any;
  selectedCoveredFile: any;
  groupImg: any = {
    file: null,
    url: '',
  };

  groupCoveredImg: any = {
    file: null,
    url: '',
  };
  myProp: string;
  hasDisplayedError = false;
  isEdit = false;
  disabled = false;
  selectedItems = [];
  memberIds: any = [];
  userList: readonly any[];
  profileId: number;

  constructor(
    private spinner: NgxSpinnerService,
    private userService: UserService,
    public toastService: ToastService,
    public activateModal: NgbActiveModal,
    private researchTopicsService: ResearchTopicsService,
    private router: Router
  ) {}

  ngOnInit(): void {}

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
    const uniqueLink = this.slugify(this.researchTopicDetails.FirstName);
    this.researchTopicDetails.UniqueLink = uniqueLink;
  }

  saveChanges(): void {
    if (this.researchTopicDetails) {
      console.log(this.researchTopicDetails);
      this.researchTopicDetails.AccountType = 'G';
      this.spinner.show();
      this.researchTopicsService
        .createResearchTopic(this.researchTopicDetails)
        .subscribe({
          next: (res: any) => {
            this.spinner.hide();
            this.activateModal.close('success');
            this.toastService.success('Group created successfully');
          },
          error: (err) => {
            this.spinner.hide();
            console.log(err);
          },
        });
    }
  }

  upload() {
    let uploadObs = {};
    if (this.groupImg?.file?.name) {
      uploadObs['groupImg'] = this.researchTopicsService.upload(
        this.groupImg?.file
      );
    }

    if (this.groupCoveredImg?.file?.name) {
      uploadObs['groupCoveredImg'] = this.researchTopicsService.upload(
        this.groupCoveredImg?.file
      );
    }
    if (Object.keys(uploadObs)?.length > 0) {
      this.spinner.show();

      forkJoin(uploadObs).subscribe({
        next: (res: any) => {
          if (res?.groupImg?.body?.url) {
            this.groupImg['file'] = null;
            this.groupImg['url'] = res?.url;
            this.researchTopicDetails.ProfilePicName = res?.groupImg?.body?.url;
          }

          if (res?.groupCoveredImg?.body?.url) {
            this.groupCoveredImg['file'] = null;
            this.groupCoveredImg['url'] = res?.coverImg?.body?.url;
            this.researchTopicDetails.CoverPicName = res?.groupCoveredImg?.body?.url;
          }

          this.spinner.hide();
          this.saveChanges();
        },
        error: (err) => {
          this.spinner.hide();
        },
      });
    } else {
      this.saveChanges();
    }
  }
  onItemSelect(event) {
    this.getUserList(event.term);
    this.isEdit = true;
  }

  onSelectUser(item: any): void {
    this.researchTopicDetails.UserID = item.UserID;
  }
  getUserList(search: string = ''): void {
    this.spinner.show();
    this.userService.getProfileList(search).subscribe({
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
    this.groupImg.file = event.target?.files?.[0];
    this.selectedFile = URL.createObjectURL(event.target.files[0]);
  }

  removePostSelectedFile(): void {
    this.selectedFile = null;
  }

  onCoveredFileSelected(event: any) {
    this.groupCoveredImg.file = event.target?.files?.[0];
    this.selectedCoveredFile = URL.createObjectURL(event.target.files[0]);
  }

  removeCoveredSelectedFile(): void {
    this.selectedCoveredFile = null;
  }
  onTopicNameChange(event: any): void {
    const uniqueLink = this.slugify(event.target.value);
    this.researchTopicDetails.UniqueLink = uniqueLink;
  }
}
