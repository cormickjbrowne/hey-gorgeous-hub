function Dispatcher (maxNumberOfJobs) {
  this.maxNumberOfJobs = maxNumberOfJobs;
  this.jobs = [];
  this.counter = 0;

  // Cache reference to 'this' for use within the IIFEs
  var dispatcher = this;

  // Decrement counter every 500ms
  (function drip() {
    setTimeout(function () {
      if (dispatcher.counter > 0 ) {
        dispatcher.counter--;
        // console.log("counter:", dispatcher.counter);
      }
      drip();
    }, 500);
  })();

  // If there is work, dispatch it as long has you haven't hit your max number of concurrent jobs
  (function dispatch() {
    setTimeout(function () {
      if (dispatcher.jobs.length > 0 && dispatcher.counter < dispatcher.maxNumberOfJobs ) {
        dispatcher.counter++;
        // console.log(dispatcher.dispatchWork());
        // console.log("counter:", dispatcher.counter);
        // console.log("jobs:", dispatcher.jobs);
      }
      dispatch();
    }, 0);
  })();
};

Dispatcher.prototype.getJobs = function () {
  return this.jobs;
};

Dispatcher.prototype.addJob = function (job) {
  if (!job.start) return -1;
  // console.log("adding job");
  return this.jobs.push(job);
};

Dispatcher.prototype.dispatchWork = function () {
  // console.log("dispatching work");
  return this.jobs.shift().start();
};

module.exports = Dispatcher;
