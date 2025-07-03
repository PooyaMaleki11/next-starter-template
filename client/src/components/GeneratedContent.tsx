import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Heading, 
  AlignRight, 
  Hash, 
  Tags, 
  Download, 
  Save,
  FileCode,
  FileText,
  Check,
  Upload
} from "lucide-react";
import { copyToClipboard, downloadAsJSON, downloadAsHTML } from "@/lib/persian-utils";
import { useToast } from "@/hooks/use-toast";
import type { GenerateContentResponse } from "@shared/schema";

interface GeneratedContentProps {
  content: GenerateContentResponse | null;
  isLoading: boolean;
}

export default function GeneratedContent({ content, isLoading }: GeneratedContentProps) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedStates(prev => ({ ...prev, [type]: true }));
      toast({
        title: "کپی شد!",
        description: "محتوا با موفقیت کپی شد.",
      });
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } else {
      toast({
        title: "خطا در کپی",
        description: "نتوانستیم محتوا را کپی کنیم.",
        variant: "destructive",
      });
    }
  };

  const handleExportJSON = () => {
    if (content) {
      downloadAsJSON(content, `product-content-${Date.now()}`);
      toast({
        title: "فایل ذخیره شد",
        description: "فایل JSON با موفقیت دانلود شد.",
      });
    }
  };

  const handleExportHTML = () => {
    if (content) {
      downloadAsHTML(content, `product-content-${Date.now()}`);
      toast({
        title: "فایل ذخیره شد",
        description: "فایل HTML با موفقیت دانلود شد.",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="premium-card border-0 rounded-3xl overflow-hidden">
        <CardContent className="p-12 text-center">
          <div className="relative mx-auto mb-8">
            <div className="w-24 h-24 relative">
              <div className="absolute inset-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-2 w-20 h-20 border-4 border-purple-500/50 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              <div className="absolute inset-4 w-16 h-16 border-4 border-indigo-500/30 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '2s' }} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full pulse-glow"></div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text">
              🤖 هوش مصنوعی در حال کار...
            </h3>
            <p className="text-lg text-muted-foreground">
              تصویر شما در حال تحلیل است
            </p>
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!content) {
    return (
      <Card className="premium-card border-0 rounded-3xl overflow-hidden">
        <CardContent className="p-12 text-center">
          <div className="relative mx-auto mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto floating-animation">
              <Upload className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="absolute inset-0 w-24 h-24 border-2 border-dashed border-blue-500/30 rounded-full mx-auto animate-spin" style={{ animationDuration: '10s' }}></div>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text">
              📤 آماده دریافت تصویر
            </h3>
            <p className="text-lg text-muted-foreground">
              تصویر محصول خود را آپلود کنید تا هوش مصنوعی آن را تحلیل کند
            </p>
            <div className="flex items-center justify-center space-x-4 space-x-reverse text-sm text-muted-foreground">
              <div className="flex items-center space-x-1 space-x-reverse">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>آماده</span>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>منتظر</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generated Title */}
      <Card className="premium-card border-0 rounded-3xl overflow-hidden success-bounce">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Heading className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">عنوان محصول</h3>
                <p className="text-sm text-muted-foreground">عنوان جذاب و بهینه شده</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(content.title, 'title')}
              className={`rounded-2xl font-medium transition-all duration-300 ${
                copiedStates.title 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'glass-effect hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              {copiedStates.title ? (
                <Check className="w-4 h-4 ml-2" />
              ) : (
                <Copy className="w-4 h-4 ml-2" />
              )}
              {copiedStates.title ? 'کپی شد!' : 'کپی'}
            </Button>
          </div>
          <div className="glass-effect rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/10"></div>
            <p className="text-xl font-bold relative z-10">{content.title}</p>
          </div>
        </CardContent>
      </Card>

      {/* Generated Description */}
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <AlignRight className="w-5 h-5 ml-2 text-primary" />
              توضیحات محصول
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(content.description, 'description')}
              className={copiedStates.description ? 'bg-success text-success-foreground' : ''}
            >
              {copiedStates.description ? (
                <Check className="w-4 h-4 ml-1" />
              ) : (
                <Copy className="w-4 h-4 ml-1" />
              )}
              {copiedStates.description ? 'کپی شد' : 'کپی'}
            </Button>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="leading-relaxed">{content.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Generated Hashtags */}
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Hash className="w-5 h-5 ml-2 text-primary" />
              هشتگ‌ها
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(content.hashtags.join(' '), 'hashtags')}
              className={copiedStates.hashtags ? 'bg-success text-success-foreground' : ''}
            >
              {copiedStates.hashtags ? (
                <Check className="w-4 h-4 ml-1" />
              ) : (
                <Copy className="w-4 h-4 ml-1" />
              )}
              {copiedStates.hashtags ? 'کپی شد' : 'کپی'}
            </Button>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-primary bg-primary/10">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Categories */}
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Tags className="w-5 h-5 ml-2 text-primary" />
              دسته‌بندی پیشنهادی
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(content.categories.join(', '), 'categories')}
              className={copiedStates.categories ? 'bg-success text-success-foreground' : ''}
            >
              {copiedStates.categories ? (
                <Check className="w-4 h-4 ml-1" />
              ) : (
                <Copy className="w-4 h-4 ml-1" />
              )}
              {copiedStates.categories ? 'کپی شد' : 'کپی'}
            </Button>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="space-y-2">
              {content.categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-card rounded border">
                  <span className="font-medium">دسته {index + 1}:</span>
                  <span className="text-muted-foreground">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="card-hover">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Download className="w-5 h-5 ml-2 text-primary" />
            خروجی و ذخیره
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={handleExportJSON}
              className="flex items-center justify-center"
            >
              <FileCode className="w-4 h-4 ml-2" />
              JSON
            </Button>
            
            <Button
              variant="outline"
              onClick={handleExportHTML}
              className="flex items-center justify-center"
            >
              <FileText className="w-4 h-4 ml-2" />
              HTML
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => {
                // Save to localStorage
                const saved = JSON.parse(localStorage.getItem('product-history') || '[]');
                const newItem = {
                  ...content,
                  id: Date.now(),
                  createdAt: new Date().toISOString(),
                };
                saved.unshift(newItem);
                localStorage.setItem('product-history', JSON.stringify(saved.slice(0, 50))); // Keep last 50
                toast({
                  title: "ذخیره شد",
                  description: "محتوا در تاریخچه ذخیره شد.",
                });
              }}
            >
              <Save className="w-4 h-4 ml-2" />
              ذخیره
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
