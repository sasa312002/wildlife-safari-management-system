# Wildlife Safari Chatbot

## Overview
The Wildlife Safari Chatbot is a floating chat widget that provides instant assistance to visitors on the Mufasa Wildlife website. It offers information about safari packages, locations, team members, and helps users navigate through the website.

## Features

### 🎯 Core Functionality
- **Floating Chat Button**: Always visible in the bottom-right corner
- **Real-time Chat Interface**: Interactive conversation with the AI assistant
- **Website Information**: Provides details about services, locations, and team
- **Navigation Assistance**: Quick buttons to navigate to key pages
- **Responsive Design**: Works on desktop and mobile devices

### 💬 Chat Capabilities
The chatbot can answer questions about:
- **Services**: Safari tours, hiking, photography, bird watching, adventure packages
- **Locations**: Yala, Udawalawe, Wilpattu, Minneriya National Parks, Sinharaja Forest
- **Team**: Information about wildlife experts and guides
- **Contact**: Phone numbers, email addresses, office locations
- **Pricing & Booking**: Guidance on packages and booking process
- **Safety**: Information about safety protocols and records
- **Donations**: Wildlife conservation support
- **Gallery**: Photo galleries and wildlife photography

### 🎨 Design Features
- **Wildlife Theme**: Lion emoji avatar and green color scheme
- **Typing Animation**: Realistic typing indicators
- **Message Timestamps**: Shows when messages were sent
- **Quick Action Buttons**: Direct navigation to key pages
- **Smooth Animations**: Hover effects and transitions

## Technical Implementation

### Components
- **Chatbot.jsx**: Main chatbot component with chat logic
- **App.jsx**: Global integration across all pages
- **App.css**: Styling and animations

### Key Features
- **State Management**: React hooks for chat state
- **Message History**: Persistent conversation during session
- **Auto-scroll**: Messages automatically scroll to bottom
- **Keyboard Support**: Enter key to send messages
- **Responsive Layout**: Adapts to different screen sizes

### Integration
The chatbot is integrated globally in the App component, making it available on all pages:
- Homepage
- Travel Packages
- Contact Us
- About Us
- Donation pages
- User account pages
- Admin dashboard

## Usage

### For Visitors
1. **Open Chat**: Click the floating chat button (🦁) in the bottom-right corner
2. **Ask Questions**: Type your questions about wildlife safaris, services, or locations
3. **Quick Navigation**: Use the quick action buttons to visit specific pages
4. **Close Chat**: Click the X button to minimize the chat window

### Example Conversations
```
Visitor: "What services do you offer?"
Bot: "We offer various wildlife experiences:
• Wildlife Safari Tours
• Hiking Adventures
• Photography Tours
• Bird Watching
• Custom Adventure Packages"

Visitor: "Where are your locations?"
Bot: "We operate in several amazing locations:
• Yala National Park
• Udawalawe National Park
• Wilpattu National Park
• Minneriya National Park
• Sinharaja Forest Reserve"
```

## Customization

### Adding New Responses
To add new chatbot responses, modify the `generateBotResponse` function in `Chatbot.jsx`:

```javascript
if (message.includes('your-keyword')) {
  return "Your custom response here";
}
```

### Updating Website Information
Modify the `websiteInfo` object in `Chatbot.jsx` to update:
- Company name and description
- Services offered
- Locations
- Contact information
- Team members

### Styling
Customize the appearance by modifying:
- Colors in the CSS classes
- Chat window dimensions
- Button styles and animations
- Typography and spacing

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Performance
- Lightweight implementation
- No external API dependencies
- Fast response times
- Minimal impact on page load

## Future Enhancements
- Integration with real customer service
- Multi-language support
- Voice chat capabilities
- Advanced AI responses
- Chat history persistence
- File sharing capabilities

