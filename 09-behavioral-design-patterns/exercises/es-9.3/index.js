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

class ItemState {
  #state;
  #locationId;
  #addressId;

  constructor(state, locationId = null, addressId = null) {
    this.#state = state;
    this.#locationId = locationId;
    this.#addressId = addressId;
  }

  changeState(providedState, id) {
    const checkState = (condition) => {
      if (condition) {
        throw new Error(
          `Invalid state transition: ${this.#state} → ${providedState}`
        );
      }
    };

    switch (providedState) {
      case "arriving":
        checkState(this.#state !== "arriving");
        break;
      case "stored":
        checkState(this.#state === "delivered");
        this.#state = providedState;
        this.#locationId = id;
        break;
      case "delivered":
        checkState(this.#state === "arriving");
        this.#state = providedState;
        this.#locationId = null;
        this.#addressId = id;
        break;
      default:
        checkState(true);
    }
  }

  getState() {
    return this.#state;
  }

  getLocationId() {
    return this.#locationId;
  }

  getAddressId() {
    return this.#addressId;
  }
}

const mockAddresses = [
  "John Smith, 1st Avenue, New York",
  "Alice Johnson, 42 Elm Street, Springfield",
  "Carlos Rivera, 9 Maple Drive, Austin",
  "Sarah Lee, 77 Pine Blvd, Seattle",
  "Liam Patel, 300 Ocean Ave, Miami",
];

const mockLocations = ["1ZH3", "3AB9", "5CD1", "7YX8", "2MK7"];

class WarehouseItem {
  constructor(id, itemState) {
    this.id = id;
    this.itemState = itemState;
  }

  store(locationId) {
    this.itemState.changeState("stored", locationId);
  }

  deliver(addressId) {
    this.itemState.changeState("delivered", addressId);
  }

  describe() {
    const state = this.itemState.getState();

    switch (state) {
      case "arriving":
        return `Item ${this.id} is on its way to the warehouse.`;
      case "stored":
        return `Item ${this.id} is stored in location ${
          mockLocations[this.itemState.getLocationId()]
        }.`;
      case "delivered":
        return `Item ${this.id} was delivered to ${
          mockAddresses[this.itemState.getAddressId()]
        }.`;
      default:
        return `Item ${this.id} is in an unknown state.`;
    }
  }
}
// const mockItem = new WarehouseItem(1, new ItemState("arriving"));
// mockItem.store(3);
// console.log(mockItem.describe());
// mockItem.deliver(2);
// console.log(mockItem.describe());
// mockItem.store(1);

class Countdown {
  constructor(counter, action) {
    this.dec = () => {
      counter--;
      if (counter === 0) {
        action();
      }
      return this;
    };
  }
}

new Countdown(2, () => console.log("hello")).dec().dec().dec().dec();
