export class Observable {
    constructor() {
        this._data = null;
        this.listeners = {};
    }

    set data(value) {
        this._data = value;
        this.triggerEvent('change', value);
    }

    get data() {
        return this._data;
    }

    on(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);
    }

    off(eventName, callback) {
        if (this.listeners[eventName]) {
            this.listeners[eventName] = this.listeners[eventName].filter(fn => fn !== callback);
        }
    }

    triggerEvent(eventName, value) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(callback => callback(value));
        }
    }
}