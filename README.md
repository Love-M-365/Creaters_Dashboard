# CreatorsMela Mobile Creator Suite (React Edition)

CreatorsMela is a premium, high-fidelity mobile creator dashboard designed to simulate a professional workflow for video, photo, and stream content creators. The application mimics a sleek, modern smartphone interface (like an iPhone mock shell) complete with hardware simulator items, dynamic island notch notifications, global status bar, and real-time interactive widgets.

Built with **React**, **Vite**, and styled with custom **Vanilla CSS** tokens, it features zero-dependency custom spline graphs, deliverables checklists, automated brand chat negotiators, detailed platform analytics, and a full-feed content manager.

---

## 🚀 Key Features

### 1. Interactive Spline-Graph Dashboard
* **Dynamic Metric Toggles**: Toggle between **Est. Earnings**, **Total Views**, and **Followers Count** history.
* **Custom SVG Splines**: Renders bezier curves dynamically based on state data with SVG clipping and gradients.
* **Interactive Tooltips**: Click on data markers on the chart path to display quick summaries through custom soft toast alerts.
* **Quick Actions Grid**: Direct routing buttons to take actions on different parts of the workspace.

### 2. Campaign & Collaborations Tracker
* **Invitations Drawer**: View details of sponsorships, read marketing briefs, and choose to decline or accept campaign contracts.
* **Active Milestones**: Progress bar updates dynamically based on the percentage of completed checklist deliverables.
* **Brand Negotiator Chatroom**: Communicate with simulated brand managers inside the campaign sheet. Sending messages triggers contextual replies from brand manager chatbots based on checklist progress.
* **Request Payout**: Campaigns completed to 100% display a release payout button, which deletes the campaign, increments earnings metrics, and posts a success alert.

### 3. Comprehensive Stats & Analytics
* **Platform Shares**: Flexible percentage meters visualising traffic breakdown by channels (YouTube, Instagram, TikTok).
* **Search & Sorting**: Filter top-performing content by platform and sort by highest views/likes.
* **Engagement Calculator**: Input views, likes, and comments to calculate the absolute engagement rate showing dynamic performance tier ratings.

### 4. Content Manager CRUD Feed
* **Searchable Feed**: Real-time filtering of content posts by search query.
* **Platform Tabs**: Filter posts by platform.
* **Add Post Modal**: Publish a new post by entering titles, initial views, and likes, updating views counts in the dashboard.
* **Content Edit & Delete**: Update titles/statistics or remove posts directly from the feed.

### 5. Hardware & Profile Sandbox
* **Haptic Toast System**: In-app custom popups for successes, notifications, and alert messages.
* **Clock Sync**: Simulated phone status bar synchronized with the local system time.
* **Profile Sync**: Instantly update avatar URLs and display names across the headers.
* **Simulation Triggers**: One-click triggers to inject simulated brand invitations or spike statistics counters instantly.
* **Notification Notch**: Animated dynamic island cutout that expands/collapses for brand offers.

---

## 📁 Directory Structure

```text
creater/
├── public/                 # Static assets
│   └── favicon.svg         # Tab favicon
├── src/
│   ├── components/         # Modular React Components
│   │   ├── DeviceFrame.jsx     # Device Mockup shell, Status Bar, and Header
│   │   ├── DynamicIsland.jsx   # Top camera notch notification popup drawer
│   │   ├── Navigation.jsx      # Bottom navbar with sliding glow highlight bubble
│   │   ├── DashboardScreen.jsx # Home screen, SVG graphs, and quick action cards
│   │   ├── CollabsScreen.jsx   # Invitations cards, Active list, checklists, and brand chat box
│   │   ├── AnalyticsScreen.jsx # Platform breakdowns, sorting tables, and engagement tool
│   │   ├── ContentScreen.jsx   # Add/Edit/Delete post feeds and search filters
│   │   └── SettingsScreen.jsx  # Edit profiles, sandbox simulators, and alert log filters
│   ├── context/
│   │   └── AppContext.jsx  # Context Provider containing all global logic and CRUD actions
│   ├── index.css           # Premium Vanilla CSS Design System and responsive grids
│   ├── App.jsx             # Entry view handling provider wrapper and screen routing
│   └── main.jsx            # React client environment mount point
├── index.html              # HTML shell containing fonts and Phosphor icons script imports
├── package.json            # Node project configuration and dependencies
└── vite.config.js          # Vite build tool configuration
```

---

## 🛠️ Tech Stack
* **Framework**: React 18
* **Build Tool**: Vite
* **Styling**: Vanilla CSS (Fluid variables, spring transforms, glassmorphism templates)
* **Icons**: Phosphor Icons (loaded via CDN script)
* **Fonts**: Google Fonts - Plus Jakarta Sans

---

## ⚙️ Installation & Run Script

To run the application locally, follow these simple commands:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Open the returned URL (typically `http://localhost:5173/` or `http://localhost:5174/`) in your browser to view the interactive mobile simulator.

3. **Build Production Bundle**:
   ```bash
   npm run build
   ```
   The compiled build will be generated in the `/dist` directory.
