# Government Recruitment Portal - Frontend

A modern, responsive Government Recruitment & Examination Management Portal built with React.js and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5174/
```

## 📱 Application Structure

### **3 Main Portals:**

1. **🏛️ Public Website** (`/`)
   - Homepage with job listings
   - Smart eligibility filter
   - Public job search and information

2. **👨‍💼 Admin Panel** (`/admin/*`)
   - Gray/white professional theme
   - Dashboard, projects, payment settings
   - User and role management

3. **👤 Candidate Portal** (`/candidate/*`)
   - Blue user-friendly theme
   - Profile, applications, documents
   - Payment and result tracking

## 🔐 Authentication

- **Login**: `/auth/login`
- **Demo Mode**: Any email/password works
- **User Types**: Select Admin or Candidate during login
- **Auto-routing**: Redirects to appropriate portal after login

## 🎨 Color Schemes

- **Admin**: Gray/white with orange (#D97706) accents
- **Candidate**: Blue theme (#2563EB) for user-friendliness
- **Public**: Clean government-style design

## 🧭 Development Navigation

- **Dev Menu**: Purple button in bottom-right corner (development only)
- **Quick Access**: All screens organized by category
- **Easy Testing**: Navigate between all portals and pages

## 📄 Available Pages

### Public Pages
- Home, About, Jobs, Results, Notices, Admit Cards, Downloads, FAQ, Contact

### Admin Pages
- Dashboard, Projects, Jobs, Applications, Analytics, Support, Employees, Roles, Payment Settings

### Candidate Pages
- Dashboard, Profile, Jobs, Applications, Documents, Payments, Admit Card, Results, Support, Notifications

### Auth Pages
- Login, Register, Forgot Password, Reset Password, OTP Verification

## 🛠️ Tech Stack

- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **Lucide React** for icons
- **React Hook Form** + Zod for forms
- **React Hot Toast** for notifications
- **Framer Motion** for animations

## 📁 Project Structure

```
src/
├── app/                    # Page components
│   ├── public/            # Public website pages
│   ├── admin/             # Admin panel pages
│   ├── candidate/         # Candidate portal pages
│   └── auth/              # Authentication pages
├── components/            # Reusable components
│   ├── ui/                # Basic UI components
│   ├── layouts/           # Layout components
│   └── common/            # Shared components
├── routes/                # Routing configuration
├── lib/                   # Utilities and helpers
├── constants/             # App constants
└── styles/                # Global styles
```

## 🔧 Development Features

- **Hot Module Replacement** for fast development
- **Lazy Loading** for better performance
- **Code Splitting** by routes
- **Development Navigation** for easy testing
- **Responsive Design** for all screen sizes

## 🎯 Key Features

- **Multi-portal Architecture** with separate layouts
- **Role-based Navigation** with different themes
- **Responsive Design** for mobile, tablet, desktop
- **Modern UI Components** with consistent styling
- **Easy Development** with dev navigation menu
- **Production Ready** architecture

## 📝 Notes

- All components are placeholder-ready for backend integration
- Color schemes are consistent across each portal
- Navigation is fully functional between all sections
- Development menu only shows in development mode
- All routes are accessible for frontend development

---

**🚀 Ready for Development!** 
Visit `http://localhost:5174/` and click the purple "Dev Menu" button to explore all screens.