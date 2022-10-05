import { supabase } from "./supabase";
import ApiResponse from "../../models/ApiResponse";
import VehicleModel from "../../models/Vehicle";
import { getCustomerById } from "./customer";
import { getWorkerByWorkerId } from "./worker";

const VEHICLE = "vehicle"; // table name
const WORKER_VEHICLE = "worker_vehicle"; // table name

async function insertWorkersToVehicle(regNo, workers) {
  for (const worker of workers) {
    const { data, error } = await supabase
      .from(WORKER_VEHICLE)
      .insert([{ worker_id: worker.id, reg_no: regNo, iscompleted: false }]);

    if (error) {
      return ApiResponse.error(error.message);
    }
  }
  return ApiResponse.success();
}

async function insertVehicle(regNo, model, customer, selectedWorkers) {
  const { data, error } = await supabase
    .from(VEHICLE)
    .insert([{ reg_no: regNo, model, customer_id: customer.id }]);

  if (error) {
    return ApiResponse.error(error.message);
  }

  const apiResponse = await insertWorkersToVehicle(regNo, selectedWorkers);

  if (apiResponse.isError) {
    return apiResponse;
  }

  const resVehicle = data[0];

  const completedWorkersIds = [];
  const vehicle = new VehicleModel(
    resVehicle.reg_no,
    resVehicle.model,
    customer,
    selectedWorkers,
    completedWorkersIds
  );
  return ApiResponse.success(vehicle);
}

async function getVehicles() {
  let { data: vehicles, error } = await supabase.from(VEHICLE).select("*");

  if (error) {
    return ApiResponse.error(error.message);
  }

  const ret = [];
  for (const v of vehicles) {
    const customerApiResponse = await getCustomerById(v.customer_id);
    if (customerApiResponse.isError) {
      return ApiResponse.error(customerApiResponse.errorMessage);
    } else {
      const customer = customerApiResponse.data;

      let { data: workers_vehicles, error } = await supabase
        .from(WORKER_VEHICLE)
        .select("*")
        .eq("reg_no", v.reg_no);

      if (error) {
        return ApiResponse.error(error.message);
      }

      const workers = [];
      const completedWorkersIds = [];
      for (const worker_vehicle of workers_vehicles) {
        const {
          worker_id: workerId,
          reg_no: regNo,
          iscompleted: isCompleted,
        } = worker_vehicle;

        if (isCompleted) {
          completedWorkersIds.push(workerId);
        }

        const apiResponse = await getWorkerByWorkerId(workerId);
        if (apiResponse.isError) {
          return apiResponse;
        }
        const workerModel = apiResponse.data;
        workers.push(workerModel);
      }

      const vehicle = new VehicleModel(
        v.reg_no,
        v.model,
        customer,
        workers,
        completedWorkersIds
      );

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

async function updateWorkersIsCompleted(regNo, allWorkers, checkedWorkers) {
  for (const worker of allWorkers) {
    const isCurrentWorkerChecked = checkedWorkers.find(
      (checkedWorker) => checkedWorker.id === worker.id
    );

    const { data, error } = await supabase
      .from(WORKER_VEHICLE)
      .update([{ iscompleted: isCurrentWorkerChecked ? true : false }])
      .eq("reg_no", regNo)
      .eq("worker_id", worker.id);

    if (error) {
      return ApiResponse.error(error.message);
    }
  }

  return ApiResponse.success();
}

async function updateVehicleByRegNo(
  vehicleRegNo,
  model,
  customer,
  allWorkers,
  checkedWorkers
) {
  const { data: vehicle, error } = await supabase
    .from(VEHICLE)
    .update({
      model,
      customer_id: customer.id,
    })
    .eq("reg_no", vehicleRegNo);

  if (error) {
    return ApiResponse.error(error.message);
  }

  const apiResponse = await updateWorkersIsCompleted(
    vehicleRegNo,
    allWorkers,
    checkedWorkers
  );

  if (apiResponse.isError) {
    return apiResponse;
  }
  return ApiResponse.success();
}

export {
  insertVehicle,
  getVehicles,
  deleteVehicleWithRegNo,
  updateVehicleByRegNo,
};
