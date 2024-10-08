#!/usr/bin/node
import { Queue, Job } from 'kue';

export const createNotificationJobs = (notifications, notificationQueue) => {
  if (!(notifications instanceof Array)) {
    throw new Error('Notifications is not an array');
  }
  for (const notificationInfo of notifications) {
    const job = notificationQueue.create('push_notification_code_3', notificationInfo);

    job
      .on('enqueue', () => {
        console.log('Notification job created:', job.id);
      })
      .on('complete', () => {
        console.log('Notification job', job.id, 'completed');
      })
      .on('failed', (error) => {
        console.log('Notification job', job.id, 'failed:', error.message || error.toString());
      })
      .on('progress', (progress, _data) => {
        console.log('Notification job', job.id, `${progress}% complete`);
      });
    job.save();
  }
};

export default createNotificationJobs;
