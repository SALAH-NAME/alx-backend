#!/usr/bin/node
import { createQueue } from 'kue';
import chai from 'chai';
import sinon from 'sinon';
import createNotificationJobs from './8-job';

const expect = chai.expect;

const notificationQueue = createQueue();

const notifications = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account',
  },
];

describe('createNotificationJobs', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  before(() => {
    notificationQueue.testMode.enter();
  });

  afterEach(() => {
    sinon.restore();
    notificationQueue.testMode.clear();
  });

  after(() => {
    notificationQueue.testMode.exit();
  });

  it('display an error message if notifications is not an array', () => {
    expect(() => createNotificationJobs(1, notificationQueue)).to.throw();
    expect(() => createNotificationJobs(1, notificationQueue)).to.throw(/Jobs is not an array/);
  });

  it('throws if notificationQueue is not a valid kue', function() {
    expect(() => createNotificationJobs(notifications, "")).to.throw();
  });

  it('test the creation of jobs', () => {
    createNotificationJobs(notifications, notificationQueue);
    expect(notificationQueue.testMode.jobs.length).to.equal(1);
    expect(notificationQueue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(notificationQueue.testMode.jobs[0].data).to.eql(notifications[0]);
    expect(console.log.calledOnceWith(`Notification job created: ${notificationQueue.testMode.jobs[0].id}`)).to.be.true;
  });

  it('test job progress event report', (done) => {
    createNotificationJobs(notifications, notificationQueue);
    notificationQueue.testMode.jobs[0].addListener('progress', () => {
      const id = notificationQueue.testMode.jobs[0].id;
      expect(console.log.calledWith(`Notification job ${id} 50% complete`)).to.be.true;
      done();
    });
    notificationQueue.testMode.jobs[0].emit('progress', 50, 100);
  });

  it('test job failed event report', (done) => {
    createNotificationJobs(notifications, notificationQueue);
    notificationQueue.testMode.jobs[0].addListener('failed', () => {
      const id = notificationQueue.testMode.jobs[0].id;
      expect(console.log.calledWith(`Notification job ${id} failed: job failed!`)).to.be.true;
      done();
    });
    notificationQueue.testMode.jobs[0].emit('failed', new Error('job failed!'));
  });

  it('test job completed event report', (done) => {
    createNotificationJobs(notifications, notificationQueue);
    notificationQueue.testMode.jobs[0].addListener('complete', () => {
      const id = notificationQueue.testMode.jobs[0].id;
      expect(console.log.calledWith(`Notification job ${id} completed`)).to.be.true;
      done();
    });
    notificationQueue.testMode.jobs[0].emit('complete', true);
  });
});
