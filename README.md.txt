Indus Valley Digital Platform

A full-stack creative ecosystem connecting artists, audiences, and events, built with Next.js + Supabase.
This repository represents a working MVP with real authentication, database-driven content, and a scalable architecture ready for AI integration.

📌 Project Status

✅ Core MVP complete

🔧 Actively under development

🚀 Ready for feature expansion & AI integration

🎯 Vision

-------------------------------------------------------------------------------------------------------------------------------------

Indus Valley Digital aims to become a central digital hub for creative talent, enabling:

Artist discovery

Events & workshops

Live performances

Community engagement

Future AI-driven recommendations and insights

---------------------------------------------------------------

🧩 Tech Stack
Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

shadcn/ui

Lucide Icons

-------------------------------------------------------------

Backend / Infrastructure

Supabase

PostgreSQL database

Authentication

Row Level Security (RLS)

⚠️ No custom backend API layer yet — the frontend connects directly to Supabase via the JS client.

🗂️ High-Level Architecture
Next.js App (Client + Server Components)
        |
        |-- Supabase JS Client
        |
PostgreSQL (Supabase)

Architecture Principles

UI components are pure and strict

Database data is mapped at boundaries

Auth state is global and reactive

No mock data in production paths

-----------------------------------------------------------------------------

🔐 Authentication

Authentication is handled entirely by Supabase Auth.

Features

Login / Signup

Session persistence

Auth-aware header

Logout confirmation

Logged-in vs logged-out UI states

How it works

supabase.auth.getUser() on page load

onAuthStateChange keeps UI in sync

No manual isLoggedIn flags

🧭 Navigation & Header Behavior
Header Rules

Shows Log in / Join Now only when logged out

Shows Notifications, Profile, Logout when logged in

Logout asks for confirmation

No unused icons (global search removed)

-------------------------------------------------------------------------------------------

🏠 Landing Page (Home)

All landing sections are database-driven.

Sections

Hero

Value Proposition

Featured Artists (from DB)

Categories

Upcoming Events (from DB)

CTA

Featured Artists Logic

Pulled from artists table

Only verified = true

Limited to 4 for MVP

Upcoming Events Logic

Pulled from events table

Only future events (event_date > now)

Sorted by date

Limited to 3

----------------------------------------

🔍 Discover Artists
Features

Artist grid from database

Search by name / category / location

Filters (art forms, regions)

Responsive layout

Loading & empty states

Data Source

artists joined with profiles

-------------------------------------------------------------

📅 Events
Features

Database-driven event listing

Filtering by type (workshop, exhibition, live, etc.)

Shared event card UI

Used by landing page, events page, workshops, and live

🛠 Workshops

Workshops are a subset of events

Filtered using event_type = 'workshop'

No separate table required

----------------------------------------------------------

🔴 Live

Live streams & premieres

Uses event_type = 'live'

Ready for future streaming integration

🔔 Notifications (Placeholder)

Route: /notifications

UI stub in place

Backend logic to be implemented later

--------------------------------------------------------------------------

🧠 Database Schema (Core Tables)
1️⃣ profiles

Stores application user profiles (1–1 with auth.users)

Column	Type	Description
id	uuid	PK, references auth.users
full_name	text	Display name
username	text	Unique username
avatar_url	text	Profile image
role	text	user, artist, admin
created_at	timestamptz	Created timestamp

🔐 RLS:

Public read (basic info)

Users can update their own profile

2️⃣ artists

Artist-specific metadata

Column	Type	Description
id	uuid	FK → profiles.id
category	text	Primary art form
location	text	Artist location
verified	boolean	Featured / verified artist
created_at	timestamptz	Created timestamp

🔐 RLS:

Public read

Artist manages own data

3️⃣ events

Unified table for events, workshops, and live

Column	Type	Description
id	uuid	Primary key
title	text	Event title
description	text	Event details
event_type	text	workshop, concert, exhibition, live
event_date	timestamptz	Event date
location	text	Location
created_by	uuid	FK → profiles.id
created_at	timestamptz	Created timestamp

🔐 RLS:

Public read

Creator can update/delete own events

4️⃣ event_registrations
Column	Type	Description
id	uuid	Primary key
event_id	uuid	FK → events.id
user_id	uuid	FK → profiles.id
registered_at	timestamptz	Registration time

🔐 RLS:

Users can register themselves

Users can view their own registrations

------------------------------------------------------------------

🔐 Supabase Configuration
Required Environment Variables

Create a .env.local file:

NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public-anon-key>

How to Get Supabase Credentials

Supabase credentials must be requested from the organization dashboard:

👉 Supabase Org Dashboard
https://supabase.com/dashboard/org/msysmajnzesyonlwelpu

You will need:

Project URL

Public ANON key

⚠️ Never use the service role key in frontend code

🔒 Security & RLS Philosophy

Default deny

Public read where required

Authenticated writes only

RLS protects all sensitive data

Safe to use ANON key in frontend

🧠 Data Mapping Rule (Critical KT Rule)

UI components never consume raw DB rows.

Instead:

DB data → mapped into UI view models

Prevents runtime crashes

Keeps UI reusable and stable

Examples:

category → artForms[]

event_type → type

------------------------------------------------------------------------

🧑‍💻 Development & Deployment Guide
1️⃣ Clone Repository
git clone <repository-url>
cd indus-valley-digital

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables

Create .env.local and add Supabase credentials.

4️⃣ Run Development Server
npm run dev


App runs at:

http://localhost:3000

🗂️ Project Structure (Simplified)
app/
  ├─ page.tsx
  ├─ discover/
  ├─ events/
  ├─ workshops/
  ├─ live/
  ├─ notifications/

components/
  ├─ layout/
  ├─ landing/
  ├─ discover/
  ├─ events/
  ├─ ui/

lib/
  ├─ supabase/
  ├─ db/


  ----------------------------------------------

🧠 Knowledge Transfer Notes
For New Developers

Read database tables & RLS section

Study landing page DB integration

Understand data mapping before touching UI

Never modify UI components to fix DB shape

Always adapt data at the boundary




📄 License

Internal / Private (to be defined)