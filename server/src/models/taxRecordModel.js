const mongoose = require('mongoose');

const taxRecordSchema = new mongoose.Schema({
  houseNumber: {
    type: String,
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  taxType: {
    type: String,
    required: true
  },
  amountDue: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue'],
    default: 'Pending'
  },
  villagerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Villager',
    required: false
  },
  paymentDetails: {
    orderId: {
      type: String
    },
    paymentId: {
      type: String
    },
    paymentDate: {
      type: Date
    },
    receiptNumber: {
      type: String
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TaxRecord', taxRecordSchema);
