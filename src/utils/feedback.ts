// In a component or service file where you want to add data
import { db } from './database'; // Adjust the path to your firebase config file
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// type FeedbackData = {
//   score: number;
// }
// Function to add a new Feedback

interface FeedbackData {
  score: number | null; // Define what score can be
  // Add any other expected fields here
  [key: string]: any; // Allow other dynamic properties if necessary
}


const addFeedback = async (feedback: number) => {
  try {
    // Get a reference to the "Feedbacks" collection
    const FeedbacksCollectionRef = collection(db, "feedbacks");

    // Add a new document ith a generated ID
    const docRef = await addDoc(FeedbacksCollectionRef, {
      "score":feedback, // Your Feedback data object (e.g., { name: "Alice", email: "alice@example.com" })
      "createdAt": serverTimestamp() // Optional: add a server timestamp
    },
    //  {"merge": true}
  );

    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Return the ID of the newly created document
  } catch (e) {
    console.error("Error adding document: ", e);
    // Handle the error appropriately in your UI
    return null;
  }
};

export { addFeedback , FeedbackData};