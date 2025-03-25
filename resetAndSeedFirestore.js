//==============================//
// Firestore Reset and Seed Script
//==============================//
const admin = require("firebase-admin");
const fs = require("fs");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // Replace with your service account key file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Deletes all documents in a Firestore collection.
 * Recursively deletes subcollections as well.
 * @param {string} collectionPath - The path to the collection to delete.
 * @returns {Promise<void>}
 */
const deleteCollection = async (collectionPath) => {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.limit(500); // Batch size for deletion (max 500)

  const snapshot = await query.get();
  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  console.log(`Deleted ${snapshot.size} documents from ${collectionPath}.`);

  if (snapshot.size === 500) {
    // If more documents exist, recursively delete the next batch
    return deleteCollection(collectionPath);
  }
};

/**
 * Seed the Firestore database with test data.
 * @returns {Promise<void>}
 */
const seedFirestore = async () => {
  // Example: Seed the "projects" collection
  const projects = [
    {
      name: "Project Alpha",
      createdBy: "testUserId123",
      sharedWith: ["test@example.com", "collaborator@example.com"],
      createdAt: admin.firestore.Timestamp.now(),
      dueDate: admin.firestore.Timestamp.fromDate(new Date("2025-01-15")),
    },
    {
      name: "Project Beta",
      createdBy: "testUserId456",
      sharedWith: ["user@example.com"],
      createdAt: admin.firestore.Timestamp.now(),
      dueDate: admin.firestore.Timestamp.fromDate(new Date("2025-01-20")),
    },
  ];

  const batch = db.batch();
  const projectsCollectionRef = db.collection("projects");

  projects.forEach((project) => {
    const docRef = projectsCollectionRef.doc(); // Automatically generate a document ID
    batch.set(docRef, project);
  });

  await batch.commit();

  console.log("Seeded Firestore with test projects.");
};

/**
 * Main function to reset Firestore and seed data.
 */
const resetAndSeedFirestore = async () => {
  try {
    console.log("Starting Firestore reset...");

    // Delete all data from Firestore
    await deleteCollection("projects"); // Add more collections as needed
    await deleteCollection("activities"); // Example: Delete `activities` collection

    console.log("Firestore reset complete. Seeding test data...");

    // Seed Firestore with test data
    await seedFirestore();

    console.log("Firestore has been seeded with test data.");
  } catch (error) {
    console.error("Error resetting and seeding Firestore:", error);
  } finally {
    process.exit(); // Exit the script
  }
};

// Run the script
resetAndSeedFirestore();