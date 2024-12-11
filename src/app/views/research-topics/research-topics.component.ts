import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteDialogComponent } from '../users/delete-confirmation-dialog/delete-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { FilterComponent } from '../../@shared/components/filter/filter.component';
import { Pagination } from '../../@shared/interface/pagination';
import { ToastService } from '../../services/toast.service';
import { ResearchTopicsService } from '../../services/research-topics.service';
import { CreateResearchTopicComponent } from './create-research-topic/create-research-topic.component';

@Component({
  selector: 'app-research-topics',
  templateUrl: './research-topics.component.html',
  styleUrls: ['./research-topics.component.scss'],
})
export class ResearchTopicsComponent implements OnInit {
  @ViewChild(FilterComponent) filterComponent: FilterComponent;

  activeTab = 1;
  researchTopicList: any = [];
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
  pageType = 'community';
  startDate: any;
  endDate: any;
  constructor(
    private researchTopicsService: ResearchTopicsService,
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
    this.getAllTopics();
  }

  getAllTopics(): void {
    this.spinner.show();
    this.researchTopicsService
      ?.getAllTopics(
        this.pagination.activePage,
        this.pagination.perPage,
        this.searchCtrl,
        this.pageType,
        this.startDate,
        this.endDate
      )
      ?.subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            this.researchTopicList = res?.data;
            this.pagination.totalItems = res?.pagination?.totalItems;
            this.pagination.perPage = res?.pagination?.pageSize;
          }
        },
        error: (error) => {
          this.spinner.hide();
        },
      });
  }
  openCommunity(id: any): void {
    this.router.navigate([`research/edit/${id}`]);
  }

  onPageChange(config: Pagination): void {
    this.pagination = config;
    this.getAllTopics();
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
    this.getAllTopics();
  }

  createTopics(): void {
    const modalRef = this.modalService.open(CreateResearchTopicComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.getAllTopics();
      }
    });
  }

  deleteGroup(id): void {
    const modalRef = this.modalService.open(DeleteDialogComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Research Topic';
    modalRef.componentInstance.message =
      'Are you sure want to delete this research topic?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.researchTopicsService.deleteResearchTopic(Number(id)).subscribe({
          next: (res) => {
            this.toaster.success(res.message);
            modalRef.close();
            this.getAllTopics();
          },
          error: (error) => {
            this.toaster.danger(error.message);
          },
        });
      }
    });
  }
}
