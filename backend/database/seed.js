// Seed database with initial data from JSON files
const { initDatabase } = require('./init');
const fs = require('fs');
const path = require('path');

function seedDatabase() {
  const db = initDatabase();
  
  try {
    // Read JSON data files
    const testsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tests.json'), 'utf8'));
    const packagesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'packages.json'), 'utf8'));
    const ordersData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'orders.json'), 'utf8'));
    
    // Clear existing data
    db.exec('DELETE FROM order_items');
    db.exec('DELETE FROM orders');
    db.exec('DELETE FROM packages');
    db.exec('DELETE FROM tests');
    
    // Insert tests
    const insertTest = db.prepare(`
      INSERT INTO tests (id, name, description, price, original_price, category, parameters, report_time, fasting)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const test of testsData) {
      insertTest.run(
        test.id,
        test.name,
        test.description,
        test.price,
        test.originalPrice,
        test.category,
        test.parameters,
        test.reportTime,
        test.fasting ? 1 : 0
      );
    }
    console.log(`✓ Inserted ${testsData.length} tests`);
    
    // Insert packages
    const insertPackage = db.prepare(`
      INSERT INTO packages (id, name, description, price, original_price, tests_count, parameters, report_time, popular, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const pkg of packagesData) {
      insertPackage.run(
        pkg.id,
        pkg.name,
        pkg.description,
        pkg.price,
        pkg.originalPrice,
        pkg.testsCount,
        pkg.parameters,
        pkg.reportTime,
        pkg.popular ? 1 : 0,
        pkg.featured ? 1 : 0
      );
    }
    console.log(`✓ Inserted ${packagesData.length} packages`);
    
    // Insert orders
    const insertOrder = db.prepare(`
      INSERT INTO orders (id, total_amount, date, status, appointment_date, appointment_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const insertOrderItem = db.prepare(`
      INSERT INTO order_items (order_id, test_id, test_name, test_price)
      VALUES (?, ?, ?, ?)
    `);
    
    for (const order of ordersData) {
      insertOrder.run(
        order.id,
        order.totalAmount,
        order.date,
        order.status,
        order.appointmentDate,
        order.appointmentTime
      );
      
      // Insert order items
      if (order.tests && Array.isArray(order.tests)) {
        for (const test of order.tests) {
          insertOrderItem.run(
            order.id,
            test.id,
            test.name,
            test.price
          );
        }
      }
    }
    console.log(`✓ Inserted ${ordersData.length} orders`);
    
    console.log('\n✓ Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
