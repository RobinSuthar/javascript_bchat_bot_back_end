import dotenv from "dotenv";
import express from "express";
import mailgun from "mailgun-js";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Enable CORS for all origins (you can modify this to allow specific origins)
app.use(
  cors({
    origin: "https://highlannderaibot.netlify.app", // Allow only this origin
  })
);

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

app.post("/submit-feedback", (req, res) => {
  const { feedback, email, isAnonymous, wantsUpdates } = req.body;

  let emailContent = `Feedback received:\n\n${feedback}`;
  emailContent += isAnonymous ? "\n\nFrom: Anonymous" : `\n\nFrom: ${email}`;
  emailContent += wantsUpdates
    ? "\n\nUser wants updates."
    : "\n\nUser does not want updates.";

  const data = {
    from: "robinsuthar.rs07@gmail.com", // Sender's email
    to: "robinsuthar.sd@gmail.com", // Your email address
    subject: "New Feedback Submitted",
    text: emailContent,
  };

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Error sending feedback" });
    }
    console.log(body);
    res.status(200).json({ message: "Feedback submitted successfully" });
  });
});

app.listen(3002, () => {
  console.log("Server running on port 3002");
});
