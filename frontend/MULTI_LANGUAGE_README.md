# Multi-Language System for Wildlife Safari Management System

This document explains how to use and extend the multi-language system implemented in the Wildlife Safari Management System.

## Overview

The system supports three languages:
- **English (en)** - Default language
- **Sinhala (si)** - සිංහල
- **Tamil (ta)** - தமிழ்

## Architecture

### 1. Language Context (`src/context/LanguageContext.jsx`)

The main context that manages:
- Current language state
- Language switching functionality
- Translation loading
- Translation function (`t`)

### 2. Translation Files (`src/translations/`)

- `en.js` - English translations
- `si.js` - Sinhala translations  
- `ta.js` - Tamil translations

### 3. Language Switcher Component (`src/components/LanguageSwitcher.jsx`)

A dropdown component that allows users to switch between languages.

### 4. Translation Utilities (`src/utils/translationUtils.js`)

Helper functions for translating database content and common fields.

## Usage

### Basic Translation

```jsx
import { useLanguage } from '../context/LanguageContext';

const MyComponent = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('home.welcome')}</h1>
      <p>{t('home.description')}</p>
    </div>
  );
};
```

### Database Content Translation

```jsx
import { useDatabaseTranslation } from '../utils/translationUtils';

const MyComponent = () => {
  const { translateDB, t } = useDatabaseTranslation();
  
  // Translate database content
  const translatedName = translateDB(package.name);
  const translatedDescription = translateDB(package.description);
  
  return (
    <div>
      <h2>{translatedName}</h2>
      <p>{translatedDescription}</p>
      <span>{t('packages.price')}: ${package.price}</span>
    </div>
  );
};
```

### Translating Arrays

```jsx
import { translateArray } from '../utils/translationUtils';

const MyComponent = ({ packages }) => {
  const { currentLanguage } = useLanguage();
  
  // Translate all packages
  const translatedPackages = translateArray(packages, currentLanguage);
  
  return (
    <div>
      {translatedPackages.map(pkg => (
        <div key={pkg.id}>
          <h3>{pkg.name}</h3>
          <p>{pkg.description}</p>
        </div>
      ))}
    </div>
  );
};
```

### Status and Role Translation

```jsx
import { translateStatus, translateRole } from '../utils/translationUtils';

const MyComponent = ({ user }) => {
  const { currentLanguage } = useLanguage();
  
  return (
    <div>
      <p>Status: {translateStatus(user.status, currentLanguage)}</p>
      <p>Role: {translateRole(user.role, currentLanguage)}</p>
    </div>
  );
};
```

## Adding New Translations

### 1. Add Translation Keys

Add new keys to all three translation files:

**English (`en.js`):**
```javascript
export default {
  // ... existing translations
  'newSection.title': 'New Section Title',
  'newSection.description': 'Description of the new section',
  'newSection.button': 'Click Here'
};
```

**Sinhala (`si.js`):**
```javascript
export default {
  // ... existing translations
  'newSection.title': 'නව කොටසේ මාතෘකාව',
  'newSection.description': 'නව කොටසේ විස්තරය',
  'newSection.button': 'මෙහි ක්ලික් කරන්න'
};
```

**Tamil (`ta.js`):**
```javascript
export default {
  // ... existing translations
  'newSection.title': 'புதிய பிரிவின் தலைப்பு',
  'newSection.description': 'புதிய பிரிவின் விளக்கம்',
  'newSection.button': 'இங்கே கிளிக் செய்யவும்'
};
```

### 2. Use in Components

```jsx
const NewComponent = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.description')}</p>
      <button>{t('newSection.button')}</button>
    </div>
  );
};
```

## Database Content Translation

### Supported Patterns

The system automatically detects and translates database content with these patterns:

1. **Language-specific fields:**
```javascript
{
  name: {
    en: "English Name",
    si: "සිංහල නම",
    ta: "தமிழ் பெயர்"
  }
}
```

2. **Suffix pattern:**
```javascript
{
  name_en: "English Name",
  name_si: "සිංහල නම",
  name_ta: "தமிழ் பெயர்"
}
```

3. **Prefix pattern:**
```javascript
{
  en_name: "English Name",
  si_name: "සිංහල නම",
  ta_name: "தமிழ் பெயர்"
}
```

4. **Translations object:**
```javascript
{
  name: "Default Name",
  translations: {
    en: "English Name",
    si: "සිංහල නම",
    ta: "தமிழ் பெயர்"
  }
}
```

5. **Localized object:**
```javascript
{
  name: "Default Name",
  localized: {
    en: "English Name",
    si: "සිංහල නම",
    ta: "தமிழ் பெயர்"
  }
}
```

### Example Usage

```jsx
const PackageCard = ({ package }) => {
  const { translateDB } = useDatabaseTranslation();
  
  return (
    <div>
      <h3>{translateDB(package.name)}</h3>
      <p>{translateDB(package.description)}</p>
      <ul>
        {package.included.map((item, index) => (
          <li key={index}>{translateDB(item)}</li>
        ))}
      </ul>
    </div>
  );
};
```

## Language Persistence

The selected language is automatically saved to `localStorage` and restored on page reload.

## Adding New Languages

To add a new language (e.g., French):

1. **Create translation file:**
```javascript
// src/translations/fr.js
export default {
  'nav.home': 'Accueil',
  'nav.about': 'À propos',
  // ... add all translations
};
```

2. **Update LanguageSwitcher:**
```jsx
// src/components/LanguageSwitcher.jsx
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' } // Add new language
];
```

3. **Update translation utilities:**
```javascript
// src/utils/translationUtils.js
export const translateStatus = (status, language) => {
  const statusTranslations = {
    en: { /* English */ },
    si: { /* Sinhala */ },
    ta: { /* Tamil */ },
    fr: { /* French */ } // Add new language
  };
  // ... rest of the function
};
```

## Best Practices

1. **Use descriptive keys:** Use hierarchical keys like `section.subsection.field`
2. **Keep translations consistent:** Use the same key structure across all languages
3. **Handle missing translations:** Always provide fallbacks for missing translations
4. **Test all languages:** Ensure all languages display correctly
5. **Use translation utilities:** Leverage the provided utilities for database content

## Troubleshooting

### Common Issues

1. **Translation not loading:**
   - Check if the translation key exists in all language files
   - Verify the key path is correct

2. **Database content not translating:**
   - Ensure the data structure matches supported patterns
   - Use `translateDB()` function for database content

3. **Language not persisting:**
   - Check browser localStorage support
   - Verify the language code is valid

### Debug Mode

Enable debug logging by adding this to your component:

```jsx
const { currentLanguage, translations } = useLanguage();
console.log('Current language:', currentLanguage);
console.log('Available translations:', translations);
```

## Performance Considerations

- Translations are loaded dynamically based on selected language
- Database content translation happens on-demand
- Language switching is optimized with React state management
- Translations are cached in localStorage for faster switching

## Future Enhancements

- Server-side language detection based on user location
- Automatic translation using AI services
- Language-specific date/time formatting
- RTL language support for languages like Arabic
- Language-specific number formatting
