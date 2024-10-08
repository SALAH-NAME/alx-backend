#!/usr/bin/node
import { createQueue, Job } from 'kue';

const BLOCKED_NUMBERS = ['4153518780', '4153518781'];
const notificationQueue = createQueue();

const notifyUser = (phoneNumber, message, job, done) => {
  let total = 2, pending = 2;
  let sendInterval = setInterval(() => {
    if (total - pending <= total / 2) {
      job.progress(total - pending, total);
    }
    if (BLOCKED_NUMBERS.includes(phoneNumber)) {
      done(new Error(`Phone number ${phoneNumber} is blacklisted`));
      clearInterval(sendInterval);
      return;
    }
    if (total === pending) {
      console.log(
        `Sending notification to ${phoneNumber},`,
        `with message: ${message}`,
      );
    }
    --pending || done();
    pending || clearInterval(sendInterval);
  }, 1000);
};

notificationQueue.process('push_notification_code_2', 2, (job, done) => {
  notifyUser(job.data.phoneNumber, job.data.message, job, done);
});
