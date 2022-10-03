import { supabase } from "./supabase";
import ApiResponse from "../../models/ApiResponse";
import VehicleModel from "../../models/Vehicle";
import { getCustomerById } from "./customer";

const VEHICLE = "vehicle"; // table name

async function insertVehicle(regNo, model, customer) {
  const { data, error } = await supabase
    .from(VEHICLE)
    .insert([{ reg_no: regNo, model, customer_id: customer.id }]);

  console.log({ data, error });

  if (error) {
    return ApiResponse.error(error.message);
  }

  const resVehicle = data[0];

  const vehicle = new VehicleModel(
    resVehicle.reg_no,
    resVehicle.model,
    customer
  );
  return ApiResponse.success(vehicle);
}

async function getVehicles() {
  let { data: vehicles, error } = await supabase.from(VEHICLE).select("*");
  console.log("GET VEHICLE: ", { error, vehicles });

  if (error) {
    return ApiResponse.error(error.message);
  }

  const ret = [];
  for (const v of vehicles) {
    const apiResponse = await getCustomerById(v.customer_id);
    if (apiResponse.isError) {
      return ApiResponse.error(apiResponse.errorMessage);
    } else {
      const customer = apiResponse.data;
      const vehicle = new VehicleModel(v.reg_no, v.model, customer);
      ret.push(vehicle);
    }
  }

  return ApiResponse.success(ret);
}

async function deleteVehicleWithRegNo(vehicleRegNo) {
  const { error } = await supabase
    .from(VEHICLE)
    .delete()
    .eq("reg_no", vehicleRegNo);

  if (error) {
    return ApiResponse.error(error.message);
  }
  return ApiResponse.success();
}

async function updateVehicleByRegNo(vehicleRegNo, model, customer) {
  const { error } = await supabase
    .from(VEHICLE)
    .update({
      model,
      customer_id: customer.id,
    })
    .eq("reg_no", vehicleRegNo);

  if (error) {
    return ApiResponse.error(error.message);
  }
  return ApiResponse.success();
}

export {
  insertVehicle,
  getVehicles,
  deleteVehicleWithRegNo,
  updateVehicleByRegNo,
};
