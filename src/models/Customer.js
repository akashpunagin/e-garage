import { insertCustomer } from "../services/supabase/customer";

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
}

export default CustomerModel;
