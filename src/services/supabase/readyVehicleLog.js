import { supabase } from "./supabase";
import ApiResponse from "../../models/ApiResponse";
import ReadyVehicleLogModel from "../../models/ReadyVehicleLog";

const LOG = "ready_vehicle_log"; // table name

async function getVehicleLog() {
  let { data: logs, error } = await supabase.from(LOG).select("*");
  console.log("GET LOG: ", { error, items: logs });

  if (error) {
    return ApiResponse.error(error.message);
  }

  const ret = [];
  for (const log of logs) {
    const logModel = new ReadyVehicleLogModel(
      log.log_id,
      log.reg_no,
      log.delivered_on,
      log.total_price
    );
    ret.push(logModel);
  }

  return ApiResponse.success(ret);
}

export { getVehicleLog };
