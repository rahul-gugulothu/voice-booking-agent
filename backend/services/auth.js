import fs from "fs/promises";
import path from "path";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "credentials",
  "credentials.json"
);

const TOKEN_PATH = path.join(
  process.cwd(),
  "token.json"
);

async function loadCredentials() {
  const content = await fs.readFile(CREDENTIALS_PATH, "utf8");
  const keys = JSON.parse(content);

  const key = keys.installed;

  return new OAuth2Client(
    key.client_id,
    key.client_secret,
    key.redirect_uris[0]
  );
}

export async function getAuthenticatedClient() {
  const client = await loadCredentials();

  try {
    const token = await fs.readFile(TOKEN_PATH, "utf8");
    client.setCredentials(JSON.parse(token));
  } catch {
    return client;
  }

  return client;
}

export { SCOPES, TOKEN_PATH };