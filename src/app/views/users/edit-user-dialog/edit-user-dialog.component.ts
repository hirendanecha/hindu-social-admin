import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/containers/user';
@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss'],
})
export class EditUserDialogComponent implements OnInit {
  @Input() userId: any;
  userDetails: User = new User();
  constructor(
    public activateModal: NgbActiveModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails(): void {
    const userId = this.userId;
    this.userService.getUserDetailsById(userId).subscribe({
      next: (res: any) => {
        if (res) {
          this.userDetails = res[0];
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
