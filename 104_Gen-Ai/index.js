import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { ChatMistralAI } from "@langchain/mistralai";
import "dotenv/config";
import { createAgent, HumanMessage, tool } from "langchain";
import { sendEmail } from './mail.service.js';
import * as z from "zod";


const emailTool = tool(
  sendEmail,

  {
    name: "sendEmail",
    description: "Used to send emails.",
    schema: z.object({
      to: z.string().describe("The recipient's email address."),
      html: z.string().describe("The HTML content of the email."),
      subject: z.string().describe("The subject of the email."),
      text: z.string().optional().describe("The plain text content of the email (optional)."),
    })
  }
)

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
};

const color = (name, text) => `${colors[name]}${text}${colors.reset}`;

const rl = createInterface({
  input,
  output,
});

// rl.question('Enter your message: ', (input) => {
//   console.log(`You entered: ${input}`);
//   rl.close();
// });

const model = new ChatMistralAI({
model: "mistral-small-latest",
temperature: 0
});

const agent = createAgent({ // calls the emailtool function when the user asks to send an email
  model,
  tools: [emailTool]
})

const messages = []

try {
  while (true) {

    const userInput = await rl.question(`${color('bold', color('blue', 'You'))}: `);

    if (!userInput.trim()) continue;

    messages.push(new HumanMessage(userInput)); // pushes the user's input to the messages array

    const response = await agent.invoke({messages});

    messages.length = 0;
messages.push(...response.messages);//stores the AI's response in the messages array

    console.log(`\n${color('bold', color('green', 'AI'))}: ${response.messages[response.messages.length - 1].content}\n`);
  }
} finally {
  rl.close();
}


// const response = await model.invoke("Write a short essay on how to improve pattern recognition in human brain")

// console.log("Model response:", response.text);
