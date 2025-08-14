# Sri Lankan Wildlife Safari Management System

A modern, immersive wildlife safari management system for Sri Lanka, built with React and Tailwind CSS.

## Features

- **Responsive Design**: Mobile-first approach with beautiful responsive layouts
- **Modern UI**: Clean, professional design with smooth animations
- **Full-Screen Hero Section**: Immersive background with compelling call-to-action
- **Navigation**: Fixed header with smooth scrolling navigation
- **Login System**: Ready for authentication integration
- **Sri Lankan Focus**: Authentic local wildlife experiences and national parks

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd wildlife-safari-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Adding Your Background Image

To add your custom background image to the home page:

1. **Place your image** in the `src/assets` folder (e.g., `src/assets/hero-background.jpg`)

2. **Update the Home component** (`src/components/Home.jsx`):
   ```jsx
   // Import your image at the top:
   import heroImage from '../assets/hero-background.jpg';
   
   // Use it in the background:
   <div 
     className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
     style={{ backgroundImage: `url(${heroImage})` }}
   >
   ```

3. **Recommended image specifications**:
   - **Format**: JPG, PNG, or WebP
   - **Resolution**: 1920x1080 or higher
   - **File size**: Optimize for web (under 2MB)
   - **Content**: Sri Lankan wildlife, national parks, or nature imagery

## Project Structure

```
src/
├── components/
│   ├── Header.jsx      # Navigation header with logo and login
│   ├── Home.jsx        # Hero section with full-screen background
│   └── SafariPackages.jsx  # Sri Lankan wildlife tour packages
├── assets/
│   └── elephants-national-park-sri-lanka.jpg  # Background image
├── App.jsx             # Main application component
├── App.css             # Global styles and animations
└── index.css           # Tailwind CSS imports
```

## Customization

### Colors
The design uses a nature-inspired color palette:
- **Primary Green**: `#16a34a` (green-600)
- **Light Green**: `#4ade80` (green-400)
- **Dark Background**: `#1f2937` (gray-800)
- **White Text**: `#ffffff`
- **Gray Text**: `#d1d5db` (gray-300)

### Typography
- **Headlines**: Bold, large fonts for impact
- **Body Text**: Clean, readable sans-serif
- **Logo**: Elegant serif font for brand identity
- **Font Family**: ABeeZee for a friendly, approachable feel

## Sri Lankan Wildlife Tours

The system features authentic Sri Lankan wildlife experiences:

1. **Yala National Park Safari** - Leopards, elephants, and diverse bird species
2. **Minneriya Elephant Gathering** - Spectacular wild elephant gatherings
3. **Sinharaja Rainforest Trek** - UNESCO World Heritage rainforest exploration
4. **Wilpattu Leopard Safari** - Sri Lanka's largest national park

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 19** - Modern React with latest features
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite** - Fast build tool and development server

## Next Steps

This is a foundation for your Sri Lankan wildlife safari management system. Consider adding:

1. **Authentication System** - User login/registration
2. **Booking System** - Tour reservations and payments
3. **Photo Gallery** - Wildlife photography showcase
4. **Interactive Maps** - Sri Lankan national park locations
5. **Admin Dashboard** - Management interface
6. **Responsive Mobile Menu** - Hamburger menu for mobile devices
7. **Local Language Support** - Sinhala and Tamil translations
8. **Weather Integration** - Best times to visit different parks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
