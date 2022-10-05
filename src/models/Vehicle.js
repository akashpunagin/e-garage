import {
  insertVehicle,
  updateVehicleByRegNo,
  deleteVehicleWithRegNo,
} from "../services/supabase/vehicle";

class VehicleModel {
  constructor(regNo, model, customer, workers) {
    this.regNo = regNo;
    this.model = model;
    this.customer = customer;
    this.workers = workers;
  }

  static async insert(regNo, model, customer, selectedWorkers) {
    return await insertVehicle(regNo, model, customer, selectedWorkers);
  }

  async update(regNo, model, customer) {
    return await updateVehicleByRegNo(regNo, model, customer);
  }

  async delete() {
    return await deleteVehicleWithRegNo(this.regNo);
  }
}

export default VehicleModel;
