# VividSpaces

🌐 **Live Demo:** [https://vividspaces-client.vercel.app](https://vividspaces-client.vercel.app)

## Overview

VividSpaces is a peer-to-peer marketplace for creative workspaces. Creators can discover and book photography studios, sound stages, podcast rooms, music suites and art workshops by the hour, while hosts can list their own spaces and manage incoming booking requests.

## Tech Stack

| Technology | Usage |
|---|---|
| Next.js 16 (App Router) | Framework |
| TypeScript | Language |
| Tailwind CSS v4 | Styling |
| shadcn/ui | UI components |
| Better Auth | Authentication (email and password, Google) |
| MongoDB | Database |
| Express | Backend API |
| React Toastify | Notifications |
| Swiper | Hero slider |
| Lucide React | Icons |
| next-themes | Dark and light theme |
| Google Fonts (Instrument Serif, Geist) | Typography |
| Vercel | Hosting |

## Key Features

1. **Explore Studios:** Browse every studio in one place. Search by name or location, filter by category, and sort by newest, top rated or price. Friendly empty states appear when nothing matches.
2. **Studio Details and Booking:** Each studio has its own page with specifications, amenities and host details. A booking modal lets a guest choose the date, hours and crew size, with the total price calculated for them.
3. **Authentication:** Sign up and sign in with email and password, or continue with Google. Passwords need an uppercase letter, a lowercase letter and at least 6 characters. Private pages redirect visitors who are not signed in, and a signed-in user stays signed in after a page reload.
4. **Studio Management:** Hosts can add a new studio, update it and delete it, with a confirmation modal before anything is removed. All of a host's listings live on the My Studio Listings page.
5. **Booking Management:** Every booking starts as *Pending*. Guests can cancel pending bookings from My Bookings. Hosts approve, decline or complete requests from the Dashboard. A request that overlaps a confirmed booking is rejected.

