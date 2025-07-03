import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, Search, ArrowRight, Sparkles, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        {/* 404 Number with Glass Effect */}
        <div className="relative mb-8">
          <div className="text-9xl font-black bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent relative">
            404
            <div className="absolute inset-0 text-9xl font-black bg-gradient-to-br from-blue-300/30 via-purple-300/30 to-indigo-300/30 bg-clip-text text-transparent blur-sm"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="w-8 h-8 text-amber-500 floating-animation" />
          </div>
        </div>

        {/* Main Content Card */}
        <div className="premium-card border-0 rounded-3xl p-12 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5"></div>
          <div className="relative z-10 space-y-6">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center floating-animation">
                <Search className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="absolute inset-0 w-24 h-24 border-2 border-dashed border-blue-500/30 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
            </div>

            <h1 className="text-4xl font-bold gradient-text mb-4">
              🔍 صفحه پیدا نشد!
            </h1>
            
            <p className="text-xl text-muted-foreground mb-2">
              متأسفانه صفحه‌ای که دنبالش می‌گردید وجود ندارد
            </p>
            
            <p className="text-lg text-muted-foreground/80 mb-8">
              شاید آدرس اشتباه وارد شده یا صفحه منتقل شده باشد
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-medium px-8 py-4 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Home className="w-5 h-5 ml-2" />
                  بازگشت به خانه
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </Link>

              <Button 
                variant="ghost" 
                size="lg"
                onClick={() => window.history.back()}
                className="rounded-2xl font-medium px-8 py-4 glass-effect hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
              >
                <ArrowRight className="w-5 h-5 ml-2 rotate-180" />
                صفحه قبل
              </Button>
            </div>

            {/* Fun Elements */}
            <div className="flex items-center justify-center space-x-6 space-x-reverse mt-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>خطا</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>جستجو</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
                <span>بازگشت</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center text-muted-foreground/60">
          <p className="text-sm">
            اگر فکر می‌کنید این یک خطاست، لطفاً دوباره تلاش کنید
          </p>
        </div>
      </div>
    </div>
  );
}
