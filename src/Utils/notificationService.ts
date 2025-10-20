import { notification } from 'antd';
import React from 'react';

export interface NotificationOptions {
  message: string;
  description?: string;
  duration?: number;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  onClick?: () => void;
}

export class NotificationService {
  private static api = notification;

  static success(options: NotificationOptions) {
    this.api.success({
      message: options.message,
      description: options.description,
      duration: options.duration || 4.5,
      placement: options.placement || 'topRight',
      onClick: options.onClick,
    });
  }

  static error(options: NotificationOptions) {
    this.api.error({
      message: options.message,
      description: options.description,
      duration: options.duration || 4.5,
      placement: options.placement || 'topRight',
      onClick: options.onClick,
    });
  }

  static info(options: NotificationOptions) {
    this.api.info({
      message: options.message,
      description: options.description,
      duration: options.duration || 4.5,
      placement: options.placement || 'topRight',
      onClick: options.onClick,
    });
  }

  static warning(options: NotificationOptions) {
    this.api.warning({
      message: options.message,
      description: options.description,
      duration: options.duration || 4.5,
      placement: options.placement || 'topRight',
      onClick: options.onClick,
    });
  }

  static loading(options: NotificationOptions) {
    const key = Date.now().toString();
    this.api.open({
      message: options.message,
      description: options.description,
      key,
      duration: 0,
      icon: React.createElement('div', { className: 'ant-notification-loading' }),
    });
    return key;
  }

  static close(key: string) {
    this.api.destroy(key);
  }

  static closeAll() {
    this.api.destroy();
  }

  static postLiked(postAuthor: string) {
    this.info({
      message: 'Post Liked',
      description: `You liked ${postAuthor}'s post`,
      duration: 3,
    });
  }

  static postUnliked(postAuthor: string) {
    this.info({
      message: 'Post Unliked',
      description: `You unliked ${postAuthor}'s post`,
      duration: 3,
    });
  }

  static friendRequestReceived(fromUser: string) {
    this.info({
      message: 'New Friend Request',
      description: `${fromUser} sent you a friend request`,
      duration: 5,
    });
  }

  static friendRequestAccepted(byUser: string) {
    this.success({
      message: 'Friend Request Accepted',
      description: `${byUser} accepted your friend request`,
      duration: 4,
    });
  }

  static postUploaded() {
    this.success({
      message: 'Post Uploaded',
      description: 'Your post has been uploaded successfully',
      duration: 3,
    });
  }

  static postDeleted() {
    this.info({
      message: 'Post Deleted',
      description: 'Your post has been deleted',
      duration: 3,
    });
  }

  static profileUpdated() {
    this.success({
      message: 'Profile Updated',
      description: 'Your profile has been updated successfully',
      duration: 3,
    });
  }

  static loginSuccess() {
    this.success({
      message: 'Welcome Back!',
      description: 'You have successfully logged in',
      duration: 3,
    });
  }

  static logoutSuccess() {
    this.info({
      message: 'Logged Out',
      description: 'You have been logged out successfully',
      duration: 3,
    });
  }

  static networkError() {
    this.error({
      message: 'Network Error',
      description: 'Please check your internet connection and try again',
      duration: 5,
    });
  }

  static uploadError() {
    this.error({
      message: 'Upload Failed',
      description: 'Failed to upload file. Please try again',
      duration: 4,
    });
  }
}

export default NotificationService;
