const { db, initDb } = require('./db/connection');

const suppliers = [
    { name: 'Global Tech Solutions', city: 'New York' },
    { name: 'EcoWare Industries', city: 'San Francisco' },
    { name: 'Elite Furniture Co.', city: 'Chicago' },
    { name: 'Prime Office Supplies', city: 'London' }
];

const inventoryItems = [
    { product_name: 'Wireless Mouse', category: 'Electronics', quantity: 150, price: 25.99, supplier_name: 'Global Tech Solutions' },
    { product_name: 'Mechanical Keyboard', category: 'Electronics', quantity: 80, price: 89.50, supplier_name: 'Global Tech Solutions' },
    { product_name: 'Bamboo Desk Organizer', category: 'Office Supplies', quantity: 200, price: 15.75, supplier_name: 'EcoWare Industries' },
    { product_name: 'Recycled Paper Clips', category: 'Office Supplies', quantity: 1000, price: 4.99, supplier_name: 'EcoWare Industries' },
    { product_name: 'Ergonomic Office Chair', category: 'Furniture', quantity: 45, price: 199.99, supplier_name: 'Elite Furniture Co.' },
    { product_name: 'Standing Desk', category: 'Furniture', quantity: 20, price: 349.00, supplier_name: 'Elite Furniture Co.' },
    { product_name: 'LED Desk Lamp', category: 'Electronics', quantity: 60, price: 34.95, supplier_name: 'Global Tech Solutions' },
    { product_name: 'Whiteboard Pack', category: 'Office Supplies', quantity: 30, price: 45.00, supplier_name: 'Prime Office Supplies' },
    { product_name: 'Stapler Heavy Duty', category: 'Office Supplies', quantity: 120, price: 12.50, supplier_name: 'Prime Office Supplies' },
    { product_name: 'Dual Monitor Arm', category: 'Furniture', quantity: 15, price: 75.00, supplier_name: 'Elite Furniture Co.' },
    { product_name: 'Laptop Stand', category: 'Electronics', quantity: 40, price: 29.99, supplier_name: 'Global Tech Solutions' },
    { product_name: 'Sticky Notes Bulk', category: 'Office Supplies', quantity: 500, price: 8.50, supplier_name: 'Prime Office Supplies' }
];

async function seed() {
    try {
        await initDb();
        console.log('Connected to SQLite for seeding...');

        // Clear existing data
        db.serialize(() => {
            db.run('DELETE FROM inventory');
            db.run('DELETE FROM suppliers');
            console.log('Cleared existing data.');

            // Insert Suppliers
            const supplierMap = {};
            let suppliersProcessed = 0;

            suppliers.forEach(s => {
                db.run('INSERT INTO suppliers (name, city) VALUES (?, ?)', [s.name, s.city], function(err) {
                    if (err) throw err;
                    supplierMap[s.name] = this.lastID;
                    suppliersProcessed++;

                    if (suppliersProcessed === suppliers.length) {
                        console.log(`Inserted ${suppliersProcessed} suppliers.`);
                        
                        // Insert Inventory
                        let inventoryProcessed = 0;
                        inventoryItems.forEach(item => {
                            db.run(
                                'INSERT INTO inventory (supplier_id, product_name, category, quantity, price) VALUES (?, ?, ?, ?, ?)',
                                [supplierMap[item.supplier_name], item.product_name, item.category, item.quantity, item.price],
                                function(err) {
                                    if (err) throw err;
                                    inventoryProcessed++;
                                    if (inventoryProcessed === inventoryItems.length) {
                                        console.log(`Inserted ${inventoryProcessed} inventory items.`);
                                        console.log('Database seeded successfully!');
                                        process.exit();
                                    }
                                }
                            );
                        });
                    }
                });
            });
        });

    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
