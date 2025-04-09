// Define the different events for writings and readings
const WritingEvent = {
    System: 'system',
    NewWriting: 'newWriting',
  };
  
  const ReadingEvent = {
    System: 'system',
    NewReading: 'newReading',
  };
  
  class EventMessage {
    constructor(from, type, value) {
      this.from = from;
      this.type = type;
      this.value = value;
    }
  }
  
  class WritingReadingEventNotifier {
    events = [];
    handlers = [];
  
    constructor() {
      // Setup WebSocket connection
      let port = window.location.port;
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
  
      // WebSocket open event
      this.socket.onopen = () => {
        this.receiveEvent(new EventMessage('Server', WritingEvent.System, { msg: 'connected' }));
      };
  
      // WebSocket close event
      this.socket.onclose = () => {
        this.receiveEvent(new EventMessage('Server', WritingEvent.System, { msg: 'disconnected' }));
      };
  
      // Handle incoming messages
      this.socket.onmessage = async (msg) => {
        try {
          const event = JSON.parse(await msg.data.text());
          this.receiveEvent(event);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
    }
  
    // Broadcast a new event (sending data)
    broadcastEvent(from, type, value) {
      const event = new EventMessage(from, type, value);
      this.socket.send(JSON.stringify(event));
    }
  
    // Add a handler to listen for incoming events
    addHandler(handler) {
      this.handlers.push(handler);
    }
  
    // Remove a handler
    removeHandler(handler) {
      this.handlers = this.handlers.filter((h) => h !== handler);
    }
  
    // Process and notify handlers for new events
    receiveEvent(event) {
      this.events.push(event);
        this.handlers.forEach((handler) => {
          handler(event);
          alert("New post");
      });
    }
  }
  
  // Singleton instance of the notifier for writing/reading
  const WritingReadingNotifier = new WritingReadingEventNotifier();
  
  // Export WritingEvent, ReadingEvent, and WritingReadingNotifier so other parts of your application can use it
  export { WritingEvent, ReadingEvent, WritingReadingNotifier };
  