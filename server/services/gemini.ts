import { GoogleGenAI } from "@google/genai";
import type { GenerationSettings } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: "AIzaSyBIY1Plju9N777yHxNdeCNHH2fLUjPU15U"
});

interface ProductAnalysisResult {
  title: string;
  description: string;
  hashtags: string[];
  categories: string[];
}

export async function analyzeProductImage(
  imageBuffer: Buffer,
  mimeType: string,
  settings: GenerationSettings
): Promise<ProductAnalysisResult> {
  try {
    const imageBase64 = imageBuffer.toString('base64');
    
    // Create detailed prompt based on settings
    const descriptionLengthMap = {
      short: '50-100 کلمه',
      medium: '100-200 کلمه',
      long: '200-300 کلمه'
    };

    const platformInstructions = settings.targetPlatforms.includes('instagram') 
      ? 'مناسب برای پست اینستاگرام و شبکه‌های اجتماعی' 
      : 'مناسب برای فروشگاه آنلاین';

    const systemPrompt = `شما یک متخصص بازاریابی و تولید محتوای فارسی هستید. وظیفه شما تحلیل تصویر محصولات و تولید محتوای حرفه‌ای فارسی است.

از تصویر محصول ارائه شده، موارد زیر را به زبان فارسی تولید کنید:

1. عنوان: عنوانی جذاب و هوشمند برای محصول (حداکثر 80 کاراکتر)
2. توضیحات: توضیحات حرفه‌ای محصول (${descriptionLengthMap[settings.descriptionLength]}) که ${platformInstructions}
3. هشتگ‌ها: 10 هشتگ مرتبط و ترند به زبان فارسی (با # در ابتدا)
4. دسته‌بندی‌ها: 3-5 دسته‌بندی مناسب برای محصول

نکات مهم:
- همه محتوا باید به زبان فارسی باشد
- از کلمات کلیدی مرتبط با محصول استفاده کنید
- توضیحات باید جذاب و فروش‌محور باشد
- هشتگ‌ها باید ترند و پرکاربرد باشند
- دسته‌بندی‌ها باید دقیق و مناسب محصول باشند

پاسخ را در قالب JSON با فرمت زیر ارائه دهید:
{
  "title": "عنوان محصول",
  "description": "توضیحات کامل محصول",
  "hashtags": ["#هشتگ۱", "#هشتگ۲", ...],
  "categories": ["دسته۱", "دسته۲", ...]
}`;

    const contents = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
      "بر اساس این تصویر محصول، محتوای فارسی مطابق دستورالعمل تولید کنید."
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { 
              type: "string",
              description: "عنوان جذاب محصول به فارسی"
            },
            description: { 
              type: "string",
              description: "توضیحات کامل محصول به فارسی"
            },
            hashtags: {
              type: "array",
              items: { type: "string" },
              description: "آرایه‌ای از هشتگ‌های فارسی"
            },
            categories: {
              type: "array",
              items: { type: "string" },
              description: "آرایه‌ای از دسته‌بندی‌های محصول"
            }
          },
          required: ["title", "description", "hashtags", "categories"],
        },
      },
      contents: contents,
    });

    const rawJson = response.text;
    console.log('Gemini API Response:', rawJson);

    if (!rawJson) {
      throw new Error("پاسخ خالی از سرویس هوش مصنوعی دریافت شد");
    }

    let result: ProductAnalysisResult;
    try {
      result = JSON.parse(rawJson);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error("خطا در تفسیر پاسخ سرویس هوش مصنوعی");
    }

    // Validate response structure
    if (!result.title || !result.description || !Array.isArray(result.hashtags) || !Array.isArray(result.categories)) {
      throw new Error("ساختار پاسخ سرویس هوش مصنوعی نامعتبر است");
    }

    // Ensure hashtags start with #
    result.hashtags = result.hashtags.map(tag => 
      tag.startsWith('#') ? tag : `#${tag}`
    );

    // Limit hashtags to 10
    if (result.hashtags.length > 10) {
      result.hashtags = result.hashtags.slice(0, 10);
    }

    // Ensure we have at least some hashtags and categories
    if (result.hashtags.length === 0) {
      result.hashtags = ['#محصول', '#کیفیت_بالا', '#خرید_آنلاین'];
    }

    if (result.categories.length === 0) {
      result.categories = ['عمومی', 'محصولات متنوع'];
    }

    return result;

  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    
    if (error instanceof Error) {
      // Handle specific API errors
      if (error.message.includes('API_KEY')) {
        throw new Error("کلید API نامعتبر است. لطفاً کلید صحیح را وارد کنید.");
      }
      if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error("محدودیت استفاده از سرویس. لطفاً بعداً تلاش کنید.");
      }
      if (error.message.includes('image') || error.message.includes('format')) {
        throw new Error("فرمت تصویر پشتیبانی نمی‌شود. لطفاً تصویر JPG، PNG یا WebP آپلود کنید.");
      }
      
      // Return user-friendly error message
      throw new Error(`خطا در تحلیل تصویر: ${error.message}`);
    }
    
    throw new Error("خطای غیرمنتظره در تحلیل تصویر. لطفاً دوباره تلاش کنید.");
  }
}

// Helper function for testing API connection
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "سلام، آیا می‌توانید به فارسی پاسخ دهید؟",
    });

    return !!response.text && response.text.length > 0;
  } catch (error) {
    console.error('Gemini connection test failed:', error);
    return false;
  }
}
