const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const multer = require("multer");
const PDFDocument = require("pdfkit");

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Save uploaded files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post("/api", upload.array('images', 2), async function (req, res) {
    try {
        console.log(req.body);
        console.log(req.files); // Log uploaded files

        const genAI = new GoogleGenerativeAI("Your API KEY HERE");

        function fileToGenerativePart(path, mimeType) {
            return {
                inlineData: {
                    data: Buffer.from(fs.readFileSync(path)).toString("base64"),
                    mimeType
                },
            };
        }

        async function run() {
            const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

            const prompt = "Your prompt here"; // Define your prompt

            // Map uploaded files to imageParts
            const imageParts = req.files.map(file => fileToGenerativePart(file.path, file.mimetype));

            const results = [];
            for (let i = 0; i < 3; i++) {
                const result = await model.generateContent([prompt, ...imageParts]);
                const response = await result.response;
                const text = response.text();
                console.log("Response", i + 1, ":", text);
                results.push(text);
            }

            const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt2 = `${results.join(',')} These are the three reported I have. Give me the report in a similar format as of these reports which is the average of all these`;
            const resultf = await model2.generateContent(prompt2);
            const responsef = await resultf.response;
            const textf = responsef.text();

            // Generate PDF
            const pdfPath = './output.pdf'; // Define the path where you want to save the PDF
            const pdfDoc = new PDFDocument();
            pdfDoc.pipe(fs.createWriteStream(pdfPath));

            // Add text to PDF
            pdfDoc.fontSize(12).text(textf);

            // Add uploaded graph image to PDF
            req.files.forEach(file => {
                const imagePath = file.path;
                pdfDoc.addPage().image(imagePath, { fit: [250, 250], align: 'center', valign: 'center' });
            });

            pdfDoc.end();

            res.download(pdfPath); // Send the PDF as a download response
        }

        run();
    } catch (error) {
        console.error(error);
        res.json({ value: `${error.message}: token expired` });
    }
});

// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});
