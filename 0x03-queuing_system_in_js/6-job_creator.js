#!/usr/bin/node
import { createQueue } from 'kue';

const notificationQueue = createQueue({ name: 'push_notification_code' });

const notificationJob = notificationQueue.create('push_notification_code', {
  phoneNumber: '07045679939',
  message: 'Account registered',
});

notificationJob
  .on('enqueue', () => {
    console.log('Notification job created:', notificationJob.id);
  })
  .on('complete', () => {
    console.log('Notification job completed');
  })
  .on('failed attempt', () => {
    console.log('Notification job failed');
  });

notificationJob.save();
