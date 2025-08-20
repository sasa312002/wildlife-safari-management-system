# Email Setup Guide for Wildlife Safari Admin Panel

## 🚀 Complete Email Setup Instructions

### Step 1: Sign Up for EmailJS (Free Service)

1. **Go to EmailJS**: Visit [https://www.emailjs.com/](https://www.emailjs.com/)
2. **Create Account**: Sign up for a free account
3. **Verify Email**: Confirm your email address

### Step 2: Configure Email Service

1. **Add Email Service**:
   - Go to EmailJS Dashboard
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Connect your email account
   - **Save the Service ID** (you'll need this)

2. **Create Email Template**:
   - Go to "Email Templates" section
   - Click "Create New Template"
   - Use this template code:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Thank You for Your Donation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Wildlife Safari</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Conservation & Protection</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #2c3e50; margin-top: 0;">Dear {{to_name}},</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you so much for your generous donation of <strong>{{donation_amount}}</strong> to our wildlife conservation efforts.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <h3 style="color: #27ae60; margin-top: 0;">Your contribution will help us:</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Protect endangered wildlife species</li>
                <li>Maintain and preserve natural habitats</li>
                <li>Support our conservation programs</li>
                <li>Educate communities about wildlife protection</li>
            </ul>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
            We are truly grateful for your support in helping us make a difference in wildlife conservation.
        </p>
        
        <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #7f8c8d;">
                <strong>Donation Details:</strong><br>
                Amount: {{donation_amount}}<br>
                Date: {{donation_date}}
            </p>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 30px;">
            Best regards,<br>
            <strong>The Wildlife Safari Team</strong>
        </p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #7f8c8d; font-size: 12px; margin: 0;">
                Thank you for supporting wildlife conservation efforts.
            </p>
        </div>
    </div>
    
</body>
</html>
```

3. **Save Template**:
   - Give it a name like "Donation Thank You Email"
   - **Save the Template ID** (you'll need this)

### Step 3: Get Your Public Key

1. **Go to Account Settings** in EmailJS
2. **Copy your Public Key** (you'll need this)

### Step 4: Update Configuration

1. **Open the file**: `frontend/src/services/emailService.js`
2. **Replace the placeholder values**:

```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'YOUR_ACTUAL_SERVICE_ID', // Replace with your EmailJS service ID
  TEMPLATE_ID: 'YOUR_ACTUAL_TEMPLATE_ID', // Replace with your EmailJS template ID
  PUBLIC_KEY: 'YOUR_ACTUAL_PUBLIC_KEY', // Replace with your EmailJS public key
};
```

### Step 5: Test the Configuration

1. **Start your application**:
   ```bash
   npm start
   ```

2. **Go to Admin Panel** → **Donations tab**

3. **Click "Test EmailJS" button** to verify configuration

4. **Check the console** for any error messages

### Step 6: Send Your First Email

1. **Find a donation** in the admin panel
2. **Click "Send Email"** on any donation card
3. **Choose "Send Thank You"** or "Send Custom Email"
4. **The email will be sent to the donor's email address**

## 🔧 Troubleshooting

### Common Issues:

1. **"Service ID not found"**:
   - Double-check your Service ID in EmailJS dashboard
   - Make sure the service is active

2. **"Template ID not found"**:
   - Verify your Template ID in EmailJS dashboard
   - Ensure the template is published

3. **"Public Key invalid"**:
   - Check your Public Key in EmailJS account settings
   - Make sure you copied it correctly

4. **"Email not sending"**:
   - Check browser console for error messages
   - Verify your email service connection in EmailJS
   - Ensure your email provider allows API access

### EmailJS Limits (Free Plan):
- **200 emails per month**
- **2 email templates**
- **1 email service**

## 📧 Email Features

### What the system can do:

1. **Automatic Thank You Emails**:
   - Personalized with donor name
   - Includes donation amount and date
   - Professional wildlife conservation messaging

2. **Custom Emails**:
   - Admin can write personalized messages
   - Custom subject lines
   - Full message customization

3. **Email Tracking**:
   - Success/failure notifications
   - Error handling and user feedback

## 🎯 Next Steps

1. **Test thoroughly** with a few sample emails
2. **Monitor email delivery** in your email provider
3. **Check spam folders** if emails don't arrive
4. **Consider upgrading** to EmailJS paid plan for more emails

## 📞 Support

If you encounter issues:
1. Check EmailJS documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
2. Verify your configuration in the EmailJS dashboard
3. Check browser console for error messages
4. Test with the "Test EmailJS" button in the admin panel

---

**Your email system is now ready to send actual emails to donors!** 🚀
