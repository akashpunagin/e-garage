import { supabase } from "./supabase";
import ApiResponse from "../../models/ApiResponse";
import CustomerModel from "../../models/Customer";

const CUSTOMER = "customer"; // table name

async function insertCustomer(name, address, contact, aadhar) {
  const { data, error } = await supabase
    .from(CUSTOMER)
    .insert([{ name, address, contact, aadhar_number: aadhar }]);

  console.log({ data, error });

  if (error) {
    return ApiResponse.error(error.message);
  }

  const resCustomer = data[0];

  const customer = new CustomerModel(
    resCustomer.customer_id,
    resCustomer.name,
    resCustomer.address,
    resCustomer.contact,
    resCustomer.aadhar_number
  );
  return ApiResponse.success(customer);
}

async function getCustomers() {
  let { data: customers, error } = await supabase.from(CUSTOMER).select("*");
  console.log("GET CUSTOMER: ", { error, customers });

  if (error) {
    return ApiResponse.error(error.message);
  }

  const ret = [];
  for (const c of customers) {
    const temp = new CustomerModel(
      c.customer_id,
      c.name,
      c.address,
      c.contact,
      c.aadhar_number
    );
    ret.push(temp);
  }

  return ApiResponse.success(ret);
}

async function deleteCustomerWithId(customerId) {
  const { error } = await supabase
    .from(CUSTOMER)
    .delete()
    .eq("customer_id", customerId);

  if (error) {
    return ApiResponse.error(error.message);
  }
  return ApiResponse.success();
}

async function updateCustomerById(customerId, name, address, contact, aadhar) {
  const { error } = await supabase
    .from(CUSTOMER)
    .update({
      name,
      address,
      contact,
      aadhar_number: aadhar,
    })
    .eq("customer_id", customerId);

  if (error) {
    return ApiResponse.error(error.message);
  }
  return ApiResponse.success();
}

export {
  insertCustomer,
  getCustomers,
  deleteCustomerWithId,
  updateCustomerById,
};
