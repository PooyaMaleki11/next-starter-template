# Persian Product Content Generator

## Overview

This is a Persian-language web application that generates marketing content from product images using Google's Gemini AI. Users can upload product images and receive AI-generated titles, descriptions, hashtags, and categories optimized for various platforms like Instagram and online stores.

## System Architecture

### Full-Stack Architecture
- **Frontend**: React with TypeScript, using Vite for development
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (configured but using in-memory storage currently)
- **AI Integration**: Google Gemini API for image analysis and content generation
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Routing**: Wouter for client-side routing

### Technology Stack
- **Language**: TypeScript (ESM modules)
- **Frontend**: React 18, Vite, Tailwind CSS, Radix UI components
- **Backend**: Express.js, Multer for file uploads
- **Database**: Drizzle ORM with PostgreSQL dialect (Neon Database)
- **AI/ML**: Google Gemini API
- **Build Tools**: esbuild for server bundling, Vite for client bundling

## Key Components

### Frontend Components
1. **ProductGenerator**: Main page component handling the complete workflow
2. **ImageUpload**: Handles image selection, validation, and upload settings
3. **GeneratedContent**: Displays AI-generated content with copy and export features
4. **ThemeProvider**: Dark/light theme management
5. **UI Components**: Complete shadcn/ui component library with Persian RTL support

### Backend Services
1. **Gemini Service**: Integrates with Google Gemini API for image analysis
2. **Storage Service**: In-memory storage implementation (with interface for future database integration)
3. **File Upload**: Multer configuration for image processing (5MB limit, image files only)
4. **API Routes**: RESTful endpoints for content generation and history management

### Database Schema
- **product_analyses**: Stores generated content with metadata
  - Image data (base64), title, description, hashtags, categories
  - Generation settings and timestamps
  - JSONB fields for flexible data storage

## Data Flow

1. **Image Upload**: User selects image file and generation settings
2. **Validation**: Client-side validation for file type and size
3. **API Request**: FormData sent to `/api/generate-content` endpoint
4. **AI Processing**: Image sent to Gemini API with Persian prompts
5. **Content Generation**: AI returns structured Persian content
6. **Storage**: Results stored in memory (configured for PostgreSQL)
7. **Response**: Generated content displayed with export options

### Content Generation Settings
- **Description Length**: Short (50-100 words), Medium (100-200 words), Long (200-300 words)
- **Target Platforms**: Store, Instagram, or both
- **Language**: All content generated in Persian with RTL support

## External Dependencies

### Core Dependencies
- **@google/genai**: Google Gemini AI integration
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Database ORM and query builder
- **@radix-ui/***: Accessible UI component primitives
- **@tanstack/react-query**: Server state management
- **multer**: File upload handling

### Development Tools
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **tsx**: TypeScript execution for development
- **tailwindcss**: Utility-first CSS framework

## Deployment Strategy

### Build Process
1. **Client Build**: Vite builds React app to `dist/public`
2. **Server Build**: esbuild bundles Express server to `dist/index.js`
3. **Static Assets**: Frontend served from `/dist/public`

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **GEMINI_API_KEY**: Google Gemini API key
- **NODE_ENV**: Environment mode (development/production)

### Production Setup
- Express server serves both API and static files
- Database migrations via `drizzle-kit push`
- Error handling with status codes and JSON responses

## Persian Localization

### RTL Support
- Complete right-to-left layout using `dir="rtl"`
- Persian font integration (Vazirmatn)
- Culturally appropriate UI patterns

### Content Features
- Persian date formatting
- Persian number formatting
- Persian-specific validation messages
- AI prompts optimized for Persian content generation

## User Preferences

Preferred communication style: Simple, everyday language.

## Design Philosophy

The application follows a premium "million-dollar website" aesthetic with:
- Apple-like glassmorphism effects throughout
- Advanced CSS animations and micro-interactions
- Gradient backgrounds and smooth transitions
- Professional typography with gradient text effects
- Premium loading states and sophisticated visual feedback

## User Experience Features

### Enhanced Platform Support
- Original: فروشگاه آنلاین، اینستاگرام
- Added: تلگرام، واتساپ، مارکت‌پلیس، وب‌سایت
- Each platform has unique color coding and icons

### Advanced Animations
- Multi-layer loading spinners with pulse effects
- Floating animations with rotation and brightness changes
- Success bounce animations with spring physics
- Breathing animations for interactive elements
- Shimmer effects for premium feel
- Liquid morphing borders and gradient shifts

### Premium Visual Design
- Glass morphism cards with backdrop blur
- Gradient text with animated color shifts
- Sophisticated hover effects with scale and shadow
- Pulse glow effects for emphasis
- Professional 404 error page with animated elements

## Changelog

Changelog:
- July 02, 2025. Initial setup with basic functionality
- July 02, 2025. Major UI/UX redesign with premium aesthetics
  - Enhanced glassmorphism design throughout
  - Added 4 new target platforms (Telegram, WhatsApp, Marketplace, Website)
  - Implemented advanced CSS animations and micro-interactions
  - Created premium 404 error page
  - Enhanced loading states with multi-layer animations
  - Fixed FormData handling for image uploads
  - Added sophisticated hover effects and transitions