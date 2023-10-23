import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'primary-50': '#D7DBF8',
        'primary-100': '#C3C8F4',
        'primary-200': '#AFB6F1',
        'primary-300': '#8692E9',
        'primary-400': '#5E6DE2',
        'primary-500': '#3649DB',
        'primary-600': '#2B3AAF',
        'primary-700': '#202C83',
        'primary-800': '#161D58',
        'primary-900': '#101642',
        'primary-950': '#0B0F2C',

        'secondary-50': '#6972D7',
        'secondary-100': '#5C65C6',
        'secondary-200': '#5058B5',
        'secondary-300': '#363E93',
        'secondary-400': '#1D2471',
        'secondary-500': '#040A4F',
        'secondary-600': '#03083F',
        'secondary-700': '#02062F',
        'secondary-800': '#020420',
        'secondary-900': '#010318',
        'secondary-950': '#010210',

        'tertiary-50': '#E4EFFA',
        'tertiary-100': '#D6E6F7',
        'tertiary-200': '#C8DEF5',
        'tertiary-300': '#ADCEEF',
        'tertiary-400': '#91BDEA',
        'tertiary-500': '#76ADE5',
        'tertiary-600': '#608FC0',
        'tertiary-700': '#4A729B',
        'tertiary-800': '#345475',
        'tertiary-900': '#294563',
        'tertiary-950': '#1E3750'
      }
    },
  },
  plugins: [],
}
export default config
