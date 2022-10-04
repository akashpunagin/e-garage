import {
  insertItem,
  updateItemByItemId,
  deleteItemWithItemId,
} from "../services/supabase/item";

class ItemModel {
  constructor(id, name, price, qty) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.qty = qty;
  }

  static async insert(name, price, qty) {
    return await insertItem(name, price, qty);
  }

  async update(name, price, qty) {
    return await updateItemByItemId(this.id, name, price, qty);
  }

  async delete() {
    return await deleteItemWithItemId(this.id);
  }
}

export default ItemModel;
