import { useEffect, useState } from "react";
import { Sparkles, Zap, Star } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { text: "راه‌اندازی هوش مصنوعی", icon: "🤖" },
    { text: "بارگذاری رابط کاربری", icon: "🎨" },
    { text: "آماده‌سازی پردازشگر", icon: "⚡" },
    { text: "تکمیل نصب", icon: "✨" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 800);
          return 100;
        }
        
        const newProgress = prev + Math.random() * 15 + 5;
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        return Math.min(newProgress, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse liquid-animation"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse liquid-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse liquid-animation" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto px-6">
        {/* Logo and Brand */}
        <div className="mb-12">
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-3xl rotate-45 pulse-glow"></div>
            <div className="absolute inset-4 w-24 h-24 bg-white dark:bg-black rounded-2xl rotate-45 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-blue-600 dark:text-blue-400 -rotate-45 floating-animation" />
            </div>
            
            {/* Floating particles */}
            <div className="absolute -top-4 -right-2 floating-animation">
              <Star className="w-6 h-6 text-amber-500" style={{ animationDelay: '1s' }} />
            </div>
            <div className="absolute -bottom-2 -left-4 floating-animation">
              <Zap className="w-5 h-5 text-purple-500" style={{ animationDelay: '2s' }} />
            </div>
            <div className="absolute top-2 -left-6 floating-animation">
              <Sparkles className="w-4 h-4 text-green-500" style={{ animationDelay: '3s' }} />
            </div>
          </div>

          <h1 className="text-4xl font-black gradient-text-advanced mb-4">
            مولد محتوای هوشمند
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            قدرت هوش مصنوعی در خدمت کسب‌وکار شما
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-8">
          {/* Current Step Display */}
          <div className="premium-card border-0 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5"></div>
            <div className="relative z-10 flex items-center justify-center space-x-4 space-x-reverse">
              <div className="text-4xl animate-pulse">
                {steps[currentStep]?.icon}
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold gradient-text">
                  {steps[currentStep]?.text}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {Math.round(progress)}% تکمیل شده
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="w-full bg-white/20 dark:bg-black/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-full transition-all duration-500 ease-out shimmer-enhanced"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Step Indicators */}
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center space-y-2 transition-all duration-300 ${
                    index <= currentStep ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 pulse-glow' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                  <span className="text-xs text-muted-foreground">{step.icon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Loading Text */}
          <div className="flex items-center justify-center space-x-3 space-x-reverse">
            <div className="flex space-x-1 space-x-reverse">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-muted-foreground font-medium">
              در حال بارگذاری...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}