// Exercise 9.3 Warehouse item: Imagine we are working on a warehouse
// management program. Our next task is to create a class to model a
// warehouse item and help track it. Such a WarehouseItem class has a
// constructor, which accepts an id and the initial state of the item (which can
// be one of arriving, stored, or delivered). It has three public methods:
// • store(locationId) moves the item into the stored state and records
// the locationId where it's stored.
// • deliver(address) changes the state of the item to delivered, sets the
// delivery address, and clears the locationId.
// • describe() returns a string representation of the current state of the
// item (for example, "Item 5821 is on its way to the warehouse," or
// "Item 3647 is stored in location 1ZH3," or "Item 3452 was delivered to
// John Smith, 1st Avenue, New York."
// The arriving state can be set only when the object is created as it cannot be
// transitioned to from the other states. An item can't move back to the arriving
// state once it's stored or delivered, it cannot be moved back to stored once
// it's delivered, and it cannot be delivered if it's not stored first. Use the State
// pattern to implement the WarehouseItem

const states = ["arriving", "stored", "delivered"];

const mockAddresses = [
  "John Smith, 1st Avenue, New York",
  "Alice Johnson, 42 Elm Street, Springfield",
  "Carlos Rivera, 9 Maple Drive, Austin",
  "Sarah Lee, 77 Pine Blvd, Seattle",
  "Liam Patel, 300 Ocean Ave, Miami",
];

const mockLocations = ["1ZH3", "3AB9", "5CD1", "7YX8", "2MK7"];

class ArrivingState {
  constructor(item, setter) {
    this.item = item;
    this.setter = setter;
  }
  store(locationId) {
    this.setter.setLocationId(locationId);
  }
  deliver() {
    throw new Error("item needs to be stored first");
  }

  describe() {
    console.log(`Item ${this.item.id} is on its way to the warehouse`);
  }
}

class StoredState {
  constructor(item, setter) {
    this.item = item;
    this.setter = setter;
  }
  store(locationId) {
    this.setter.setLocation(locationId);
  }
  deliver(addressId) {
    this.setter.setLocationId(null);
    this.setter.setAddressId(addressId);
  }
  describe() {
    const id = this.item.id;
    const location = mockLocations[this.item.locationId];
    console.log(`Item ${id} is stored in location ${location}`);
  }
}

class DeliveredSate {
  constructor(item) {
    this.item = item;
  }
  store() {
    throw new Error("item already delivered cannot be stored");
  }
  deliver() {
    throw new Error("item already delivered");
  }
  describe() {
    const id = this.item.id;
    const address = mockAddresses[this.item.addressId];
    console.log(`Item ${id} was delivered to ${address}`);
  }
}
class WarehouseItem {
  #addressId;
  #locationId;
  #states;
  #currentState;
  constructor(
    id,
    description = {
      state: "arriving",
      locationId: null,
      addressId: null,
    }
  ) {
    this.id = id;
    this.#locationId = description.locationId;
    this.#addressId = description.addressId;
    this.#states = {
      arriving: new ArrivingState(this, {
        setLocationId: (id) => (this.#locationId = id),
      }),
      stored: new StoredState(this, {
        setLocationId: (id) => (this.#locationId = id),
        setAddressId: (id) => (this.#addressId = id),
      }),
      delivered: new DeliveredSate(this),
    };
    this.#currentState = this.#states[description.state];
  }
  store(locationId) {
    this.#currentState.store(locationId);
    this.#currentState = this.#states.stored;
  }
  deliver(addressId) {
    this.#currentState.deliver(addressId);
    this.#currentState = this.#states.delivered;
  }
  describe() {
    this.#currentState.describe();
  }
  get locationId() {
    return this.#locationId;
  }
  get addressId() {
    return this.#addressId;
  }
}

const mouse = new WarehouseItem(0);
mouse.store(3);
mouse.describe();
mouse.deliver(1);
mouse.describe();
// mouse.store();
