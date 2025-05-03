// Theme colors and typography settings
const theme = {
  colors: {
    primary: 'var(--primary-blue)',
    secondary: 'var(--secondary-seafoam)',
    darkBackground: 'var(--primary-dark)',
    darkBackground2: 'var(--primary-dark-2)',
    lightBackground: 'var(--background)',
    accent: 'var(--accent-orange)',
    text: 'var(--black)',
    lightText: 'var(--neutral)',
    white: 'var(--white)',
    gray: 'var(--gray)',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    border: '#E5E7EB',
  },
  typography: {
    fontFamily: 'var(--font-family)',
    heading: {
      fontWeight: 700,
    },
    body: {
      fontWeight: 400,
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',  // Circle/Pill
  },
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  breakpoints: {
    sm: '600px',
    md: '900px',
    lg: '1200px',
    xl: '1536px',
  },
  containers: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  fontFamily: 'var(--font-family)',
  navHeight: 'var(--nav-height)',
};

export default theme; 