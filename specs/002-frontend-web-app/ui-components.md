# UI Components Specification: Responsive Frontend Web Application

## Component Hierarchy

### Layout Components
- **AppLayout**
  - Header
    - Logo/Brand
    - Navigation Links
    - User Profile Dropdown (with Logout)
  - Main Content Area
  - Footer (optional)

- **AuthLayout** (for login/signup pages)
  - Centered Auth Card
  - Branding Section
  - Social Login Options

### Authentication Components
- **LoginForm**
  - Email Input Field
  - Password Input Field
  - Submit Button
  - Forgot Password Link
  - Sign Up Link

- **SignupForm**
  - Name Input Field
  - Email Input Field
  - Password Input Field
  - Confirm Password Field
  - Submit Button
  - Login Link

- **SocialAuthButtons**
  - Google Login Button
  - GitHub Login Button
  - Other providers as needed

### Task Management Components
- **TaskList**
  - Header with Add Task Button
  - Filter/Sort Controls
  - Task Items Container
  - Empty State Message
  - Loading Spinner

- **TaskCard**
  - Checkbox for Completion Status
  - Task Title
  - Task Description
  - Due Date (if applicable)
  - Priority Indicator
  - Action Buttons (Edit, Delete)

- **TaskFormModal**
  - Title Input Field
  - Description Textarea
  - Priority Selector
  - Due Date Picker
  - Save/Cancel Buttons

- **TaskDetailModal**
  - Task Title
  - Task Description
  - Status Information
  - Action Buttons (Edit, Delete)

### Navigation Components
- **MobileMenu**
  - Collapsible Menu Items
  - User Profile Section
  - Logout Button

- **DesktopSidebar**
  - Navigation Links
  - User Profile Section
  - Settings Link

### Utility Components
- **LoadingSpinner**
  - Animated loading indicator
  - Accessible loading message

- **ErrorMessage**
  - Error icon
  - Error message text
  - Dismiss button (optional)

- **ConfirmationDialog**
  - Confirmation message
  - Confirm/Cancel buttons

## Responsive Behavior

### Mobile (up to 768px)
- Single column layout
- Bottom navigation bar
- Stacked form elements
- Touch-friendly button sizes (minimum 44px)
- Hamburger menu for navigation

### Tablet (768px - 1024px)
- Adaptive grid layout
- Side navigation (optional)
- Medium-sized touch targets
- Partially collapsible sidebars

### Desktop (1024px+)
- Multi-column layout
- Permanent sidebar navigation
- Hover states for interactive elements
- Larger content areas
- Keyboard navigation support

## Color Palette
- Primary: Blue or Indigo (for accents and CTAs)
- Secondary: Gray (for backgrounds and borders)
- Success: Green (for positive actions)
- Danger: Red (for deletions and errors)
- Warning: Yellow/Orange (for warnings)

## Typography
- Primary Font: System font stack or Inter/Roboto
- Heading Sizes: Responsive scale (H1-H6)
- Body Text: 16px base size
- Line Height: 1.5 for readability
- Letter Spacing: Normal for body, slightly increased for headings

## Interactive States
- Default: Standard appearance
- Hover: Subtle color change or shadow
- Active: Pressed state for buttons
- Focus: Visible outline for keyboard navigation
- Disabled: Reduced opacity, no pointer events

## Animation Guidelines
- Quick transitions (150-300ms)
- Ease-in-out timing function
- Subtle hover effects
- Loading animations that provide feedback
- Page transitions that feel smooth but not distracting