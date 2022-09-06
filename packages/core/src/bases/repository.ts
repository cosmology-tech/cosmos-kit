import { Registry } from '../types';

type Name = string;

export class Repo<ItemRegistry extends Registry<Name>> {
  readonly registeredItemMap: Map<Name, ItemRegistry> = new Map();
  public itemPool: ItemRegistry[];

  constructor(itemPool: ItemRegistry[]) {
    this.itemPool = itemPool;
  }

  get first() {
    if (this.registeredItemMap.size === 0) {
      throw new Error('Try to fetch first item from an empty repository!');
    }
    return this.registeredItems[0];
  }

  getItem(name: Name) {
    if (!this.registeredItemMap.has(name)) {
      throw new Error(`Name ${name} is not registered.`);
    }
    return this.registeredItemMap.get(name)!;
  }

  register(itemInfo: Name | ItemRegistry) {
    const name = typeof itemInfo === 'string' ? itemInfo : itemInfo.name;
    if (this.registeredItemMap.has(name)) {
      console.info(
        `Name ${name} already be registered, please choose another name.`
      );
      return;
    }
    if (typeof itemInfo === 'string') {
      const _itemInfo = this.itemPool.find((item) => item.name === itemInfo);
      if (_itemInfo) {
        this.registeredItemMap.set(_itemInfo.name, _itemInfo);
      } else {
        throw new Error(`Unkown item ${itemInfo} (no such item in item pool).`);
      }
    } else {
      this.registeredItemMap.set(itemInfo.name, itemInfo);
    }
  }

  registerAll() {
    this.itemPool.forEach((item) => this.register(item));
  }

  get registeredItems() {
    return Array.from(this.registeredItemMap.values());
  }

  get registeredNames() {
    return this.registeredItems.map((item) => item.name);
  }

  get activeItems() {
    const items: ItemRegistry[] = [];
    this.registeredItemMap.forEach((item) => {
      item.active && items.push(item);
    });
    return items;
  }

  get activeNames() {
    return this.activeItems.map((item) => item.name);
  }

  protected setActiveValue(name: Name, activeValue: boolean) {
    if (!this.registeredItemMap.has(name)) {
      console.warn(`Name ${name} is not registered.`);
      return;
    }
    this.registeredItemMap.get(name)!.active = activeValue;
  }

  activate(name: Name) {
    this.setActiveValue(name, true);
  }

  activateAll() {
    this.registeredItemMap.forEach((item) => {
      item.active = true;
    });
  }

  inactivate(name: Name) {
    this.setActiveValue(name, false);
  }

  inactivateAll() {
    this.registeredItemMap.forEach((item) => {
      item.active = false;
    });
  }
}

export function createRepo<ItemRegistry extends Registry<Name>>(
  itemPool: ItemRegistry[],
  registerAll = false
) {
  const repo = new Repo<ItemRegistry>(itemPool);
  if (registerAll) {
    repo.registerAll();
  }
  return repo;
}
