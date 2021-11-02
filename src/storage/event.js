import {Authenticate} from './authenticate';

export class Event {
  constructor(events) {
    this.events = events;
  }

  static async get() {
    let {
      data: {raker},
    } = await Authenticate.get();

    return new Event(raker);
  }

  static async getEventNow() {
    let events = (await Event.get()).events.filter((event, index) => {
      let timeStartEvent = event.tanggal_jam_masuk_raker.replace(/-/g, '/');
      timeStartEvent = new Date(timeStartEvent).getTime();

      let timeNow = new Date();
      timeNow.setDate(timeNow.getDate() - 1);
      timeNow = timeNow.getTime();

      return timeStartEvent >= timeNow;
    });

    return new Event(events);
  }

  static async getEventHistory() {
    let events = (await Event.get()).events.filter((event, index) => {
      let timeStartEvent = event.tanggal_jam_masuk_raker.replace(/-/g, '/');
      timeStartEvent = new Date(timeStartEvent).getTime();

      let timeNow = new Date();
      timeNow.setDate(timeNow.getDate() - 1);
      timeNow = timeNow.getTime();

      return timeStartEvent < timeNow;
    });

    return new Event(events);
  }
}
