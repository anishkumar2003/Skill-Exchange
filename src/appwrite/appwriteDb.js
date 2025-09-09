import config from "../config/config";
import {
  Client,
  ID,
  Databases,
  Storage,
  Query,
  Permission,
  Role,
} from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  // CREATE with permissions
  async createProfileDocument(userId, userName, bio, skills, skillsNeeded) {
    try {
      const data = { userId, userName, bio, skills, skillsNeeded };

      // ✅ attach permissions
      const permissions = [
        Permission.read(Role.any()), // anyone can read (for explore)
        Permission.update(Role.user(userId)), // only the owner can update
        Permission.delete(Role.user(userId)), // only the owner can delete
      ];

      const doc = await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        ID.unique(),
        data,
        permissions
      );

      return { success: true, data: doc };
    } catch (err) {
      console.error("Appwrite :: createProfileDocument :: error", err);
      return { success: false, error: err };
    }
  }

  // READ (fetch by userId)
  async getProfileDocument(userId) {
    try {
      const response = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        [Query.equal("userId", userId)]
      );

      if (response.documents.length > 0) {
        return response.documents[0]; // return first matching profile
      }
      return null;
    } catch (err) {
      console.error("Appwrite :: getProfileDocument :: error", err);
      throw err;
    }
  }

  // UPDATE (update by documentId)
  async updateProfileDocument(documentId, updatedData) {
    try {
      return await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        documentId,
        updatedData
      );
    } catch (err) {
      console.error("Appwrite :: updateProfileDocument :: error", err);
      throw err;
    }
  }

  // DELETE
  async deleteProfileDocument(documentId) {
    try {
      return await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        documentId
      );
    } catch (err) {
      console.error("Appwrite :: deleteProfileDocument :: error", err);
      throw err;
    }
  }

  // READ all
  async getAllProfiles() {
    try {
      const response = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId
      );
      return response.documents;
    } catch (err) {
      console.error("Appwrite :: getAllProfiles :: error", err);
      throw err;
    }
  }
}

const service = new Service();
export default service;
