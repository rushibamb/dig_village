const mongoose = require('mongoose');
const TaxRecord = require('./src/models/taxRecordModel');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/village_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createTestTaxRecords() {
  try {
    console.log('Creating test tax records...');
    
    // Clear existing records
    await TaxRecord.deleteMany({});
    
    // Create test records
    const testRecords = [
      {
        houseNumber: 'H-101',
        ownerName: 'Rushikesh Bamb',
        taxType: 'Water Tax',
        amountDue: 10,
        dueDate: new Date('2024-12-31'),
        status: 'Pending'
      },
      {
        houseNumber: 'H-102',
        ownerName: 'John Doe',
        taxType: 'Property Tax',
        amountDue: 2500,
        dueDate: new Date('2024-12-31'),
        status: 'Pending'
      },
      {
        houseNumber: 'H-103',
        ownerName: 'Jane Smith',
        taxType: 'Garbage Tax',
        amountDue: 500,
        dueDate: new Date('2024-12-31'),
        status: 'Pending'
      }
    ];
    
    const createdRecords = await TaxRecord.insertMany(testRecords);
    console.log('Created test tax records:', createdRecords.length);
    
    // List all records
    const allRecords = await TaxRecord.find({});
    console.log('All tax records in database:');
    allRecords.forEach(record => {
      console.log(`- ID: ${record._id}, House: ${record.houseNumber}, Owner: ${record.ownerName}, Amount: ${record.amountDue}`);
    });
    
  } catch (error) {
    console.error('Error creating test records:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestTaxRecords();
