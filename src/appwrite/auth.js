import config from "../config/config";
import { Client, Account, ID } from "appwrite";
import { formatError } from "../utils/error";

class AuthService {
  client;
  account;

  constructor() {
    this.client = new Client()
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async register({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      return { success: true, data: userAccount };
    } catch (error) {
      return formatError(error, "AuthService :: register");
    }
  }

  async login({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      const user = await this.account.get();
      return { success: true, data: user };
    } catch (error) {
      return formatError(error, "AuthService :: login");
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
      return { success: true };
    } catch (error) {
      return formatError(error, "AuthService :: logout");
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      return { success: true, data: user };
    } catch (error) {
      return formatError(error, "AuthService :: getCurrentUser");
    }
  }
}

const authService = new AuthService();
export default authService;
