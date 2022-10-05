import {
  insertVehicle,
  updateVehicleByRegNo,
  deleteVehicleWithRegNo,
} from "../services/supabase/vehicle";

class VehicleModel {
  constructor(regNo, model, customer, workers, completedWorkersIds) {
    this.regNo = regNo;
    this.model = model;
    this.customer = customer;
    this.workers = workers;
    this.completedWorkersIds = completedWorkersIds;
  }

  static async insert(regNo, model, customer, selectedWorkers) {
    return await insertVehicle(regNo, model, customer, selectedWorkers);
  }

  async update(regNo, model, customer, allWorkers, checkedWorkers) {
    return await updateVehicleByRegNo(
      regNo,
      model,
      customer,
      allWorkers,
      checkedWorkers
    );
  }

  async delete() {
    return await deleteVehicleWithRegNo(this.regNo);
  }
}

export default VehicleModel;
