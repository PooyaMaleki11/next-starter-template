export const formatPersianDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

export const downloadAsJSON = (data: any, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const downloadAsHTML = (data: { title: string; description: string; hashtags: string[]; categories: string[] }, filename: string) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        body { font-family: Tahoma, Arial, sans-serif; padding: 20px; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; }
        .section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .hashtag { display: inline-block; background: #e3f2fd; color: #1976d2; padding: 4px 8px; margin: 2px; border-radius: 4px; }
        .category { background: #f5f5f5; padding: 8px; margin: 4px 0; border-radius: 4px; }
        h1, h2 { color: #333; }
    </style>
</head>
<body>
    <div class="container">
        <div class="section">
            <h1>عنوان محصول</h1>
            <p>${data.title}</p>
        </div>
        
        <div class="section">
            <h2>توضیحات محصول</h2>
            <p>${data.description}</p>
        </div>
        
        <div class="section">
            <h2>هشتگ‌ها</h2>
            <div>
                ${data.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2>دسته‌بندی‌ها</h2>
            <div>
                ${data.categories.map(cat => `<div class="category">${cat}</div>`).join('')}
            </div>
        </div>
    </div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'فرمت فایل مجاز نیست. فقط JPG، PNG و WebP پذیرفته می‌شود.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'حجم فایل نباید بیشتر از 5 مگابایت باشد.' };
  }
  
  return { valid: true };
};

export const getImagePreviewUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('خطا در خواندن فایل'));
      }
    };
    reader.onerror = () => reject(new Error('خطا در خواندن فایل'));
    reader.readAsDataURL(file);
  });
};
