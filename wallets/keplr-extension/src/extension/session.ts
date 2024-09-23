export class ExpiringLocalStorage {
  /**
   * Add an item to an array in local storage with an expiration time.
   * @param {string} key - The key under which the array is stored.
   * @param {*} value - The value to be added.
   * @param {number} ttl - Time to live in milliseconds.
   */
  static addItem(key, value, ttl) {
    const now = new Date();

    // Create a new item with value and expiry
    const newItem = {
      value: value,
      expiry: now.getTime() + ttl,
    };

    // Get existing items from local storage
    const itemStr = localStorage.getItem(key);
    const items = itemStr ? JSON.parse(itemStr) : [];

    // Add the new item to the array
    items.push(newItem);

    // Store the updated array in local storage
    localStorage.setItem(key, JSON.stringify(items));
  }

  /**
   * Get all valid (non-expired) items from an array in local storage.
   * @param {string} key - The key of the array to retrieve.
   * @returns {Array} An array of valid items.
   */
  static getItems(key) {
    const itemStr = localStorage.getItem(key);

    // If the item doesn't exist, return an empty array
    if (!itemStr) {
      return [];
    }

    const items = JSON.parse(itemStr);
    const now = new Date();
    const validItems = [];

    // Filter out expired items
    for (const item of items) {
      if (now.getTime() <= item.expiry) {
        validItems.push(item.value);
      }
    }

    // Update local storage with only valid items
    localStorage.setItem(
      key,
      JSON.stringify(
        validItems.map((value) => ({
          value,
          expiry: items.find((item) => item.value === value).expiry,
        }))
      )
    );

    return validItems;
  }

  /**
   * Remove a specific item from the array in local storage.
   * @param {string} key - The key of the array.
   * @param {*} value - The value to be removed.
   */
  static removeItem(key, value) {
    const itemStr = localStorage.getItem(key);

    // If the item doesn't exist, return
    if (!itemStr) {
      return;
    }

    let items = JSON.parse(itemStr);

    // Filter out the item to be removed
    items = items.filter((item) => item.value !== value);

    // Update local storage with the remaining items
    localStorage.setItem(key, JSON.stringify(items));
  }
}

// Usage example:

// Add items with different TTLs
// ExpiringLocalStorage.addItem('myArray', 'item1', 10000); // Expires in 10 seconds
// ExpiringLocalStorage.addItem('myArray', 'item2', 20000); // Expires in 20 seconds

// Get all valid items (non-expired)
// console.log(ExpiringLocalStorage.getItems('myArray'));

// Remove a specific item
// ExpiringLocalStorage.removeItem('myArray', 'item1');
