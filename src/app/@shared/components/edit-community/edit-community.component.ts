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
import { CommunityService } from 'src/app/services/community.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-edit-community',
  templateUrl: './edit-community.component.html',
  styleUrls: ['./edit-community.component.scss'],
})
export class EditCommunityComponent implements OnInit, AfterViewInit {
  communityDetails: any = {};
  memberDetails: any = {};
  selectedItems = [];
  communityId: any;
  isPage = false;
  searchText = '';
  memberIds: any = [];
  userNameSearch = '';
  userList = [];
  users: any;

  adminList: any;

  userForm = new FormGroup({
    FirstName: new FormControl(''),
    LastName: new FormControl(''),
    Country: new FormControl('', Validators.required),
    Zip: new FormControl('', Validators.required),
    MobileNo: new FormControl(''),
    City: new FormControl(''),
    State: new FormControl(''),
    Email: new FormControl('', Validators.required),
    Username: new FormControl('', Validators.required),
    UserID: new FormControl('', Validators.required),
    ProfilePicName: new FormControl('', Validators.required),
    CoverPicName: new FormControl('', Validators.required),
  });
  allCountryData: any;
  @ViewChild('zipCode') zipCode: ElementRef;
  isEdit = false;

  constructor(
    private communityService: CommunityService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    public toastService: ToastService
  ) {
    this.communityId = this.route.snapshot.paramMap.get('id');
    this.isPage = this.router.routerState.snapshot.url.includes('pages');
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.getAllCountries();
  }
  ngAfterViewInit(): void {
    this.getUserList();
    fromEvent(this.zipCode.nativeElement, 'input')
      .pipe(debounceTime(1000))
      .subscribe((event) => {
        const val = event['target'].value;
        if (val.length > 3) {
          this.onZipChange(val);
        }
      });
  }

  getUserDetails(): void {
    this.spinner.show();
    this.communityService.getCommunityById(this.communityId).subscribe({
      next: (res: any) => {
        if (res) {
          this.spinner.hide();
          this.communityDetails = res[0];
          [this.memberDetails] = res[0].memberList.filter((ele: any) => {
            return ele.profileId === this.communityDetails.profileId;
          });
          this.memberIds = res[0].memberList.map((member) => member.profileId);
          this.adminList = res[0].memberList.map((member) => member);
          const data = {
            FirstName: this.memberDetails.FirstName,
            LastName: this.memberDetails.LastName,
            Country: this.memberDetails.Country,
            Zip: this.memberDetails.Zip,
            City: this.memberDetails.City,
            State: this.memberDetails.State,
            Username: this.memberDetails.Username,
            Email: this.memberDetails.Email,
            MobileNo: this.memberDetails.MobileNo,
            UserID: this.memberDetails.UserID,
            ProfilePicName: this.memberDetails.ProfilePicName,
            CoverPicName: this.memberDetails?.CoverPicName,
          };
          this.userForm.setValue(data);
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
    if (this.userForm.value) {
      this.userService
        .updateProfile(this.memberDetails.profileId, this.userForm.value)
        .subscribe({
          next: (res: any) => {
            this.spinner.hide();
            this.isEdit = false;
            this.toastService.success('Update successfully');
          },
          error: (error) => {
            this.spinner.hide();
            // this.toastService.danger('Please try again');
            console.log(error);
          },
        });
      if (this.selectedItems.length) {
        this.selectedItems.forEach((e) => {
          this.createAdmin(e);
        });
      }
    }
  }

  createAdmin(profileId): void {
    const data = {
      profileId: profileId,
      communityId: Number(this.communityId),
      isActive: 'Y',
      isAdmin: 'Y',
    };
    this.communityService.createCommunityAdminByMA(data).subscribe({
      next: (res: any) => {
        if (this.isPage) {
          this.router.navigate(['/pages']);
        } else {
          this.router.navigate(['/community']);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
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

  getAllCountries() {
    this.spinner.show();
    this.userService.getCountriesData().subscribe({
      next: (result) => {
        this.spinner.hide();
        this.allCountryData = result;
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  changeCountry(e) {
    this.userForm.get('Country').setValue(e.target.value);
    this.userForm.get('Zip').setValue('');
    this.userForm.get('State').setValue('');
    this.userForm.get('City').setValue('');
  }

  onZipChange(event) {
    this.spinner.show();
    const country = this.userForm.value.Country;
    this.userService.getZipData(event, country).subscribe({
      next: (data) => {
        this.spinner.hide();
        const zip_data = data[0];
        if (zip_data?.state) {
          zip_data ? this.userForm.get('State').setValue(zip_data.state) : null;
          zip_data ? this.userForm.get('City').setValue(zip_data.city) : null;
        } else {
          this.spinner.hide();
          // this.toastService.danger('Please check and enter valid country or zip code.');
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.log(err);
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
    this.communityService
      .removeFromCommunity(this.communityDetails?.Id, profileId)
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
