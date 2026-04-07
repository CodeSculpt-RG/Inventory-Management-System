const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    product_name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0.01 }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
