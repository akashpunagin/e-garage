import {
  insertCustomer,
  updateCustomerById,
  deleteCustomerWithId,
} from "../services/supabase/customer";

class CustomerModel {
  constructor(id, name, address, contact, aadhar) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.contact = contact;
    this.aadhar = aadhar;
  }

  static async insert(name, address, contact, aadhar) {
    return await insertCustomer(name, address, contact, aadhar);
  }

  async update(name, address, contact, aadhar) {
    return await updateCustomerById(this.id, name, address, contact, aadhar);
  }

  async delete() {
    return await deleteCustomerWithId(this.id);
  }
}

export default CustomerModel;
