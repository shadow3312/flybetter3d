# Flybetter 3d - Interactive Airplane Seat Reservation System

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14.0.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-0.158.0-green?style=for-the-badge&logo=three.js" alt="Three.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</div>

<div align="center">
  <h3>🛫 Experience the future of flight booking with immersive 3D seat selection</h3>
  <p>A cutting-edge web application that revolutionizes airline seat reservation through interactive 3D visualization, realistic cabin environments, and professional ticket generation.</p>
</div>

---

## 🌟 Features

### 🎮 Interactive 3D Experience
- **Immersive Cabin Visualization**: Explore realistic airplane interiors with detailed 3D models
- **Dual Navigation Modes**: 
  - **Hybrid Mode**: Orbit controls with keyboard movement
  - **First-Person Mode**: Walk through the cabin with mouse look controls
- **Real-time Seat Selection**: Click on seats to view details and make reservations
- **Dynamic Lighting**: Day, dim, and night cabin lighting modes

### ✈️ Comprehensive Aircraft System
- **Multiple Aircraft Types**: Boeing 737, Airbus A320, Boeing 787 Dreamliner
- **Realistic Seat Classes**: First Class, Business, and Economy with different pricing and amenities
- **Seat Color Coding**: Visual distinction between available, reserved, and selected seats
- **Class-based Amenities**: Different services and features for each seat class

### 👥 Realistic Environment
- **Animated Passengers**: NPCs with various activities (reading, sleeping, using devices)
- **Cabin Crew**: Interactive flight attendants with different animations and roles
- **Authentic Cabin Details**: Windows, overhead compartments, aisles, and section dividers
- **Dynamic Passenger Distribution**: Realistic seat occupancy patterns

### 🎫 Professional Ticket Generation
- **High-Quality PDF Tickets**: Downloadable boarding passes with professional design
- **Comprehensive Information**: Flight details, passenger info, seat specifications, and amenities
- **Visual Design Elements**: Gradient headers, QR codes, and airline-quality styling
- **Multiple Download Formats**: PDF and PNG image formats

### 🗄️ Structured Data Management
- **Relational Database Design**: Normalized data structure for scalability
- **JSON Data Sources**: Aircraft, flights, seat classes, and passenger information
- **Dynamic Seat Generation**: Algorithmic seat layout based on aircraft configuration
- **Realistic Pricing**: Class-based pricing with variation algorithms

## 🚀 Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with hooks and modern patterns
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library

### 3D Graphics
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers and abstractions

### Document Generation
- **jsPDF** - PDF generation library
- **html2canvas** - HTML to canvas conversion
- **Lucide React** - Modern icon library

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Autoprefixer** - CSS vendor prefixing

## 📦 Installation

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/shadow3312/flybetter-3d.git
   cd flybetter
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 🎯 Usage Guide

### Getting Started

1. **Aircraft Selection**
   - Browse available aircraft on the main page
   - Click on an airplane model to view details
   - Select "View Seating" to enter the 3D cabin

2. **Navigation Controls**
   - **Hybrid Mode (Default)**:
     - Mouse: Orbit around the cabin
     - WASD/Arrow Keys: Move horizontally
     - Q/E: Move up/down
     - Click: Select seats
   
   - **First-Person Mode**:
     - Click empty space: Enable mouse look (pointer lock)
     - Mouse: Look around in any direction
     - WASD/Arrow Keys: Walk through cabin
     - ESC: Exit mouse look mode

3. **Seat Selection**
   - Hover over seats to see details
   - Click available seats to open reservation modal
   - View seat class, price, and amenities
   - Complete passenger information form

4. **Ticket Generation**
   - After successful reservation, view your ticket
   - Download as PDF or PNG format
   - Ticket includes all flight and passenger details

### Controls Reference

| Action | Hybrid Mode | First-Person Mode |
|--------|-------------|-------------------|
| Look Around | Mouse drag | Mouse (when locked) |
| Move Forward | W / ↑ | W / ↑ |
| Move Backward | S / ↓ | S / ↓ |
| Move Left | A / ← | A / ← |
| Move Right | D / → | D / → |
| Move Up | Q | - |
| Move Down | E | - |
| Select Seat | Click | Click |
| Switch Mode | Button (top-right) | Button (top-right) |

## 📁 Project Structure

\`\`\`
airseat-3d/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── airplane-interior.tsx    # Main 3D cabin component
│   ├── airplane-model.tsx       # 3D airplane model
│   ├── airplane-selection.tsx   # Aircraft selection screen
│   ├── cabin-crew.tsx          # Crew member component
│   ├── cabin-crew-manager.tsx  # Crew management
│   ├── cabin-lighting.tsx      # Dynamic lighting system
│   ├── cabin-walls.tsx         # Cabin structure
│   ├── first-person-controls.tsx # FPS navigation
│   ├── flight-ticket.tsx       # Ticket display component
│   ├── hybrid-controls.tsx     # Hybrid navigation
│   ├── lighting-controls.tsx   # Lighting UI controls
│   ├── passenger-manager.tsx   # Passenger system
│   ├── passenger-npc.tsx       # Individual passenger
│   ├── reservation-modal.tsx   # Booking modal
│   ├── seat-grid.tsx          # Seat layout system
│   └── seat-model.tsx         # Individual seat component
├── hooks/                       # Custom React hooks
│   └── use-keyboard-controls.ts # Keyboard input handling
├── lib/                        # Utilities and services
│   ├── db/                     # JSON data files
│   │   ├── aircraft.json       # Aircraft specifications
│   │   ├── flights.json        # Flight information
│   │   └── seat-classes.json   # Seat class definitions
│   ├── data-service.ts         # Data access layer
│   ├── ticket-generator.ts     # PDF/image generation
│   ├── types.ts               # TypeScript definitions
│   └── utils.ts               # Utility functions
├── public/                     # Static assets
│   └── assets/
│       └── 3d/                # 3D models and textures
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
\`\`\`

## 🎨 Customization

### Adding New Aircraft

1. **Add aircraft data** to `lib/db/aircraft.json`:
   \`\`\`json
   {
     "id": "new-aircraft",
     "name": "New Aircraft",
     "model": "Model Name",
     "manufacturer": "Manufacturer",
     "totalSeats": 200,
     "rows": 33,
     "seatsPerRow": 6,
     "aisleAfter": 3,
     "cabinWidth": 3.5,
     "cabinLength": 25,
     "windowRows": 10
   }
   \`\`\`

2. **Add corresponding flight** in `lib/db/flights.json`

3. **Update aircraft selection** component if needed

### Modifying Seat Classes

Edit `lib/db/seat-classes.json` to adjust:
- Pricing structure
- Amenities offered
- Visual styling (colors)
- Seat dimensions

### Customizing 3D Models

- Replace models in `public/assets/3d/`
- Update model references in components
- Adjust scaling and positioning as needed

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for environment-specific settings:

\`\`\`env
# API Configuration (if using external APIs)
NEXT_PUBLIC_API_URL=your_api_url
API_SECRET_KEY=your_secret_key

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_DEBUG_MODE=false
\`\`\`


## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. **Deploy** automatically on push

### Other Platforms

- **Netlify**: Configure for Next.js static export
- **AWS**: Use AWS Amplify or EC2
- **Docker**: Use provided Dockerfile

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit your changes**
   \`\`\`bash
   git commit -m 'Add amazing feature'
   \`\`\`
6. **Push to your branch**
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful component and variable names
- Add JSDoc comments for complex functions
- Ensure responsive design
- Test on multiple browsers
- Optimize for performance

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Use semantic HTML elements
- Implement accessibility best practices

## 📋 Roadmap

### Upcoming Features

- [ ] **Real-time Seat Updates**: WebSocket integration for live seat availability
- [ ] **Payment Integration**: Stripe/PayPal payment processing
- [ ] **User Accounts**: Registration, login, and booking history
- [ ] **Mobile App**: React Native version
- [ ] **VR Support**: WebXR integration for VR headsets
- [ ] **Multi-language**: Internationalization support
- [ ] **Accessibility**: Enhanced screen reader support
- [ ] **Analytics**: User behavior tracking and insights

### Performance Improvements

- [ ] **Code Splitting**: Lazy loading for better performance
- [ ] **Image Optimization**: WebP format and responsive images
- [ ] **Caching**: Redis integration for data caching
- [ ] **CDN**: Asset delivery optimization

## 🐛 Known Issues

- **Safari**: Some 3D rendering issues on older Safari versions
- **Mobile**: Touch controls need refinement for mobile devices
- **Performance**: Large aircraft models may impact performance on low-end devices


<div align="center">
  <p>Made with ❤️ by the AirSeat 3D Team</p>
  <p>
    <a href="https://github.com/shadow3312/flybetter">⭐ Star on GitHub</a> |
    <a href="https://twitter.com/shuruzer">🐦 Follow on Twitter</a> |
    <a href="https://flybetter.vercel.app">🌐 Visit Website</a>
  </p>
</div>
