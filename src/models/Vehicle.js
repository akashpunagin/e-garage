import {
  insertVehicle,
  updateVehicleByRegNo,
  deleteVehicleWithRegNo,
} from "../services/supabase/vehicle";

class VehicleModel {
  constructor(regNo, model, customer) {
    this.regNo = regNo;
    this.model = model;
    this.customer = customer;
  }

  static async insert(regNo, model, customer) {
    return await insertVehicle(regNo, model, customer);
  }

  async update(regNo, model, customer) {
    return await updateVehicleByRegNo(regNo, model, customer);
  }

  async delete() {
    return await deleteVehicleWithRegNo(this.regNo);
  }
}

export default VehicleModel;
