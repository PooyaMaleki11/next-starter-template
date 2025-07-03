import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { analyzeProductImage } from "./services/gemini";
import { generateContentRequestSchema, type GenerateContentResponse } from "@shared/schema";

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate content from uploaded image
  app.post("/api/generate-content", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "تصویر الزامی است" });
      }

      const imageData = req.file.buffer.toString('base64');
      const settings = req.body.settings ? JSON.parse(req.body.settings) : {
        descriptionLength: 'medium',
        targetPlatforms: ['store', 'instagram']
      };

      // Validate the request
      const validatedData = generateContentRequestSchema.parse({
        imageData,
        settings
      });

      // Analyze image with Gemini
      const result = await analyzeProductImage(
        req.file.buffer,
        req.file.mimetype,
        validatedData.settings
      );

      // Save to storage
      const analysis = await storage.createProductAnalysis({
        imageData,
        title: result.title,
        description: result.description,
        hashtags: result.hashtags,
        categories: result.categories,
        settings: validatedData.settings,
      });

      const response: GenerateContentResponse = {
        title: result.title,
        description: result.description,
        hashtags: result.hashtags,
        categories: result.categories,
      };

      res.json(response);
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "خطا در تولید محتوا" 
      });
    }
  });

  // Get analysis history
  app.get("/api/history", async (req, res) => {
    try {
      const analyses = await storage.getAllProductAnalyses();
      res.json(analyses);
    } catch (error) {
      console.error('Error fetching history:', error);
      res.status(500).json({ message: "خطا در دریافت تاریخچه" });
    }
  });

  // Delete analysis from history
  app.delete("/api/history/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProductAnalysis(id);
      
      if (deleted) {
        res.json({ message: "آیتم با موفقیت حذف شد" });
      } else {
        res.status(404).json({ message: "آیتم یافت نشد" });
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
      res.status(500).json({ message: "خطا در حذف آیتم" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
