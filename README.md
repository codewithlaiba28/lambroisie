# L'Ambroisie — Haute Gastronomie Française
### Awwwards-Level Cinematic Restaurant Landing Page

A luxury, editorial-grade fine dining landing page converted from the Stitch design system into a production Vite + React application. Features interactive cinematic scroll animations powered by GSAP, ScrollTrigger, Lenis smooth scrolling, SplitType, and an HTML5 canvas image sequence extracted from 4K/HD video.

---

## 🌟 Features & Animations

1. **Global Smooth Scroll & Synced Timelines**:
   - **Lenis Smooth Scroll** synchronized with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker`.
   - **Dynamic Navbar**: Transparent over the hero, transitions into a frosted glass wine-burgundy blur (`backdrop-blur-md`, `#2a0a0c/85`) upon scrolling.
   - **Magnetic Button Hover**: Interactive buttons subtly attract toward the cursor on hover with elastic release.
   - **Custom Dual-Ring Cursor**: Outer lagging halo and inner pinpoint dot that scales up over interactive elements.
   - **Prefers-Reduced-Motion**: Complete accessible fallback disabling scrubs and pin locks for users with motion sensitivity.

2. **1. Hero Section (Pinned ~400vh)**:
   - High-performance `<canvas>` rendering of 192 extracted video frames (`walk.mp4`) with aspect-ratio cover fit.
   - Loading progress bar with real-time asset preloading.
   - Scroll progress dynamically scrubs the camera walk from the restaurant entrance directly to the table close-up.
   - Headline *"Authentic French dining since 1988."* fades and slides in at ~60% progress.
   - At ~85%, swaps in the italic serif line *"Riservato."* with a blur-to-sharp fade transition (`filter: blur(16px) -> blur(0px)`).
   - "Reserve a Table" and "View Menu" magnetic CTA buttons glide in last.

3. **2. Menu Section (Pinned 50/50 Split)**:
   - Left full-height photography with `clip-path` wipe and subtle scale (`1.08 -> 1.0`) on category transitions.
   - Right warm cream panel (*"Explore Our Menu"*) slides in from the right at pin start and exits at the end.
   - 4 scroll steps: *Les Entrées*, *Les Plats de Résistance*, *Les Fromages Affinés*, *Les Desserts & Nectars*. Active step switches to italic serif with 100% opacity; inactive steps dim to 40%.

4. **3. Story Section (Pinned Word Illumination)**:
   - Background culinary photography slowly scaling `1.15 -> 1.0`.
   - Editorial uppercase statement split into words via **SplitType**: each word illuminates from `opacity: 0.15` to `1.0` as the user scrolls.
   - Accent words (*"authentic flavors"* and *"warm service."*) vertically slide in with smooth masking.

5. **4. Private Dining (Expanding Morph Card)**:
   - Set against a warm cream backdrop (`#ffdada`).
   - Image card expands from a compact rounded inset card to large viewport card using `clip-path: inset(...)`.
   - Background morphs into deep burgundy (`#2a0a0c`) while the image softly dims.
   - Content seamlessly cross-fades into the *"Salon Saint-Honoré (Up to 25 guests)"* VIP configuration with sommelier accords and salmon CTA.

6. **5. Reviews Section (3D Wall & Animated Counter)**:
   - Accolade counter automatically animates `0 -> 1,134` with 5 stars upon entering the viewport.
   - 3D Review Wall rendered in CSS 3D (`perspective: 1200px`, `transform: rotateY(-18deg) rotateX(8deg)`).
   - 3 independent card columns moving at different speeds in opposite directions tied to scroll scrub.
   - Left edge soft vignette mask with linear gradient (`mask-image: linear-gradient(to right, transparent, black 15%, black)`).

7. **6. Footer CTA**:
   - Night Parisian cobblestone window view scaling `1.2 -> 1.0`.
   - Line-by-line masked reveal of *"See you on Rue Saint-Honoré."*
   - Salmon "Book a Table" magnetic button fade-up.
   - Comprehensive footer information with service hours, phone, and address details.

---

## 📁 Project Structure

```text
e:/webstie/
├── public/
│   ├── frames/                  # 192 extracted desktop frames (1600x900, q:v 4)
│   │   ├── frame_0001.jpg
│   │   └── ...
│   ├── frames-mobile/           # 64 optimized mobile frames (800x450, 8fps)
│   │   ├── frame_0001.jpg
│   │   └── ...
│   └── images/                  # Stitch high-res screens and photography
│       ├── screen1_full.png     # Interior twilight (Stitch Screen 1)
│       ├── screen2_plated_dish.png # Michelin plated dish (Stitch Screen 2)
│       ├── screen3_chef_kitchen.png# Ambient kitchen pass (Stitch Screen 3)
│       ├── screen4_night_window.png# Night Parisian street window (Stitch Screen 4)
│       ├── menu_entree.jpg      # Mushroom velouté entrée
│       ├── menu_cheese.jpg      # Artisan cheese board
│       └── menu_dessert.jpg     # Grand Marnier soufflé
├── src/
│   ├── components/
│   │   ├── CustomCursor.jsx     # Dual-ring lagging cursor with difference blend
│   │   ├── Navbar.jsx           # Sticky nav with transparent-to-blur scroll
│   │   ├── Preloader.jsx        # Luxury loader with progress bar
│   │   ├── HeroSection.jsx      # Canvas scrub timeline & text swapping
│   │   ├── MenuSection.jsx      # 50/50 pinned layout with clip-path wipe
│   │   ├── StorySection.jsx     # Word-by-word SplitType illumination
│   │   ├── PrivateDiningSection.jsx # Expanding card & burgundy morph
│   │   ├── ReviewsSection.jsx   # 3D review wall with counter
│   │   └── FooterCtaSection.jsx # Night window scrub & masked headline
│   ├── hooks/
│   │   └── useMagnetic.js       # Reusable magnetic button hover hook
│   ├── App.jsx                  # Main application orchestrator & Lenis sync
│   ├── index.css                # Tailwind imports & 3D perspective styles
│   └── main.jsx                 # React root mounting
├── index.html                   # HTML template with Bodoni Moda & Inter fonts
├── tailwind.config.js           # Exact color tokens from Stitch template
├── vite.config.js               # Vite config
├── walk.mp4                     # Source walkthrough video
└── package.json                 # Project dependencies & scripts
```

---

## 🛠️ How to Customize

### 1. Replacing Hero Frames
To replace the video sequence with a new video:
1. Place your new video file in the project root (e.g., `new_walk.mp4`).
2. Run ffmpeg (using the installed `ffmpeg-static`):
   ```bash
   node -e "
   const { execSync } = require('child_process');
   const ffmpeg = require('ffmpeg-static');
   execSync(\`\"\${ffmpeg}\" -i new_walk.mp4 -vf \"scale=1600:-2,fps=24\" -q:v 4 public/frames/frame_%04d.jpg\`);
   execSync(\`\"\${ffmpeg}\" -i new_walk.mp4 -vf \"scale=800:-2,fps=8\" -q:v 5 public/frames-mobile/frame_%04d.jpg\`);
   "
   ```
3. Update `frameCount` in `src/components/HeroSection.jsx` to match the number of output frames.

### 2. Replacing Images
- **Plated dish / Signature plate**: Replace `public/images/screen2_plated_dish.png`.
- **Story background**: Replace `public/images/screen3_chef_kitchen.png`.
- **Private Dining image**: Replace `public/images/screen1_full.png`.
- **Footer night street**: Replace `public/images/screen4_night_window.png`.
- **Menu categories**: Replace `menu_entree.jpg`, `menu_cheese.jpg`, or `menu_dessert.jpg` in `public/images/`.

### 3. Replacing Text & Menu Content
- **Restaurant Name & Nav**: Update `src/components/Navbar.jsx`.
- **Hero Headlines & Subtitles**: Edit `src/components/HeroSection.jsx`.
- **Menu Items & Pricing**: Edit `menuCategories` array in `src/components/MenuSection.jsx`.
- **Story Statement**: Update the text in `src/components/StorySection.jsx`.
- **Private Dining Suites**: Edit guest capacity, description, and amenities in `src/components/PrivateDiningSection.jsx`.
- **Critiques & Accolades**: Modify review cards in `src/components/ReviewsSection.jsx`.
- **Address & Service Times**: Edit `src/components/FooterCtaSection.jsx`.

---

## 🚀 Running the Project

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
The site is hosted locally at `http://localhost:5173/`.
