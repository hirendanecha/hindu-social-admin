import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/containers/user';
@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  @Input() userId: any;
  @Input() message: any;
  @Input() title: any;
  visible = false;
  percentage = 0;
  type = '';
  position = 'top-end';
  resMessage = '';
  constructor(
    public activateModal: NgbActiveModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  onVisibleChange(event: boolean) {
    this.visible = event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange(event: number) {
    this.percentage = event * 25;
  }
}
