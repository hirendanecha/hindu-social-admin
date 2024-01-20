import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent {

  visible = true;
  percentage = 0;

  constructor(public toastService: ToastService) {}

  onTimerChange(event: number) {
    this.percentage = event * 25;
  }

  isTemplate(toast: any) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
