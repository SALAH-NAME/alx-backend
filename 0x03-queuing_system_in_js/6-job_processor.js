#!/usr/bin/node
import { createQueue } from 'kue';

const notificationQueue = createQueue();

const notifyUser = (phoneNumber, message) => {
  console.log(
    `Sending notification to ${phoneNumber},`,
    'with message:',
    message,
  );
};

notificationQueue.process('push_notification_code', (job, done) => {
  notifyUser(job.data.phoneNumber, job.data.message);
  done();
});
