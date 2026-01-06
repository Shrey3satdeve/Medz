const supabase = require('../config/supabase');

// Tests
async function getAllTests() {
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .order('id');
  
  if (error) {
    console.error('Error fetching tests:', error);
    throw error;
  }
  
  return data.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price,
    category: row.category,
    parameters: row.parameters,
    reportTime: row.report_time,
    fasting: row.fasting
  }));
}

// Packages
async function getAllPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('id');
  
  if (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
  
  return data.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price,
    testsCount: row.tests_count,
    parameters: row.parameters,
    reportTime: row.report_time,
    popular: row.popular,
    featured: row.featured
  }));
}

// Orders
async function getAllOrders() {
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    throw ordersError;
  }
  
  // Fetch order items for each order
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);
      
      if (itemsError) {
        console.error('Error fetching order items:', itemsError);
        return {
          ...order,
          tests: []
        };
      }
      
      return {
        id: order.id,
        tests: items.map(item => ({
          id: item.test_id,
          name: item.test_name,
          price: item.test_price
        })),
        totalAmount: order.total_amount,
        date: order.date,
        status: order.status,
        appointmentDate: order.appointment_date,
        appointmentTime: order.appointment_time
      };
    })
  );
  
  return ordersWithItems;
}

async function createOrder(orderData) {
  // Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      id: orderData.id,
      total_amount: orderData.totalAmount,
      date: orderData.date,
      status: orderData.status,
      appointment_date: orderData.appointmentDate,
      appointment_time: orderData.appointmentTime
    })
    .select()
    .single();
  
  if (orderError) {
    console.error('Error creating order:', orderError);
    throw orderError;
  }
  
  // Insert order items
  const items = orderData.tests.map(test => ({
    order_id: orderData.id,
    test_id: test.id,
    test_name: test.name,
    test_price: test.price
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(items);
  
  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    throw itemsError;
  }
  
  return orderData;
}

// Legacy compatibility functions
async function readJson(fileName, defaultValue) {
  try {
    if (fileName === 'tests.json') return await getAllTests();
    if (fileName === 'packages.json') return await getAllPackages();
    if (fileName === 'orders.json') return await getAllOrders();
    return defaultValue;
  } catch (e) {
    console.error('readJson error:', e);
    return defaultValue;
  }
}

async function writeJson(fileName, data) {
  console.warn('writeJson is deprecated, use direct Supabase functions');
}

module.exports = { 
  readJson, 
  writeJson,
  getAllTests,
  getAllPackages,
  getAllOrders,
  createOrder,
  supabase
};