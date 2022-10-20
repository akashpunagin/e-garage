import {
  insertVehicle,
  updateVehicleByRegNo,
  deleteVehicleWithRegNo,
  acceptPayment,
} from "../services/supabase/vehicle";

class VehicleModel {
  constructor(
    regNo,
    model,
    customer,
    isDelivered,
    workers, //all workers working for vehicle
    completedWorkersIds, //ids of workers whose work is completed
    itemIdQtyMaps
  ) {
    this.regNo = regNo;
    this.model = model;
    this.customer = customer;
    this.isDelivered = isDelivered;
    this.workers = workers;
    this.completedWorkersIds = completedWorkersIds;
    this.itemIdQtyMaps = itemIdQtyMaps;
  }

  static async insert(regNo, model, customer, selectedWorkers, selectedItems) {
    return await insertVehicle(
      regNo,
      model,
      customer,
      selectedWorkers,
      selectedItems
    );
  }

  async update(
    regNo,
    model,
    customer,
    allWorkers,
    checkedWorkers,
    updatedItemIdQtyMaps
  ) {
    return await updateVehicleByRegNo(
      regNo,
      model,
      customer,
      allWorkers,
      checkedWorkers,
      updatedItemIdQtyMaps
    );
  }

  async delete() {
    return await deleteVehicleWithRegNo(this.regNo);
  }

  async paymentReceived(items, getItemWithId) {
    const totalPrize = this.getBillOfItems(items, getItemWithId);
    return await acceptPayment(this, totalPrize);
  }

  getBillOfItems(items, getItemWithId) {
    let totalAmount = 0;

    for (const itemIdQtyMap of this.itemIdQtyMaps) {
      const { itemId, qty } = itemIdQtyMap;
      console.log("BILL:", { itemId, qty });
      const item = getItemWithId(items, itemId);
      totalAmount += item.price * qty;
    }

    return totalAmount;
  }
}

export default VehicleModel;
