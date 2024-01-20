import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any = [];

  success(msg: string) {
    this.toasts.push({ textOrTpl: msg, className: 'bg-success text-dark', visible: true });
  }

  danger(msg: string) {
    this.toasts.push({ textOrTpl: msg, className: 'bg-danger text-light', visible: true });
  }

  info(msg: string) {
    this.toasts.push({ textOrTpl: msg, className: 'bg-info text-light', visible: true });
  }

  warring(msg: string) {
    this.toasts.push({ textOrTpl: msg, className: 'bg-warring text-light', visible: true });
  }

  remove(toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
