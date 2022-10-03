import {
  insertWorker,
  updateWorkerById,
  deleteWorkerWithId,
} from "../services/supabase/worker";

class WorkerModel {
  constructor(id, name, age, isMale) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.isMale = isMale;
  }

  static async insert(name, age, isMale) {
    return await insertWorker(name, age, isMale);
  }

  async update(name, age, isMale) {
    return await updateWorkerById(this.id, name, age, isMale);
  }

  async delete() {
    return await deleteWorkerWithId(this.id);
  }

  static isMaleBooleanFromString(value) {
    return value === "male";
  }
}

export default WorkerModel;
