import { supabase } from "./supabase";
import ApiResponse from "../../models/ApiResponse";
import VehicleModel from "../../models/Vehicle";
import { getCustomerById } from "./customer";
import { getWorkerByWorkerId } from "./worker";
import { getItemByItemId, updateItemByItemId } from "./item";

const VEHICLE = "vehicle"; // table name
const WORKER_VEHICLE = "worker_vehicle"; // table name
const INSTALL = "install"; // table name
const LOG = "ready_vehicle_log"; //tabel name

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

async function insertItemsToVehicle(regNo, items) {
  for (const item of items) {
    const { data, error } = await supabase
      .from(INSTALL)
      .insert([{ reg_no: regNo, item_id: item.id, qty: 0 }]);

    if (error) {
      return ApiResponse.error(error.message);
    }
  }
  return ApiResponse.success();
}

async function insertVehicle(
  regNo,
  model,
  customer,
  selectedWorkers,
  selectedItems
) {
  const { data, error } = await supabase
    .from(VEHICLE)
    .insert([{ reg_no: regNo, model, customer_id: customer.id }]);

  if (error) {
    return ApiResponse.error(error.message);
  }

  const workerApiResponse = await insertWorkersToVehicle(
    regNo,
    selectedWorkers
  );
  const itemApiResponse = await insertItemsToVehicle(regNo, selectedItems);

  if (workerApiResponse.isError) {
    return workerApiResponse;
  }

  if (itemApiResponse.isError) {
    return itemApiResponse;
  }

  const resVehicle = data[0];

  const completedWorkersIds = [];
  const itemQtyMaps = [];
  const vehicle = new VehicleModel(
    resVehicle.reg_no,
    resVehicle.model,
    customer,
    selectedWorkers,
    completedWorkersIds,
    itemQtyMaps
  );
  return ApiResponse.success(vehicle);
}

async function getWorkersAndCompletedWorkerIdsForVehicleRegNo(regNo) {
  let { data: workers_vehicles, error } = await supabase
    .from(WORKER_VEHICLE)
    .select("*")
    .eq("reg_no", regNo);

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

  return { workers, completedWorkersIds };
}

async function getItemIdQtyMapsForVehicleRegNo(regNo) {
  let { data: installs, error } = await supabase
    .from(INSTALL)
    .select("*")
    .eq("reg_no", regNo);

  if (error) {
    return ApiResponse.error(error.message);
  }

  const itemIdQtyMaps = [];
  for (const install of installs) {
    const { reg_no: regNo, item_id: itemId, qty } = install;

    itemIdQtyMaps.push({ itemId, qty });
  }

  return itemIdQtyMaps;
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

      const { workers, completedWorkersIds } =
        await getWorkersAndCompletedWorkerIdsForVehicleRegNo(v.reg_no);

      const itemIdQtyMaps = await getItemIdQtyMapsForVehicleRegNo(v.reg_no);

      const vehicle = new VehicleModel(
        v.reg_no,
        v.model,
        customer,
        workers,
        completedWorkersIds,
        itemIdQtyMaps
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

async function updateItemsToVehicle(regNo, updatedItemIdQtyMaps) {
  for (const updatedItemIdQtyMap of updatedItemIdQtyMaps) {
    const getItemApiResponse = await getItemByItemId(
      updatedItemIdQtyMap.itemId
    );

    if (getItemApiResponse.isError) {
      return getItemApiResponse;
    }

    const item = getItemApiResponse.data;

    if (item.qty < updatedItemIdQtyMap.qty) {
      return ApiResponse.error(
        `This item does not have enough quantity in stock, available: ${item.qty}, requested: ${updatedItemIdQtyMap.qty}`
      );
    }

    const { data, error } = await supabase
      .from(INSTALL)
      .update({
        qty: updatedItemIdQtyMap.qty,
      })
      .eq("reg_no", regNo)
      .eq("item_id", updatedItemIdQtyMap.itemId);

    if (error) {
      return ApiResponse.error(error.message);
    }

    const newItemQty = item.qty - updatedItemIdQtyMap.qty;
    const updateItemApiResponse = await updateItemByItemId(
      updatedItemIdQtyMap.itemId,
      item.name,
      item.price,
      newItemQty
    );

    if (updateItemApiResponse.isError) {
      return updateItemApiResponse;
    }
  }
  return ApiResponse.success();
}

async function updateVehicleByRegNo(
  vehicleRegNo,
  model,
  customer,
  allWorkers,
  checkedWorkers,
  updatedItemIdQtyMaps
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

  const updateWorkerApiResponse = await updateWorkersIsCompleted(
    vehicleRegNo,
    allWorkers,
    checkedWorkers
  );

  if (updateWorkerApiResponse.isError) {
    return updateWorkerApiResponse;
  }

  const updateItemApiResponse = await updateItemsToVehicle(
    vehicleRegNo,
    updatedItemIdQtyMaps
  );

  if (updateItemApiResponse.isError) {
    return updateItemApiResponse;
  }

  return ApiResponse.success();
}

async function acceptPayment(vehicle, totalPrize) {
  //delete from install
  for (const itemIdQtyMap of vehicle.itemIdQtyMaps) {
    const { itemId } = itemIdQtyMap;

    const { data, error } = await supabase
      .from(INSTALL)
      .delete()
      .eq("reg_no", vehicle.regNo)
      .eq("item_id", itemId);

    if (error) {
      return ApiResponse.error(error.message);
    }
  }

  //insert into log
  const { data, error } = await supabase.from(LOG).insert([
    {
      reg_no: vehicle.regNo,
      delivered_on: new Date(),
      total_price: totalPrize,
    },
  ]);

  console.log("INSERTED INTO LOG:", { data, error });

  if (error) {
    return ApiResponse.error(error.message);
  }

  const apiResponse = await deleteVehicleWithRegNo(vehicle.regNo);

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
  acceptPayment,
};
