import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket: any;

  constructor() {
    const token = localStorage.getItem('auth-token');
    if (token) {
      const customHeaders = {
        Authorization: `Bearer ${token}`,
      };
      this.socket = io(environment.socketUrl, {
        reconnectionDelay: 100,
        reconnectionDelayMax: 300,
        randomizationFactor: 0.2,
        reconnectionAttempts: 50000,
        transports: ['websocket'],
        auth: customHeaders,
      });
    }
  }

 // socket for suspend user //
  isSuspendUser(params, callback: (post: any) => void) {
    this.socket.emit('suspend-user', params, callback);
  }
  
  // socket for posts //
  likeFeedPost(params, callback: (post: any) => void) {
    this.socket?.emit('likeOrDislike', params, callback);
  }

  // getPost(params, callback: (post: any) => void) {
  //   this.socket.emit('get-new-post', params, callback);
  // }
  // createPost(params, callback: (post: any) => void) {
  //   this.socket.emit('create-new-post', params, callback);
  // }

  // // socket for community //
  // getCommunityPost(params, callback: (post: any) => void) {
  //   this.socket.emit('get-community-post', params, callback);
  // }

  // createCommunityPost(params, callback: (post: any) => void) {
  //   this.socket.emit('create-community-post', params, callback);
  // }

  // getUnApproveCommunity(params, callback: (post: any) => void) {
  //   this.socket.emit('get-unApprove-community', params, callback);
  // }

  // getApproveCommunity(params, callback: (post: any) => void) {
  //   this.socket.emit('get-Approve-community', params, callback);
  // }
}
