import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdvertisementService } from '../../services/advertisement.service';
import { ToastService } from '../../services/toast.service';
import { ChannelService } from 'src/app/services/channels.service';
@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
})
export class AdvertisementComponent implements OnInit {
  selectedFile: any;
  profileImg: any = {
    file: null,
    url: '',
  };

  advertizementData: any = {
    id: null,
    imageUrl: '',
    updatedDate: null,
  };

  advertisementDataList: any[] = [];

  constructor(
    private channelService: ChannelService,
    private advertisementService: AdvertisementService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getadvertizements();
  }

  ngAfterViewInit(): void {}

  onFileSelected(event: any, id: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const ad = this.advertisementDataList.find((ad) => ad.id === id);
        if (ad) {
          ad.imageUrl = e.target.result;
          ad.file = file;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removePostSelectedFile(id: number) {
    const ad = this.advertisementDataList.find((ad) => ad.id === id);
    if (ad) {
      ad.imageUrl = '';
      ad.file = null;
    }
  }
  getadvertizements(): void {
    this.advertisementService.getAdvertisement().subscribe({
      next: (res: any) => {
        this.advertisementDataList = res;
        this.ensureMinimumCards();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ensureMinimumCards(): void {
    const minimumCards = 12;
    const currentLength = this.advertisementDataList.length;
    if (currentLength < minimumCards) {
      for (let i = currentLength; i < minimumCards; i++) {
        this.advertisementDataList.push({
          id: i + 1,
          imageUrl: '',
          createdDate: null,
          updatedDate: null,
        });
      }
    }
  }

  onLinkChange(advertisement: any) {
    advertisement.isLinkChanged = true;
  }

  saveAdvertisement(id: number): void {
    const ad = this.advertisementDataList.find((ad) => ad.id === id);
    if (ad && ad.file) {
      this.channelService.upload(ad.file).subscribe({
        next: (res: any) => {
          if (res.body.url) {
            ad.imageUrl = res.body.url;
            this.saveChanges(ad);
          }
        },
        error: (err: any) => {
          this.profileImg = {
            file: null,
            url: '',
          };
        },
      });
    } else if (ad && ad.link && !ad.file) {
      this.saveChanges(ad);
    }
  }

  saveChanges(ad: any): void {
    this.spinner.show();

    if ((ad.imageUrl && ad.createdDate) || (ad.link && ad.createdDate)) {
      const data = {
        id: ad.id,
        imageUrl: ad.imageUrl,
        link: ad.link,
      };
      console.log('update', data);

      this.advertisementService.getAdvertisementData(data).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.toastService.success('Advertisement updated successfully');
          this.getadvertizements();
        },
        error: (err) => {
          this.spinner.hide();
          console.log(err);
        },
      });
    } else if (ad.imageUrl && ad.createdDate === null) {
      const data = {
        imageUrl: ad.imageUrl,
        link: ad.link,
      };
      this.advertisementService.getAdvertisementData(data).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.toastService.success('Advertisement created successfully');
          this.getadvertizements();
        },
        error: (err) => {
          this.spinner.hide();
          console.log(err);
        },
      });
    }
  }

  restData(): void {
    this.profileImg = {
      file: null,
      url: '',
    };
    this.selectedFile = null;
  }

  deleteAdvertisement(id): void {
    this.advertisementService.deleteAdvertisement(id).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastService.danger('Advertisement deleted successfully');
        this.removePostSelectedFile(id);
        const ad = this.advertisementDataList.find((ad) => ad.id === id);
        if (ad) {
          ad.id = null;
          ad.link = '';
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.log(err);
      },
    });
  }
}
