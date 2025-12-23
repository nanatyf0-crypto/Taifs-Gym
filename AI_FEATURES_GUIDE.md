# AI Features Usage Guide

## Image Generation

### How to use:
1. Navigate to **AI Studio** from Dashboard
2. Select **Image Generation** tab
3. Choose image type: **Exercise** or **Meal**
4. Enter name (e.g., "Push-ups" or "Grilled Chicken Salad")
5. Click **Generate Image**
6. Wait 30-60 seconds (image generation takes time)

### Important Notes:
- ⏱️ **Be patient**: Image generation typically takes 30-60 seconds
- 🔑 **Authentication**: You must be logged in
- 🌐 **Internet**: Requires stable internet connection
- 💰 **Credits**: Uses Emergent LLM Key credits
- ✨ **Quality**: Generates high-quality, realistic images

### Troubleshooting:
- **"Failed to generate"**: 
  - Check your internet connection
  - Try again (sometimes API is busy)
  - Make sure you're logged in
  
- **Taking too long**:
  - Normal for first generation (up to 90 seconds)
  - Don't refresh the page
  - Wait for completion

## Voice Generation

### How to use:
1. Navigate to **AI Studio**
2. Select **Voice Assistant** tab
3. Enter text (workout instructions, motivational message)
4. Choose voice type (Nova, Alloy, Shimmer, etc.)
5. Click **Generate Voice**
6. Listen to generated audio

### Voice Types:
- **Alloy**: Neutral, balanced
- **Nova**: Energetic, motivational (recommended for workouts)
- **Shimmer**: Bright, enthusiastic
- **Echo**: Smooth, calm
- **Fable**: Expressive, storytelling
- **Onyx**: Deep, authoritative

### Examples:
```
"Let's begin with push-ups. 3 sets of 15 reps. Keep your form tight!"
"Great job! Take a 30-second rest before the next set."
"Remember to breathe - inhale on the way down, exhale on the way up."
```

## Translation Issues

### Language Switch:
- Click language toggle button in navbar
- Switch between **العربية** and **EN**
- All UI elements should translate immediately

### If translations are missing:
- Refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Check language is selected correctly
- Clear browser cache if needed

### Common Translations:
| English | Arabic |
|---------|--------|
| Generate Image | توليد صورة |
| Generate Voice | توليد صوت |
| Image Generation | توليد الصور |
| Voice Assistant | المساعد الصوتي |
| Exercise Name | اسم التمرين |
| Meal Name | اسم الوجبة |
| Generating... | جاري التوليد... |

## API Endpoints (for developers)

### Image Generation:
```bash
POST /api/generate-exercise-image
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "name": "Push-ups",
  "type": "exercise"
}
```

### Voice Generation:
```bash
POST /api/generate-voice-guidance
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "text": "Let's begin with push-ups",
  "voice": "nova"
}
```

## Credits & Limits

- Image generation: ~0.04 USD per image
- Voice generation: ~0.015 USD per request
- Uses Emergent LLM Key (shared credits)
- Check your credit balance in profile

## Support

If you experience issues:
1. Check this guide first
2. Try refreshing the page
3. Clear browser cache
4. Try again after a few minutes
5. Contact support if problem persists
