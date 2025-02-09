import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Updated Firestore imports
import * as xlsx from "xlsx";
import fs from "fs";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAidYso4MoB2SHQhbXYgsPEJ98dn2u6Q20",
    authDomain: "score-me-7747a.firebaseapp.com",
    projectId: "score-me-7747a",
    storageBucket: "score-me-7747a.appspot.com",
    messagingSenderId: "265990731989",
    appId: "1:265990731989:web:54472fbbaf7d40bea70a5c",
    measurementId: "G-8H1C4TW0NF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to upload Excel data to Firestore
const uploadExcelToFirebase = async () => {
    const filePath = "D:/MS CS/ECS Challenge S25/poster_scoring/updated_posters (1).xlsx";  // Replace with your file path
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of data) {
        try {
            const posterId = String(row["Poster #"]); // Ensure it's a string
            const pTitle = row["Title"];
            const pAbstract = row["Abstract"];
            const judgeAssignments = [
                row["Judge 1"],
                row["Judge 2"],

            ];

            // Log judgeId to debug
            console.log("Poster #: ", posterId);  // Check if it's correct

            // Use setDoc with the Judge ID as the custom document ID
            await setDoc(doc(db, "posters", posterId), {
                posterId, //poster ID
                pTitle, // poster Abstract
                pAbstract,  // poster Abstract
                judgeAssignments // judge Assignments
            });

            console.log(`Uploaded data for Poster: ${posterId} `);
        } catch (error) {
            console.error("Error adding document: ", error);
        }






        // try {
        //     const judgeId = String(row["Judge ID"]); // Ensure it's a string
        //     const firstName = row["First Name"];
        //     const lastName = row["Last Name"];
        //     const posterAssignments = [
        //         row["Poster 1"],
        //         row["Poster 2"],
        //         row["Poster 3"],
        //         row["Poster 4"],
        //         row["Poster 5"],
        //         row["Poster 6"]
        //     ];

        //     // Log judgeId to debug
        //     console.log("Judge ID: ", judgeId);  // Check if it's correct

        //     // Use setDoc with the Judge ID as the custom document ID
        //     await setDoc(doc(db, "judges", judgeId), {
        //         judgeId, // Custom ID
        //         firstName, // First Name
        //         lastName,  // Last Name
        //         posterAssignments // Poster Assignments
        //     });

        //     console.log(`Uploaded data for Judge: ${firstName} ${lastName}`);
        // } catch (error) {
        //     console.error("Error adding document: ", error);
        // }
    }
};

uploadExcelToFirebase();




// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, addDoc, setDoc, doc } from "firebase/firestore"; // New Firestore imports
// import * as xlsx from "xlsx";
// import fs from "fs";

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyAidYso4MoB2SHQhbXYgsPEJ98dn2u6Q20",
//     authDomain: "score-me-7747a.firebaseapp.com",
//     projectId: "score-me-7747a",
//     storageBucket: "score-me-7747a.appspot.com",
//     messagingSenderId: "265990731989",
//     appId: "1:265990731989:web:54472fbbaf7d40bea70a5c",
//     measurementId: "G-8H1C4TW0NF"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);  // Use getFirestore for modular syntax

// // Function to upload Excel data to Firestore
// const uploadExcelToFirebase = async () => {
//     const filePath = "D:/MS CS/ECS Challenge S25/poster_scoring/updated_judges_pin.xlsx";  // Replace with your file path
//     const fileBuffer = fs.readFileSync(filePath);
//     const workbook = xlsx.read(fileBuffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     for (const row of data) {
//         try {
//             const judgeId = String(row["Judge ID"]); // Ensure it's a string
//             const firstName = row["First Name"];
//             const lastName = row["Last Name"];
//             const pin = row["Verification Code"];
//             const posterAssignments = [
//                 row["Poster 1"],
//                 row["Poster 2"],
//                 row["Poster 3"],
//                 row["Poster 4"],
//                 row["Poster 5"],
//                 row["Poster 6"]
//             ];

//             // Use setDoc with the Judge ID as the custom document ID
//             await setDoc(doc(db, "judges", judgeId), {
//                 judgeId, // Custom ID,
//                 pin,
//                 firstName, // First Name 
//                 lastName,  // Last Name
//                 posterAssignments // Poster Assignments
//             });

//             console.log(`Uploaded data for Judge: ${firstName} ${lastName}`)
//             // console.log(`Uploaded data for Judge: ${row["Judge"]}`);
//         } catch (error) {
//             console.error("Error adding document: ", error);
//         }
//     }
// };

// uploadExcelToFirebase();
