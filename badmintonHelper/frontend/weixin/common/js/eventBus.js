class EventBus {
  constructor() {
    this.subscribers = {};
  }
 
  on(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
  }
 
  emit(event, data) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach(callback => callback(data));
    }
  }
}
 
const eventBus = new EventBus();
 
module.exports = eventBus;