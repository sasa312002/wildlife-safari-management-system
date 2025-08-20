# EmailJS Troubleshooting Guide

## 🚨 "One or more dynamic variables are corrupted" Error

This error occurs when the EmailJS template expects different variable names than what we're sending.

## 🔧 **Solution Steps:**

### **Step 1: Use the Simple Template**

1. **Go to EmailJS Dashboard** → **Email Templates**
2. **Edit your template** (ID: `template_q3qwprk`)
3. **Replace with the simple template** from `EMAILJS_SIMPLE_TEMPLATE.html`
4. **Save the template**

### **Step 2: Test with Debug Function**

1. **Go to Admin Panel** → **Donations**
2. **Click "Debug EmailJS"** button
3. **Check console output** to see which parameters work
4. **Look for ✅ SUCCESS** messages

### **Step 3: Check Your EmailJS Template Variables**

Your template should only use these basic variables:
- `{{to_name}}` - Donor's name
- `{{message}}` - Email message content

**DO NOT USE** these variables in your template:
- `{{to_email}}` ❌
- `{{subject}}` ❌
- `{{donation_amount}}` ❌
- `{{donation_date}}` ❌
- `{{from_name}}` ❌
- `{{reply_to}}` ❌

## 📧 **Updated Email Service**

The email service now sends only these parameters:
```javascript
{
  to_name: "Donor Name",
  message: "Email message content"
}
```

## 🎯 **Simple Template Code**

Copy this into your EmailJS template:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Thank You for Your Donation</title>
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
                <strong>Wildlife Safari Team</strong>
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

## 🚀 **Testing Steps:**

1. **Update your EmailJS template** with the simple version
2. **Click "Debug EmailJS"** in admin panel
3. **Check console** for success messages
4. **Try sending a test email** to a real address
5. **Verify the email** is received correctly

## 🔍 **Common Issues:**

### **Issue 1: Template has extra variables**
- **Solution**: Remove all variables except `{{to_name}}` and `{{message}}`

### **Issue 2: Variable names don't match**
- **Solution**: Use exact variable names: `{{to_name}}` and `{{message}}`

### **Issue 3: Template not saved**
- **Solution**: Make sure to click "Save" in EmailJS dashboard

## ✅ **Expected Result:**

After fixing, you should see:
- ✅ **Debug EmailJS** shows success
- ✅ **Test EmailJS** works
- ✅ **Send Email** buttons work
- ✅ **Emails received** without corruption errors

---

**The key is to use only the basic variables that EmailJS can handle without corruption!** 🚀
