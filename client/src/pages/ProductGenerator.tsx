import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Moon, Sun, History, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { formatPersianDate } from "@/lib/persian-utils";
import { apiRequest } from "@/lib/queryClient";
import ImageUpload, { type GenerationSettings } from "@/components/ImageUpload";
import GeneratedContent from "@/components/GeneratedContent";
import type { GenerateContentResponse, ProductAnalysis } from "@shared/schema";

export default function ProductGenerator() {
  const [generatedContent, setGeneratedContent] = useState<GenerateContentResponse | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // Fetch history from server
  const { data: history = [], refetch: refetchHistory } = useQuery<ProductAnalysis[]>({
    queryKey: ['/api/history'],
    enabled: false, // Only fetch when dialog opens
  });

  // Generate content mutation
  const generateMutation = useMutation({
    mutationFn: async ({ file, settings }: { file: File; settings: GenerationSettings }) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('settings', JSON.stringify(settings));

      const response = await apiRequest('POST', '/api/generate-content', formData);
      return response.json() as Promise<GenerateContentResponse>;
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      toast({
        title: "محتوا تولید شد!",
        description: "محتوای محصول با موفقیت تولید شد.",
      });
    },
    onError: (error) => {
      console.error('Generation error:', error);
      toast({
        title: "خطا در تولید محتوا",
        description: error instanceof Error ? error.message : "لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    },
  });

  // Delete from history mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/history/${id}`);
    },
    onSuccess: () => {
      refetchHistory();
      toast({
        title: "حذف شد",
        description: "آیتم از تاریخچه حذف شد.",
      });
    },
    onError: () => {
      toast({
        title: "خطا در حذف",
        description: "نتوانستیم آیتم را حذف کنیم.",
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (file: File, settings: GenerationSettings) => {
    generateMutation.mutate({ file, settings });
  };

  const handleHistoryOpen = () => {
    setHistoryOpen(true);
    refetchHistory();
  };

  const loadHistoryItem = (item: ProductAnalysis) => {
    setGeneratedContent({
      title: item.title,
      description: item.description,
      hashtags: item.hashtags,
      categories: item.categories,
    });
    setHistoryOpen(false);
    toast({
      title: "بارگذاری شد",
      description: "محتوا از تاریخچه بارگذاری شد.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/60 dark:bg-black/20 border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-safe">
          <div className="flex justify-between items-center min-h-[60px] sm:min-h-[80px] py-3 sm:py-4">
            <div className="flex items-center space-x-3 sm:space-x-6 space-x-reverse flex-1 min-w-0">
              <div className="flex-shrink-0 relative">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                  <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-xl sm:rounded-2xl animate-pulse"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white dark:border-black animate-pulse"></div>
              </div>
              <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                <h1 className="text-base sm:text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight truncate">
                  مولد محتوای هوشمند
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium truncate">
                  ✨ تولید محتوای حرفه‌ای با قدرت هوش مصنوعی
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-12 h-12 rounded-2xl glass-effect hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-600" />
                )}
              </Button>
              
              {/* History Button */}
              <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleHistoryOpen}
                    className="w-12 h-12 rounded-2xl glass-effect hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 relative"
                  >
                    <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>تاریخچه نتایج</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-4">
                      {history.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">تاریخچه‌ای یافت نشد</p>
                        </div>
                      ) : (
                        history.map((item) => (
                          <div
                            key={item.id}
                            className="bg-muted rounded-lg p-4 border cursor-pointer hover:bg-muted/80 transition-colors"
                            onClick={() => loadHistoryItem(item)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium truncate">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatPersianDate(new Date(item.createdAt))}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMutation.mutate(item.id);
                                }}
                                className="text-destructive hover:text-destructive/80"
                              >
                                حذف
                              </Button>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p className="truncate mb-2">{item.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {item.hashtags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {item.hashtags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{item.hashtags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Panel - Image Upload */}
          <div className="space-y-8">
            <div className="text-center lg:text-right space-y-4">
              <h2 className="text-4xl font-bold gradient-text">
                🚀 آپلود و تحلیل هوشمند
              </h2>
              <p className="text-lg text-muted-foreground">
                تصویر محصول خود را آپلود کنید و شاهد قدرت هوش مصنوعی باشید
              </p>
            </div>
            <ImageUpload
              onImageSelect={handleImageSelect}
              isGenerating={generateMutation.isPending}
            />
          </div>
          
          {/* Right Panel - Generated Content */}
          <div className="space-y-8">
            <div className="text-center lg:text-right space-y-4">
              <h2 className="text-4xl font-bold gradient-text">
                ✨ محتوای تولید شده
              </h2>
              <p className="text-lg text-muted-foreground">
                نتایج هوش مصنوعی برای محصول شما
              </p>
            </div>
            <GeneratedContent
              content={generatedContent}
              isLoading={generateMutation.isPending}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
