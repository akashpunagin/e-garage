import {
  insertVehicle,
  updateVehicleByRegNo,
  deleteVehicleWithRegNo,
} from "../services/supabase/vehicle";

class VehicleModel {
  constructor(
    regNo,
    model,
    customer,
    workers, //all workers working for vehicle
    completedWorkersIds, //ids of workers whose work is completed
    itemIdQtyMaps
  ) {
    this.regNo = regNo;
    this.model = model;
    this.customer = customer;
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
}

export default VehicleModel;
