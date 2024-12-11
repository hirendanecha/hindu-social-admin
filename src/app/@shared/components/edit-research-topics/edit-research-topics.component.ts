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
import { debounceTime, forkJoin, fromEvent } from 'rxjs';
import { ResearchTopicsService } from '../../../services/research-topics.service';
import { ToastService } from '../../../services/toast.service';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-edit-research-topics',
  templateUrl: './edit-research-topics.component.html',
  styleUrls: ['./edit-research-topics.component.scss'],
})
export class EditResearchTopicsComponent implements OnInit, AfterViewInit {
  researchTopicDetails: any = {};
  memberDetails: any = {};
  selectedItems = [];
  uniqueLink: any;
  isPage = false;
  searchText = '';
  memberIds: any = [];
  userNameSearch = '';
  userList = [];
  users: any;

  groupMembers: any;
  allCountryData: any;
  @ViewChild('zipCode') zipCode: ElementRef;
  isEdit = false;

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

  constructor(
    private researchTopicsService: ResearchTopicsService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    public toastService: ToastService
  ) {
    this.uniqueLink = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getTopicDetails();
  }
  ngAfterViewInit(): void {
    // this.getUserList();
  }

  getTopicDetails(): void {
    this.spinner.show();
    this.researchTopicsService.getTopicById(this.uniqueLink).subscribe({
      next: (res: any) => {
        if (res) {
          this.spinner.hide();
          this.researchTopicDetails = res;
          [this.memberDetails] = res.groupMembersList.filter((ele: any) => {
            return ele.profileId === this.researchTopicDetails.ID;
          });
          this.memberIds = res.groupMembersList.map(
            (member) => member.profileId
          );
          this.groupMembers = res.groupMembersList.map((member) => member);
          console.log(this.groupMembers, 'memberDetails');
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

  upload() {
    let uploadObs = {};
    if (this.groupImg?.file?.name) {
      uploadObs['logoImg'] = this.researchTopicsService.upload(
        this.groupImg?.file
      );
    }

    if (this.groupCoveredImg?.file?.name) {
      uploadObs['coverImg'] = this.researchTopicsService.upload(
        this.groupCoveredImg?.file
      );
    }
    if (Object.keys(uploadObs)?.length > 0) {
      this.spinner.show();

      forkJoin(uploadObs).subscribe({
        next: (res: any) => {
          if (res?.groupImg?.body?.url) {
            this.groupImg['file'] = null;
            this.groupImg['url'] = res?.logoImg?.body?.url;
            this.researchTopicDetails.ProfilePicName = res?.logoImg?.body?.url;
          }

          if (res?.groupCoveredImg?.body?.url) {
            this.groupCoveredImg['file'] = null;
            this.groupCoveredImg['url'] = res?.coverImg?.body?.url;
            this.researchTopicDetails.CoverPicName = res?.coverImg?.body?.url;
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

  saveChanges(): void {
    const data = {
      groupData: {
        FirstName: this.researchTopicDetails.FirstName,
        Username: this.researchTopicDetails.Username,
        CoverPicName: this.researchTopicDetails.CoverPicName,
        ProfilePicName: this.researchTopicDetails.ProfilePicName,
        PageDescription: this.researchTopicDetails.PageDescription,
      },
      selectedMembers: this.selectedItems,
    };

    this.researchTopicsService
      .updateTopic(this.researchTopicDetails.ID, data)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.isEdit = false;
          this.toastService.success('research topic updated successfully');
          this.getTopicDetails();
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
          this.toastService.danger('Something went wrong!');
        },
      });
    // if (this.selectedItems.length) {
    //   this.selectedItems.forEach((e) => {
    //     this.createAdmin(e);
    //   });
    // }
  }

  createAdmin(profileId): void {
    const data = {
      profileId: profileId,
      communityId: Number(this.uniqueLink),
      isActive: 'Y',
      isAdmin: 'Y',
    };
    // this.researchTopicsService.createCommunityAdmin(data).subscribe({
    //   next: (res: any) => {
    //     if (this.isPage) {
    //       this.router.navigate(['/pages']);
    //     } else {
    //       this.router.navigate(['/community']);
    //     }
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   },
    // });
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

  onChangeData(): void {
    this.isEdit = true;
  }

  onSelectUser(item): void {
    this.selectedItems.push(item.Id);
    console.log(item);
  }

  removeMember(id): void {
    this.spinner.show();
    const data = {
      researchProfileId: this.researchTopicDetails?.ID,
      profileId: id,
    };

    this.researchTopicsService.leaveGroup(data).subscribe({
      next: (res: any) => {
        if (res) {
          this.spinner.hide();
          this.getTopicDetails();
        }
      },
      error: (err) => {
        console.log(err);
        this.spinner.hide();
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
}
