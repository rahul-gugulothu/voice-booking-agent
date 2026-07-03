import fs from "fs/promises";
import readline from "readline";
import { google } from "googleapis";
import { getAuthenticatedClient, SCOPES, TOKEN_PATH } from "./services/auth.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function authorize() {
  const client = await getAuthenticatedClient();

  // If token already exists
  try {
    await fs.access(TOKEN_PATH);
    console.log("✅ token.json already exists");
    rl.close();
    return;
  } catch {}

  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("\nOpen this URL in your browser:\n");
  console.log(authUrl);

  rl.question("\nPaste the authorization code here:\n", async (code) => {
    try {
      const { tokens } = await client.getToken(code);

      client.setCredentials(tokens);

      await fs.writeFile(
        TOKEN_PATH,
        JSON.stringify(tokens, null, 2)
      );

      console.log("\n✅ token.json created successfully!");

      rl.close();
    } catch (err) {
      console.error(err);
      rl.close();
    }
  });
}

authorize();