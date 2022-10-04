import { supabase } from "./supabase";
import ApiResponse from "../../models/ApiResponse";
import ItemModel from "../../models/Item";

const ITEM = "item"; // table name

async function insertItem(name, price, qty) {
  const { data, error } = await supabase
    .from(ITEM)
    .insert([{ name, price, qty }]);

  console.log({ data, error });

  if (error) {
    return ApiResponse.error(error.message);
  }

  const resItem = data[0];

  const item = new ItemModel(
    resItem.item_id,
    resItem.name,
    resItem.price,
    resItem.qty
  );
  return ApiResponse.success(item);
}

async function getItems() {
  let { data: items, error } = await supabase.from(ITEM).select("*");
  console.log("GET ITEMS: ", { error, items });

  if (error) {
    return ApiResponse.error(error.message);
  }

  const ret = [];
  for (const i of items) {
    const item = new ItemModel(i.item_id, i.name, i.price, i.qty);
    ret.push(item);
  }

  return ApiResponse.success(ret);
}

async function deleteItemWithItemId(itemId) {
  const { error } = await supabase.from(ITEM).delete().eq("item_id", itemId);

  if (error) {
    return ApiResponse.error(error.message);
  }
  return ApiResponse.success();
}

async function updateItemByItemId(itemId, name, price, qty) {
  const { error } = await supabase
    .from(ITEM)
    .update({ name, price, qty })
    .eq("item_id", itemId);

  if (error) {
    return ApiResponse.error(error.message);
  }
  return ApiResponse.success();
}

export { insertItem, getItems, deleteItemWithItemId, updateItemByItemId };
