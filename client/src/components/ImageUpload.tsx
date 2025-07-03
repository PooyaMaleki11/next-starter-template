import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Camera, Upload, FolderOpen, X, Settings, CheckCircle, Sparkles, Zap } from "lucide-react";
import { validateImageFile, getImagePreviewUrl } from "@/lib/persian-utils";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageSelect: (file: File, settings: GenerationSettings) => void;
  isGenerating: boolean;
}

export interface GenerationSettings {
  descriptionLength: 'short' | 'medium' | 'long';
  targetPlatforms: string[];
}

export default function ImageUpload({ onImageSelect, isGenerating }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImageReady, setIsImageReady] = useState(false);
  const [settings, setSettings] = useState<GenerationSettings>({
    descriptionLength: 'medium',
    targetPlatforms: ['store', 'instagram']
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: "خطا در انتخاب فایل",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    try {
      const previewUrl = await getImagePreviewUrl(file);
      setSelectedFile(file);
      setPreviewUrl(previewUrl);
      
      // Add success animation effect
      setTimeout(() => {
        setIsImageReady(true);
        toast({
          title: "✨ تصویر آپلود شد!",
          description: "تصویر شما با موفقیت بارگذاری شد و آماده تحلیل است.",
        });
      }, 300);
    } catch (error) {
      toast({
        title: "خطا در پردازش فایل",
        description: "نتوانستیم فایل را پردازش کنیم. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsImageReady(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = () => {
    if (selectedFile) {
      onImageSelect(selectedFile, settings);
    }
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      targetPlatforms: checked 
        ? [...prev.targetPlatforms, platform]
        : prev.targetPlatforms.filter(p => p !== platform)
    }));
  };

  return (
    <div className="space-y-8">
      {/* Upload Card */}
      <Card className="premium-card border-0 rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text">آپلود تصویر محصول</h2>
                <p className="text-sm text-muted-foreground">هوش مصنوعی در انتظار تحلیل تصویر شماست</p>
              </div>
            </div>
            <div className="breathing">
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          
          <div
            className={`upload-zone ${isDragOver ? 'drag-active' : ''} border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-500`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-6">
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                {isDragOver && (
                  <>
                    <div className="pulse-ring w-24 h-24"></div>
                    <div className="pulse-ring w-24 h-24" style={{ animationDelay: '0.5s' }}></div>
                  </>
                )}
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Camera className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold gradient-text">
                  {isDragOver ? "حالا رها کنید! 🚀" : "تصویر محصول را انتخاب کنید"}
                </h3>
                <p className="text-base text-muted-foreground">
                  فایل را اینجا بکشید یا کلیک کنید
                </p>
              </div>
              
              <Button 
                type="button" 
                variant="default" 
                size="lg"
                className="premium-button text-white font-semibold py-3 px-8 rounded-xl pointer-events-none"
              >
                <FolderOpen className="w-5 h-5 ml-2" />
                انتخاب از گالری
              </Button>
              
              <div className="flex items-center justify-center space-x-6 space-x-reverse text-xs text-muted-foreground">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>JPG, PNG, WebP</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>حداکثر 5MB</span>
                </div>
              </div>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Image Preview Card */}
      {selectedFile && previewUrl && (
        <Card className={`premium-card border-0 rounded-3xl overflow-hidden ${isImageReady ? 'success-bounce' : ''}`}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">پیش‌نمایش تصویر</h3>
                  <p className="text-sm text-muted-foreground">تصویر با موفقیت بارگذاری شد</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={previewUrl}
                  alt="پیش‌نمایش محصول"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </div>
            
            <div className="mt-6 p-4 glass-effect rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">آماده تحلیل</p>
                    <p className="text-xs text-muted-foreground">{selectedFile.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">حجم فایل</p>
                  <p className="text-sm font-medium">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Card */}
      <Card className="premium-card border-0 rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center space-x-3 space-x-reverse mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold gradient-text">تنظیمات هوشمند</h3>
              <p className="text-sm text-muted-foreground">محتوا را مطابق نیاز خود شخصی‌سازی کنید</p>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Description Length */}
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center space-x-2 space-x-reverse">
                <span>طول توضیحات</span>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </Label>
              <Select 
                value={settings.descriptionLength} 
                onValueChange={(value: 'short' | 'medium' | 'long') => 
                  setSettings(prev => ({ ...prev, descriptionLength: value }))
                }
              >
                <SelectTrigger className="h-14 rounded-2xl border-0 glass-effect font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-0 glass-effect">
                  <SelectItem value="short" className="rounded-xl h-12">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>کوتاه (50-100 کلمه)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium" className="rounded-xl h-12">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>متوسط (100-200 کلمه)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="long" className="rounded-xl h-12">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>بلند (200-300 کلمه)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Target Platform */}
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center space-x-2 space-x-reverse">
                <span>پلتفرم هدف</span>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </Label>
              <div className="grid grid-cols-1 gap-4">
                <div className={`relative p-4 glass-effect rounded-2xl cursor-pointer transition-all duration-300 ${
                  settings.targetPlatforms.includes('store') ? 'ring-2 ring-blue-500 bg-blue-500/10' : 'hover:bg-white/10'
                }`}>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Checkbox
                      id="store"
                      checked={settings.targetPlatforms.includes('store')}
                      onCheckedChange={(checked) => handlePlatformChange('store', checked as boolean)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="store" className="text-base font-medium cursor-pointer">فروشگاه آنلاین</Label>
                      <p className="text-sm text-muted-foreground">برای فروش در پلتفرم‌های آنلاین</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400">🛒</span>
                    </div>
                  </div>
                </div>
                
                <div className={`relative p-4 glass-effect rounded-2xl cursor-pointer transition-all duration-300 ${
                  settings.targetPlatforms.includes('instagram') ? 'ring-2 ring-pink-500 bg-pink-500/10' : 'hover:bg-white/10'
                }`}>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Checkbox
                      id="instagram"
                      checked={settings.targetPlatforms.includes('instagram')}
                      onCheckedChange={(checked) => handlePlatformChange('instagram', checked as boolean)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="instagram" className="text-base font-medium cursor-pointer">اینستاگرام</Label>
                      <p className="text-sm text-muted-foreground">برای شبکه‌های اجتماعی</p>
                    </div>
                    <div className="w-8 h-8 bg-pink-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-pink-600 dark:text-pink-400">📸</span>
                    </div>
                  </div>
                </div>

                <div className={`relative p-4 glass-effect rounded-2xl cursor-pointer transition-all duration-300 ${
                  settings.targetPlatforms.includes('telegram') ? 'ring-2 ring-blue-400 bg-blue-400/10' : 'hover:bg-white/10'
                }`}>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Checkbox
                      id="telegram"
                      checked={settings.targetPlatforms.includes('telegram')}
                      onCheckedChange={(checked) => handlePlatformChange('telegram', checked as boolean)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="telegram" className="text-base font-medium cursor-pointer">تلگرام</Label>
                      <p className="text-sm text-muted-foreground">برای کانال‌ها و گروه‌ها</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-400/20 rounded-xl flex items-center justify-center">
                      <span className="text-blue-400">✈️</span>
                    </div>
                  </div>
                </div>

                <div className={`relative p-4 glass-effect rounded-2xl cursor-pointer transition-all duration-300 ${
                  settings.targetPlatforms.includes('whatsapp') ? 'ring-2 ring-green-500 bg-green-500/10' : 'hover:bg-white/10'
                }`}>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Checkbox
                      id="whatsapp"
                      checked={settings.targetPlatforms.includes('whatsapp')}
                      onCheckedChange={(checked) => handlePlatformChange('whatsapp', checked as boolean)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="whatsapp" className="text-base font-medium cursor-pointer">واتساپ</Label>
                      <p className="text-sm text-muted-foreground">برای پیام‌رسانی و کسب‌وکار</p>
                    </div>
                    <div className="w-8 h-8 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-green-500">💚</span>
                    </div>
                  </div>
                </div>

                <div className={`relative p-4 glass-effect rounded-2xl cursor-pointer transition-all duration-300 ${
                  settings.targetPlatforms.includes('marketplace') ? 'ring-2 ring-amber-500 bg-amber-500/10' : 'hover:bg-white/10'
                }`}>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Checkbox
                      id="marketplace"
                      checked={settings.targetPlatforms.includes('marketplace')}
                      onCheckedChange={(checked) => handlePlatformChange('marketplace', checked as boolean)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="marketplace" className="text-base font-medium cursor-pointer">مارکت‌پلیس</Label>
                      <p className="text-sm text-muted-foreground">دیجی‌کالا، بازار، ایبای</p>
                    </div>
                    <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-amber-500">🏬</span>
                    </div>
                  </div>
                </div>

                <div className={`relative p-4 glass-effect rounded-2xl cursor-pointer transition-all duration-300 ${
                  settings.targetPlatforms.includes('website') ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : 'hover:bg-white/10'
                }`}>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Checkbox
                      id="website"
                      checked={settings.targetPlatforms.includes('website')}
                      onCheckedChange={(checked) => handlePlatformChange('website', checked as boolean)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="website" className="text-base font-medium cursor-pointer">وب‌سایت</Label>
                      <p className="text-sm text-muted-foreground">سایت شخصی و فروشگاهی</p>
                    </div>
                    <div className="w-8 h-8 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-indigo-500">🌐</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!selectedFile || isGenerating}
              className="w-full h-16 premium-button text-white font-bold text-lg rounded-2xl relative overflow-hidden group"
              size="lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-pulse opacity-75"></div>
              <div className="relative flex items-center justify-center space-x-3 space-x-reverse">
                {isGenerating ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="loading-dots">در حال تولید محتوا</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>🚀 تولید محتوای هوشمند</span>
                  </>
                )}
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
