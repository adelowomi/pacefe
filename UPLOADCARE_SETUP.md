# Uploadcare Integration Setup

This document explains how to set up Uploadcare for image uploads in the application.

## Overview

The application has been updated to use Uploadcare for image uploads instead of requiring users to enter image URLs manually. This provides a better user experience with drag-and-drop file uploads, image previews, and automatic CDN hosting.

## Setup Instructions

### 1. Create an Uploadcare Account

1. Go to [Uploadcare](https://uploadcare.com/) and sign up for a free account
2. Once logged in, create a new project or use the default project
3. Navigate to the project settings to find your Public Key

### 2. Configure Environment Variables

1. Copy your Uploadcare Public Key from the dashboard
2. Add it to your `.env` file:

```bash
VITE_UPLOADCARE_PUBLIC_KEY=your_actual_public_key_here
```

3. Make sure to also update `.env.example` if you're sharing the project:

```bash
VITE_UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key_here
```

### 3. Features Implemented

The following components now use the new ImageUpload component:

- **User Profile**: Profile picture upload in edit mode
- **Add Organization Member**: Profile picture upload when adding new members

### 4. ImageUpload Component Features

The custom ImageUpload component provides:

- **Drag & Drop**: Users can drag files directly onto the upload area
- **Click to Upload**: Traditional file picker interface
- **Image Preview**: Shows uploaded images with remove option
- **Replace Functionality**: Easy image replacement
- **Loading States**: Visual feedback during upload
- **Error Handling**: Displays upload errors to users
- **File Validation**: Accepts only image files (PNG, JPG, GIF)
- **Size Limits**: Supports files up to 10MB

### 5. How It Works

1. User selects or drops an image file
2. File is uploaded directly to Uploadcare's servers
3. Uploadcare returns a CDN URL
4. The URL is stored in the application's database
5. Images are served from Uploadcare's global CDN

### 6. Benefits

- **Better UX**: No need to host images elsewhere and copy URLs
- **Performance**: Images served from global CDN
- **Reliability**: Professional image hosting service
- **Security**: Files are scanned and processed by Uploadcare
- **Scalability**: No server storage required for images

### 7. Uploadcare Pricing

- **Free Tier**: 3,000 uploads per month, 3GB storage, 10GB CDN traffic
- **Paid Plans**: Available for higher usage requirements

### 8. Development Notes

- The ImageUpload component is located at `src/components/ui/image-upload.tsx`
- It uses the Uploadcare REST API for uploads
- The component is fully typed with TypeScript
- Error handling includes both network and validation errors
- The component is responsive and works on mobile devices

### 9. Testing

To test the image upload functionality:

1. Ensure your Uploadcare public key is configured
2. Navigate to the user profile page
3. Click "Edit Profile"
4. Try uploading an image using the profile picture field
5. Verify the image appears correctly after upload

### 10. Troubleshooting

**Images not uploading:**
- Check that `VITE_UPLOADCARE_PUBLIC_KEY` is set correctly
- Verify the public key is valid in your Uploadcare dashboard
- Check browser console for any error messages

**Images not displaying:**
- Ensure the Uploadcare CDN URLs are accessible
- Check if there are any CORS issues in the browser console

**Upload errors:**
- Verify file size is under 10MB
- Ensure file type is supported (PNG, JPG, GIF)
- Check network connectivity

For more information, visit the [Uploadcare Documentation](https://uploadcare.com/docs/).
