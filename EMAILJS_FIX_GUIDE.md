# EmailJS Fix Guide - "Recipients Address is Empty" Error

## 🚨 **Problem Identified**

The error "The recipients address is empty" occurs because:
1. **EmailJS requires a recipient email address** to send emails
2. **We removed the `to_email` parameter** from the template parameters
3. **EmailJS template needs to know where to send the email**

## 🔧 **Complete Fix**

### **Step 1: Update Your EmailJS Template**

1. **Go to EmailJS Dashboard** → **Email Templates**
2. **Edit your template** (ID: `template_q3qwprk`)
3. **Replace with the correct template** from `EMAILJS_CORRECT_TEMPLATE.html`
4. **Save the template**

### **Step 2: EmailJS Template Variables**

Your template should use these variables:
- `{{to_name}}` - Donor's name
- `{{message}}` - Email message content
- `{{subject}}` - Email subject (optional)

**Important**: The recipient email address is handled automatically by EmailJS when you include `to_email` in the parameters.

### **Step 3: Test the Fix**

1. **Go to Admin Panel** → **Donations**
2. **Click "Debug EmailJS"** to test different parameter combinations
3. **Check console** for success messages
4. **Try "Test EmailJS"** to verify configuration

## 📧 **Updated Email Service**

The email service now sends these parameters:

```javascript
{
  to_email: "donor@example.com",     // REQUIRED - Recipient email address
  to_name: "Donor Name",             // Donor's name
  message: "Email message content",  // Main message
  subject: "Email subject",          // Optional subject
  // Alternative email parameters for compatibility
  email: "donor@example.com",
  user_email: "donor@example.com",
  recipient_email: "donor@example.com"
}
```

## 🎯 **Correct Template Code**

Copy this into your EmailJS template:

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

## 🚀 **Testing Steps**

### **Step 1: Debug Test**
1. **Click "Debug EmailJS"** in admin panel
2. **Check console** for success messages
3. **Look for ✅ SUCCESS** indicators

### **Step 2: Configuration Test**
1. **Click "Test EmailJS"** button
2. **Verify** no errors in console
3. **Check** success message

### **Step 3: Send Real Email**
1. **Find a donation** in admin panel
2. **Click "Send Email"** on donation card
3. **Choose "Send Thank You"** or "Send Custom Email"
4. **Verify** email is sent successfully

## 🔍 **Common Issues & Solutions**

### **Issue 1: Still getting "recipients address is empty"**
- **Solution**: Make sure `to_email` is included in template parameters
- **Check**: EmailJS template is saved correctly

### **Issue 2: Email not sending**
- **Solution**: Verify EmailJS service is connected to your email provider
- **Check**: Service ID, Template ID, and Public Key are correct

### **Issue 3: Template variables not working**
- **Solution**: Use only `{{to_name}}` and `{{message}}` in template
- **Check**: Variable names match exactly

## ✅ **Expected Results**

After applying the fix:
- ✅ **No more "recipients address is empty" errors**
- ✅ **Debug EmailJS shows success**
- ✅ **Test EmailJS works**
- ✅ **Emails send to actual donor addresses**
- ✅ **Professional email template**

## 🎯 **Key Points**

1. **`to_email` parameter is REQUIRED** by EmailJS
2. **Template only needs `{{to_name}}` and `{{message}}`**
3. **EmailJS handles recipient address automatically**
4. **Multiple email parameter names for compatibility**

---

**The fix ensures EmailJS has the recipient email address it needs to send emails!** 🚀
