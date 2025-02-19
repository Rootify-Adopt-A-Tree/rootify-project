import { db } from '../src/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const sampleTrees = [
  {
    name: 'Neem',
    species: 'Azadirachta indica',
    price: 299,
    location: 'Karnataka',
    benefits: ['Air purification', 'Medicinal properties'],
    available: true,
    imageUrl: 'https://example.com/neem.jpg',
    co2Absorption: '40kg per year',
    maintenanceLevel: 'Low',
    lifespanYears: 150
  },
  {
    name: 'Banyan',
    species: 'Ficus benghalensis',
    price: 399,
    location: 'Maharashtra',
    benefits: ['Oxygen production', 'Wildlife habitat'],
    available: true,
    imageUrl: 'https://example.com/banyan.jpg',
    co2Absorption: '80kg per year',
    maintenanceLevel: 'Medium',
    lifespanYears: 250
  }
];

async function initializeDB() {
  try {
    const treesRef = collection(db, 'trees');
    
    for (const tree of sampleTrees) {
      await addDoc(treesRef, tree);
      console.log(`Added tree: ${tree.name}`);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDB();
