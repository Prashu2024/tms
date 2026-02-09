# Task Management System (TMS)

A full-stack Task Management System built with Next.js, TypeScript, Tailwind CSS, Prisma ORM, and SQLite. This application supports multiple users, role-based access control, project management, and task tracking with a clean, responsive UI.

## Live Demo

**Deployed Application:** https://tms-a0y2.onrender.com

**GitHub Repository:** https://github.com/Prashu2024/tms

**Default Admin Account:**
- Email: admin@example.com
- Password: admin123

*Note: A default admin user is automatically created when you seed the database. New registrations are always created as Member users for security.*

## Features

### Authentication & User Management
- Secure user signup and login using NextAuth.js with credentials provider
- Password hashing with bcryptjs for security
- Role-based access control (Admin and Member roles)
- Session-based authentication with JWT
- Protected routes using Next.js middleware

### Project Management
- Create, edit, and delete projects
- Assign multiple members to projects
- Project statuses: Active, On Hold, Completed
- View project progress with task completion statistics
- Only project owners or admins can modify/delete projects

### Task Management
- Create, update, and delete tasks within projects
- Assign tasks to specific users
- Task fields: Title, Description, Priority (Low/Medium/High), Status (Todo/In Progress/Done), Due Date
- Filter tasks by project, status, priority, and assigned user
- Sort tasks by priority and due date
- Permission-based editing (creators, assignees, project owners, and admins)

### Dashboard
- Overview statistics: Total Projects, Total Tasks, Tasks Assigned to You
- Tasks by Status breakdown (Todo, In Progress, Done)
- Tasks by Priority breakdown (High, Medium, Low)
- Recent Tasks list
- Upcoming Deadlines section
- Project progress visualization

### UX/UI
- Fully responsive design for mobile, tablet, and desktop
- Clean, modern interface with Tailwind CSS
- Loading states and error handling
- Empty states for better user experience
- Subtle animations using GSAP (fade-ins, slide-ins, stagger effects)
- Consistent spacing and typography

## Tech Stack

### Frontend
- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **GSAP** for animations
- **NextAuth.js** for authentication

### Backend
- **Next.js API Routes** for REST API
- **NextAuth.js** for authentication
- **Zod** for input validation

### Database
- **SQLite** as the relational database
- **Prisma ORM** for database operations
- Proper schema design with relations (Users, Projects, Tasks, ProjectMembers)

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type checking

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts       # NextAuth configuration
│   │   │   └── register/
│   │   │       └── route.ts       # User registration API
│   │   ├── dashboard/
│   │   │   └── route.ts           # Dashboard statistics API
│   │   ├── projects/
│   │   │   ├── route.ts           # Projects CRUD API
│   │   │   └── [id]/
│   │   │       └── route.ts       # Individual project API
│   │   ├── tasks/
│   │   │   ├── route.ts           # Tasks CRUD API
│   │   │   └── [id]/
│   │   │       └── route.ts       # Individual task API
│   │   └── users/
│   │       └── route.ts           # Users list API
│   ├── dashboard/
│   │   ├── layout.tsx             # Dashboard layout with navigation
│   │   └── page.tsx               # Dashboard page
│   ├── login/
│   │   └── page.tsx               # Login page
│   ├── projects/
│   │   └── page.tsx               # Projects list page
│   ├── register/
│   │   └── page.tsx               # Registration page
│   ├── tasks/
│   │   └── page.tsx               # Tasks list page
│   ├── globals.css
│   ├── layout.tsx                 # Root layout with SessionProvider
│   └── page.tsx                   # Root page (redirects to login/dashboard)
├── components/
│   ├── Animations.tsx             # GSAP animation components
│   └── Navigation.tsx             # Navigation component
├── lib/
│   └── prisma.ts                  # Prisma client singleton
├── middleware.ts                  # Route protection middleware
└── types/
    └── next-auth.d.ts             # NextAuth type extensions

prisma/
├── schema.prisma                  # Database schema
├── migrations/                    # Database migrations
└── dev.db                         # SQLite database file
```

## Database Schema

### Entities and Relations

1. **User**
   - id, email, name, password, role (ADMIN/MEMBER)
   - Relations: ownedProjects, projects (memberships), assignedTasks, createdTasks

2. **Project**
   - id, name, description, status (ACTIVE/ON_HOLD/COMPLETED)
   - Relations: owner (User), members (ProjectMember), tasks

3. **ProjectMember**
   - Junction table for project-user relationships
   - Relations: project, user

4. **Task**
   - id, title, description, priority (LOW/MEDIUM/HIGH), status (TODO/IN_PROGRESS/DONE), dueDate
   - Relations: project, createdBy (User), assignedTo (User)

## Setup Instructions

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prashu2024/tms
   cd task-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database and seed automatically**
   ```bash
   npm run postinstall
   ```
   This command:
   - Generates Prisma client
   - Creates the SQLite database if it doesn't exist
   - Runs database migrations
   - Seeds the default admin user automatically on first app startup

   **Default Admin Account:**
   - Email: admin@example.com
   - Password: admin123

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Deployment on Render

This application is configured for automatic deployment on Render with database creation and seeding.

#### Prerequisites
- GitHub repository with your code
- Render account (free tier available)

#### Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` configuration

#### Automatic Setup Process

Render will automatically:
1. **Install dependencies** using `npm install`
2. **Create database** using `prisma db push` (runs in `postinstall` script)
3. **Build application** using `npm run build`
4. **Seed database** automatically on first startup (creates admin user)
5. **Start server** using `npm start`

#### Environment Variables on Render
The following environment variables are automatically configured:
- `DATABASE_URL`: Set to `file:./dev.db` for SQLite
- `NODE_ENV`: Set to `production`
- `NEXTAUTH_SECRET`: Auto-generated secure secret
- `NEXTAUTH_URL`: Set to your Render deployment URL automatically

#### Important Notes for SQLite on Render
- Database file is stored in the deployment container
- **Data persistence**: Data is preserved across restarts but lost on redeploy
- For production use with persistent data, consider switching to PostgreSQL

#### Manual Database Seeding (if needed)
If automatic seeding doesn't work, you can manually seed:
```bash
# Connect to your Render service via SSH
npm run seed
```

#### Access Your Deployed App
- Your app will be available at `https://your-app-name.onrender.com`
- Login with the default admin account: `admin@example.com` / `admin123`

### Alternative Deployment (Vercel/Other Platforms)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set up environment variables**
   In your hosting platform, set:
   - `DATABASE_URL` - Path to your SQLite database
   - `NEXTAUTH_SECRET` - A secure random string
   - `NEXTAUTH_URL` - Your production domain URL

3. **Manual database setup**
   ```bash
   npx prisma db push
   npm run seed
   ```

## Authentication Flow

1. **Registration** (`/register`)
   - User submits name, email, and password
   - Password is hashed with bcrypt (10 salt rounds)
   - User is created with MEMBER role (all new registrations are members for security)
   - On success, redirected to login page
   - **Note:** Admin accounts can only be created via database seeding

2. **Login** (`/login`)
   - User submits email and password
   - NextAuth credentials provider validates credentials
   - JWT token is created with user id, email, name, and role
   - Session is established
   - On success, redirected to dashboard

3. **Protected Routes**
   - Middleware checks for valid session
   - Unauthorized users are redirected to login
   - Role-based access control implemented in API routes

## Task & Project Flow

### Creating a Project
1. User clicks "Create Project" button
2. Modal opens with form (name, description, status, members)
3. On submit, POST request to `/api/projects`
4. API validates data with Zod
5. Project is created with owner set to current user
6. Selected members are added to ProjectMember table
7. UI updates to show new project

### Creating a Task
1. User clicks "Create Task" button (requires at least one project)
2. Modal opens with form (title, description, project, priority, status, assignee, due date)
3. On submit, POST request to `/api/tasks`
4. API validates data and creates task
5. Task appears in the task list

### Permission System
- **Projects**: Only owners and admins can edit/delete
- **Tasks**: Creators, assignees, project owners, and admins can edit
- **Admins**: Have full access to all resources

## API Structure

All API routes follow RESTful conventions:

### Projects
- `GET /api/projects` - List all accessible projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects/[id]` - Update a project
- `DELETE /api/projects/[id]` - Delete a project

### Tasks
- `GET /api/tasks` - List tasks (with query filters)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Users
- `GET /api/users` - List all users (for member selection)

## UI Component Strategy

1. **Pages** (`src/app/*/page.tsx`)
   - Client-side components for interactivity
   - Use React hooks for state management
   - Fetch data from API routes
   - Handle loading and error states

2. **Reusable Components** (`src/components/`)
   - `Navigation.tsx` - Top navigation bar
   - `Animations.tsx` - GSAP animation wrappers

3. **Styling Approach**
   - Tailwind CSS utility classes
   - Responsive design with sm:, md:, lg: prefixes
   - Consistent color palette (indigo as primary)
   - Cards, modals, and forms with consistent styling
