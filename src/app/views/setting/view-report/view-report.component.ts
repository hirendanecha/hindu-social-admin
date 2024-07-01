import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BugReportService } from 'src/app/services/bug-report.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent implements OnInit{
  ticketId: number;
  ticketDetails: any = [];
  previewSrc: string = '';

  constructor(
    private route: ActivatedRoute,
    private bugReportService: BugReportService,
    private router: Router,
  ){
    this.ticketId = +this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getTicketDetails()
  }

  getTicketDetails(){
    this.bugReportService.getBugreportById(this.ticketId).subscribe({
      next: (res: any) => {
        if (res) {
          this.ticketDetails = res[0]
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  isVideoFile(media: string): boolean {
    const FILE_EXTENSIONS = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.mpeg', '.rmvb', '.m4v', '.3gp', '.webm', '.ogg', '.vob', '.ts', '.mpg'];
    return FILE_EXTENSIONS.some((ext) => media?.endsWith(ext));
  }

  openImagePreview(src: string) {
    this.previewSrc = src;
  }

  closeImagePreview() {
    this.previewSrc = ''
  }

  backToSetting(){
    this.router.navigate([`report-bugs/`]);
  }
}
