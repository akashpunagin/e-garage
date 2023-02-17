import { supabase } from "./supabase";
import ApiResponse from "../../models/ApiResponse";
import WorkerModel from "../../models/Worker";

const WORKER = "worker"; // table name

async function getWorkerByWorkerId(workerId) {
  let { data: workers, error } = await supabase
    .from(WORKER)
    .select("*")
    .eq("worker_id", workerId);
  console.log("GET WORKER BY ID: ", { error, workers });

  if (error) {
    return ApiResponse.error(error.message);
  }

  if (workers.length === 0) {
    return ApiResponse.error(`No customer with id: ${workerId}`);
  }

  const worker = workers[0];
  const workerModel = new WorkerModel(
    worker.worker_id,
    worker.name,
    worker.worker_age,
    worker.ismale
  );

  return ApiResponse.success(workerModel);
}

async function insertWorker(name, age, ismale) {
  const { data, error } = await supabase
    .from(WORKER)
    .insert([{ name, worker_age: age, ismale }]);

  console.log({ data, error });

  if (error) {
    return ApiResponse.error(error.message);
  }

  const resWorker = data[0];

  const worker = new WorkerModel(
    resWorker.worker_id,
    resWorker.name,
    resWorker.worker_age,
    resWorker.ismale
  );
  return ApiResponse.success(worker);
}

async function getWorkers() {
  let { data: workers, error } = await supabase.from(WORKER).select("*");
  console.log("GET WORKER: ", { error, workers });

  if (error) {
    return ApiResponse.error(error.message);
  }

  const ret = [];
  for (const w of workers) {
    const temp = new WorkerModel(w.worker_id, w.name, w.worker_age, w.ismale);
    ret.push(temp);
  }

  return ApiResponse.success(ret);
}

async function deleteWorkerWithId(workerId) {
  const { error } = await supabase
    .from(WORKER)
    .delete()
    .eq("worker_id", workerId);

  if (error) {
    return ApiResponse.error(error.message);
  }
  return ApiResponse.success();
}

async function updateWorkerById(workerId, name, age, isMale) {
  const { error } = await supabase
    .from(WORKER)
    .update({
      name,
      worker_age: age,
      ismale: isMale,
    })
    .eq("worker_id", workerId);

  if (error) {
    return ApiResponse.error(error.message);
  }
  return ApiResponse.success();
}

export {
  insertWorker,
  getWorkers,
  deleteWorkerWithId,
  updateWorkerById,
  getWorkerByWorkerId,
};
