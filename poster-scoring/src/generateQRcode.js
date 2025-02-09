import fs from "fs";
import QRCode from "qrcode"; // QR code package
import * as xlsx from "xlsx"; // For reading the poster data from an Excel file

// Load poster data from Excel file
const loadPosterData = (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
};

// Function to generate QR codes for each poster
const generateQRCodes = async (posters) => {
    const outputDir = "./qrcodes";
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    for (const poster of posters) {
        const posterId = poster["Poster #"]?.toString().trim();  // Ensure posterId is a string and trim whitespace
        if (!posterId) {
            console.warn("Skipping poster with missing Poster ID:", poster);
            continue;
        }

        // Add the posterId to the URL
        const url = `https://score-me-7747a.web.app/poster/?posterId=${encodeURIComponent(posterId)}`;
        const qrCodePath = `${outputDir}/poster-${posterId}.png`;

        try {
            await QRCode.toFile(qrCodePath, url);
            console.log(`QR code generated for Poster ${posterId}: ${qrCodePath}`);
        } catch (error) {
            console.error(`Failed to generate QR code for Poster ${posterId}:`, error);
        }
    }
};

// Main function to execute the QR code generation
const main = () => {
    const filePath = "D:/MS CS/ECS Challenge S25/Poster_score/poster-scoring/src/updated_posters.xlsx";  // Replace with the actual path to your Excel file
    const posters = loadPosterData(filePath);
    generateQRCodes(posters).then(() => {
        console.log("QR code generation completed.");
    });
};

main();






// import fs from "fs";
// import QRCode from "qrcode"; // QR code package
// import * as xlsx from "xlsx"; // For reading the poster data from an Excel file

// // Load poster data from Excel file
// const loadPosterData = (filePath) => {
//     const fileBuffer = fs.readFileSync(filePath);
//     const workbook = xlsx.read(fileBuffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
// };

// // Function to generate QR codes for each poster
// const generateQRCodes = async (posters) => {
//     const outputDir = "./qrcodes";
//     if (!fs.existsSync(outputDir)) {
//         fs.mkdirSync(outputDir);
//     }

//     for (const poster of posters) {
//         const posterId = poster["Poster #"];  // Adjust the column name as per your Excel sheet
//         const url = `https://score-me-7747a.web.app//`; // Replace with your actual website URL
//         const qrCodePath = `${outputDir}/poster-${posterId}.png`;

//         try {
//             await QRCode.toFile(qrCodePath, url);
//             console.log(`QR code generated for Poster ${posterId}: ${qrCodePath}`);
//         } catch (error) {
//             console.error(`Failed to generate QR code for Poster ${posterId}:`, error);
//         }
//     }
// };

// // Main function to execute the QR code generation
// const main = () => {
//     const filePath = "D:/MS CS/ECS Challenge S25/Poster_score/poster-scoring/src/updated_posters.xlsx";  // Replace with the actual path to your Excel file
//     const posters = loadPosterData(filePath);
//     generateQRCodes(posters).then(() => {
//         console.log("QR code generation completed.");
//     });
// };

// main();
