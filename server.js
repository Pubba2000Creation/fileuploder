// server.js
const express = require("express");
const {
  S3Client,
  PutObjectCommand,
  getSignedUrl,
} = require("@aws-sdk/client-s3");
const app = express();
const port = 3000;

// Set up AWS S3 (DigitalOcean Spaces) configuration
const spacesEndpoint = "https://blr1.digitaloceanspaces.com"; // Your Space endpoint
const s3 = new S3Client({
  region: "us-east-1", // Region (for DigitalOcean Spaces, usually 'us-east-1')
  endpoint: spacesEndpoint,
  credentials: {
    accessKeyId: "DO00UT7AHYDPG8LXC87M", // Your Access Key ID
    secretAccessKey: "Ii6fea97j6DJ/hYm1eD1vNqeExQ5O6Nc7at6K8/fWjU", // Your Secret Key
  },
});

app.use(express.static("public")); // Serve static files (like your HTML page)

// Endpoint to generate the pre-signed URL for file upload
app.get("/generate-presigned-url", async (req, res) => {
  const params = {
    Bucket: "datasetimages", // Your Space name
    Key: `collectionOfData/${Date.now()}.jpg`, // The file path you want to upload to
    Expires: 60, // URL expiration time in seconds (1 minute)
    ContentType: "image/jpeg", // Content type of the file you're uploading
  };

  try {
    const command = new PutObjectCommand(params); // Create the command
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // Get the pre-signed URL

    // Send the pre-signed URL to the client
    res.json({ presignedUrl });
  } catch (error) {
    console.error("Error generating presigned URL", error);
    res.status(500).send("Error generating presigned URL");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
