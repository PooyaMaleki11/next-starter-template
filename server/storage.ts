import { productAnalyses, type ProductAnalysis, type InsertProductAnalysis } from "@shared/schema";

export interface IStorage {
  getProductAnalysis(id: number): Promise<ProductAnalysis | undefined>;
  getAllProductAnalyses(): Promise<ProductAnalysis[]>;
  createProductAnalysis(analysis: InsertProductAnalysis): Promise<ProductAnalysis>;
  deleteProductAnalysis(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private analyses: Map<number, ProductAnalysis>;
  private currentId: number;

  constructor() {
    this.analyses = new Map();
    this.currentId = 1;
  }

  async getProductAnalysis(id: number): Promise<ProductAnalysis | undefined> {
    return this.analyses.get(id);
  }

  async getAllProductAnalyses(): Promise<ProductAnalysis[]> {
    return Array.from(this.analyses.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createProductAnalysis(insertAnalysis: InsertProductAnalysis): Promise<ProductAnalysis> {
    const id = this.currentId++;
    const analysis: ProductAnalysis = {
      id,
      imageData: insertAnalysis.imageData,
      title: insertAnalysis.title,
      description: insertAnalysis.description,
      hashtags: insertAnalysis.hashtags,
      categories: insertAnalysis.categories,
      settings: insertAnalysis.settings,
      createdAt: new Date(),
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async deleteProductAnalysis(id: number): Promise<boolean> {
    return this.analyses.delete(id);
  }
}

export const storage = new MemStorage();
