import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FilterComponent } from 'src/app/@shared/components/filter/filter.component';
import { Pagination } from 'src/app/@shared/interface/pagination';
import { ChannelService } from '../../services/channels.service';
import { ToastService } from 'src/app/services/toast.service';
import { DeleteDialogComponent } from '../users/delete-confirmation-dialog/delete-dialog.component';
import { CreateChannelComponent } from '../users/create-channel/create-channel.component';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent {

  @ViewChild(FilterComponent) filterComponent: FilterComponent;

  activeTab = 1;
  channelList: any = [];
  position = 'top-end';
  visible = false;
  percentage = 0;
  message = '';
  type = '';
  searchCtrl: '';
  pagination: Pagination = {
    activePage: 1,
    perPage: 15,
    totalItems: 0,
  };
  pageType = 'channel'
  startDate: any;
  endDate: any;
  constructor(
    private channelsService: ChannelService,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toaster: ToastService

  ) {
    // this.searchCtrl = new FormControl('');
    // this.searchCtrl.valueChanges
    //   .pipe(distinctUntilChanged(), debounceTime(500))
    //   .subscribe((val: string) => {
    //     this.getCommunities();
    //   });
  }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.getChannels();
  }

  getChannels(): void {
    this.spinner.show();
    this.channelsService
      ?.getAllChannels(
        this.pagination.activePage,
        this.pagination.perPage,
        this.searchCtrl,
        this.startDate,
        this.endDate
      )?.subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            this.channelList = res?.data;

            console.log(this.channelList);

            this.pagination.perPage = res?.pagination?.pageSize;
            this.pagination.totalItems = res?.pagination?.totalItems;
          }
        },
        error: (error) => {
          this.spinner.hide();
        },
      });
  }

  changeChannelStatus(channel, status): void {
    this.spinner.show();
    this.channelsService
      .changeChannelStatus(channel.id, status)
      .subscribe({
        next: (res) => {
          this.toaster.success(res.message);
          this.getChannels();
        },
        error: (error) => {
          this.toaster.danger(error.message);
        },
      });
  }

  createChannel(): void {
    const modalRef = this.modalService.open(CreateChannelComponent, {
      centered: true,
    });
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.getChannels();
      }
    });
  }

  deleteChannel(Id): void {
    const modalRef = this.modalService.open(DeleteDialogComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Channel';
    modalRef.componentInstance.message =
      'Are you sure want to delete this channel?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.channelsService.deleteChannel(Id).subscribe({
          next: (res) => {
            this.toaster.success(res.message);
            modalRef.close();
            this.getChannels();
          },
          error: (error) => {
            this.toaster.danger(error.message);
          },
        });
      }
    });
  }

  openChannel(id: any): void {
    this.router.navigate([`channels/edit/${id}`]);
  }

  onPageChange(config: Pagination): void {
    this.pagination = config;
    this.getChannels();
  }

  onVisibleChange(event: boolean) {
    this.visible = event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange(event: number) {
    this.percentage = event * 25;
  }

  onSearch(): void {
    this.searchCtrl = this.filterComponent.searchCtrl.value;
    this.startDate = this.filterComponent.startDate;
    this.endDate = this.filterComponent.toDate;
    this.getChannels();
  }
}
