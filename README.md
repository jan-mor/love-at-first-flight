# 💌 Love at First Flight

Love at First Flight started as a simple Valentine's Day project—a way to send heartfelt messages to loved ones across the world. In building it, it became something more: a tribute to how technology brings us closer.

The internet doesn't just connect us; it makes possible the relationships we might never have had. It allows friendships to persist across continents, love to thrive across time zones, and bonds to stretch beyond what once seemed possible.

This project is a reflection on that wonder. It’s about messages blinking through networks, racing beneath the ocean on fiber-optic threads. It’s about paper airplanes. It’s about love in motion.

## ✈️ Features

- **Interactive Map**: Built using the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/), leveraging an [ArcGIS Developer Account](https://developers.arcgis.com/) for basemap access.
- **Custom Markers**: Messages are represented as paper airplane icons that change color when hovered over.
- **Geolocation-Based Messaging**: Users can send letters linked to an encoded geographic location.
- **Supabase Integration**: Messages are stored in a **PostgreSQL** database, managed via [Supabase](https://supabase.com/).
- **Privacy-Conscious Encoding**: Locations are obfuscated slightly to preserve some level of privacy.

## 📍 How It Works

### Mapping & Basemap
The project uses [ArcGIS](https://developers.arcgis.com/javascript/latest/) for rendering an interactive map. The basemap is the [Modern Antique Map](https://www.arcgis.com/apps/mapviewer/index.html?webmap=f35ef07c9ed24020aadd65c8a65d3754), which is fetched through an **ArcGIS Developer Account**. 

- The **basemap** is a vector tile layer, meaning it loads smoothly at different zoom levels and supports rich styling.
- The map is constrained to prevent panning outside predefined geographical bounds, ensuring the experience remains focused.

#### **Basemap URL**
The **Modern Antique** basemap is sourced from: https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/layers/arcgis/modern-antique

This layer provides a vintage aesthetic while maintaining modern map functionality.

### Adding Markers
When a user submits a letter, a **marker** (styled as a **paper airplane icon**) is added to the recipient's approximate location. The icons have two states:

- **Default:** Standard paper plane icon.
- **Hover:** Turns pink to indicate interactivity.

**How Markers Are Added:**
1. The recipient’s location is decoded and slightly adjusted to avoid exact pinpointing.
2. A **Graphic** object is created using ArcGIS’s `PictureMarkerSymbol`, linked to the recipient’s location.
3. The marker is added to the **ArcGIS MapView**, updating in real-time.

### Letter Visualization
Clicking on a marker opens a **modal** displaying messages associated with that location.

- If **only one letter** exists at a location, it is displayed immediately.
- If **multiple letters** exist, users can **scroll and select** individual messages.

Messages are stored with **timestamps** and formatted to show **date and time**.

## 🔐 Privacy & Data Handling

- **Location Obfuscation**: Location coordinates are obtained through the browser and are rounded to three decimal places to slightly obfuscate location.
- **Public Messages**: All messages are stored indefinitely and are publicly visible.
- **No Encryption**: While locations are encoded, they are not encrypted. Users should assume that locations can be derived if necessary.

**Note:** Messages **cannot be deleted** once sent.

## 📌 Future Improvements

- **Pin Optimization**: Efficiently handle a high number of markers to prevent performance slowdowns.
- **Animations & Transitions**: Enhance UI/UX with smooth animations when messages appear.
- **Improved React State Management**: Refactor state handling for better scalability.
- **Replies & Conversations**: Allow users to reply to messages.
- **Heatmaps & Data Views**: Introduce visualization tools to explore message distribution across different regions.
- **Support for Other Time Zones**: Allow users to view timestamps in their preferred / local time zone

## 🛠️ Technologies Used

- **Frontend:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Mapping:** [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/)
- **Database:** [Supabase (PostgreSQL)](https://supabase.com/)
- **Hosting:** [Vercel](https://vercel.com/)

