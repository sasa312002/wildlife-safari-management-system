# EmailJS Auto-Reply Template Setup Guide

## 🚀 Setting Up Auto-Reply Email Template

### Step 1: Create Auto-Reply Template in EmailJS

1. **Go to EmailJS Dashboard** → **Email Templates**
2. **Click "Create New Template"**
3. **Use this Auto-Reply Template Code**:

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{subject}}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Wildlife Safari</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Conservation & Protection</p>
    </div>
    
    <!-- Main Content -->
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Greeting -->
        <h2 style="color: #2c3e50; margin-top: 0;">Dear {{to_name}},</h2>
        
        <!-- Main Message -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <p style="font-size: 16px; margin: 0; line-height: 1.6;">
                {{message}}
            </p>
        </div>
        
        <!-- Donation Details (if applicable) -->
        {{#if donation_amount}}
        <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0; font-size: 18px;">Donation Details</h3>
            <p style="margin: 5px 0; font-size: 14px;">
                <strong>Amount:</strong> {{donation_amount}}
            </p>
            <p style="margin: 5px 0; font-size: 14px;">
                <strong>Date:</strong> {{donation_date}}
            </p>
        </div>
        {{/if}}
        
        <!-- Contact Information -->
        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
            <h3 style="color: #2c3e50; margin-top: 0; font-size: 18px;">Contact Information</h3>
            <p style="margin: 5px 0; font-size: 14px;">
                <strong>Email:</strong> admin@wildlifesafari.com
            </p>
            <p style="margin: 5px 0; font-size: 14px;">
                <strong>Phone:</strong> +94 11 234 5678
            </p>
            <p style="margin: 5px 0; font-size: 14px;">
                <strong>Website:</strong> www.wildlifesafari.com
            </p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong>{{from_name}}</strong><br>
                Wildlife Safari Team
            </p>
        </div>
        
        <!-- Disclaimer -->
        <div style="text-align: center; margin-top: 20px;">
            <p style="color: #95a5a6; font-size: 12px; margin: 0;">
                This is an automated response. Please do not reply to this email directly.<br>
                For inquiries, contact us at admin@wildlifesafari.com
            </p>
        </div>
    </div>
    
</body>
</html>
```

### Step 2: Configure Template Variables

Make sure your template includes these variables:
- `{{to_name}}` - Recipient's name
- `{{subject}}` - Email subject
- `{{message}}` - Main message content
- `{{donation_amount}}` - Donation amount (optional)
- `{{donation_date}}` - Donation date (optional)
- `{{from_name}}` - Sender name
- `{{reply_to}}` - Reply-to email address

### Step 3: EmailJS Service Configuration

1. **Set up your email service** (Gmail, Outlook, etc.)
2. **Configure auto-reply settings**:
   - **From Email**: Your admin email
   - **Reply-To**: admin@wildlifesafari.com
   - **Subject**: Dynamic based on admin input

### Step 4: Update Your Configuration

In `frontend/src/services/emailService.js`, make sure you have:

```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_ode3gbj', // Your EmailJS service ID
  TEMPLATE_ID: 'template_plpixif', // Your EmailJS template ID
  PUBLIC_KEY: '4ENbi-NRXw2QGnMz2', // Your EmailJS public key
};
```

## 🔧 How Auto-Reply Works

### When Admin Sends Email:

1. **Admin clicks "Send Email"** on donation card
2. **Email modal opens** with pre-filled content
3. **Admin can customize** subject and message
4. **EmailJS automatically sends** the email to donor
5. **Donor receives** professional auto-reply email
6. **Donor can reply** to admin@wildlifesafari.com

### Email Flow:

```
Admin → EmailJS → Donor
Donor → admin@wildlifesafari.com (for replies)
```

## 📧 Template Features

### ✅ What's Included:

1. **Professional Header** with Wildlife Safari branding
2. **Personalized Greeting** with donor's name
3. **Main Message Area** for admin's custom content
4. **Donation Details** (if applicable)
5. **Contact Information** for follow-up
6. **Professional Footer** with sender details
7. **Auto-reply Disclaimer**

### 🎨 Design Features:

- **Responsive design** for all devices
- **Professional color scheme**
- **Clean typography**
- **Visual hierarchy**
- **Brand consistency**

## 🚀 Testing Your Auto-Reply

1. **Start your application**: `npm start`
2. **Go to Admin Panel** → **Donations**
3. **Click "Test EmailJS"** to verify configuration
4. **Send a test email** to a real email address
5. **Check if auto-reply** is working correctly

## 🔄 Automation Benefits

### ✅ Automatic Features:

1. **Instant Delivery** - Emails sent immediately
2. **Professional Formatting** - Consistent branding
3. **Personalization** - Uses donor's actual name
4. **Contact Information** - Easy follow-up
5. **Donation Context** - Includes relevant details

### 📈 Efficiency Gains:

- **No manual email composition** needed
- **Consistent messaging** across all donors
- **Professional appearance** every time
- **Time-saving** for admin staff
- **Better donor experience**

## 🎯 Next Steps

1. **Test the template** with real donations
2. **Customize the design** if needed
3. **Monitor email delivery** and responses
4. **Update contact information** as needed
5. **Consider email tracking** for analytics

---

**Your auto-reply email system is now ready!** 🚀

When admins send emails, donors will automatically receive professional, personalized responses with all the necessary information and contact details.
