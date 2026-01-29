# SecureLife Insurance Website

A complete, responsive insurance company website built with **pure HTML, CSS, and vanilla JavaScript**. No frameworks, no libraries, no backend required.

## Features

### 🎨 Design
- Modern, professional insurance company aesthetic
- Responsive design that works on all devices
- Google Fonts (Inter) for clean typography
- Centered layout with max-width container (1200px)
- Background with gradient overlay
- Smooth hover animations and transitions

### 🏠 Pages
- **index.html** - Home page with all sections
- **privacy.html** - Privacy Policy page
- **cookies.html** - Cookies Policy page
- Footer links to all legal pages

### ✨ Interactive Features

#### Hero Slideshow
- 3 slides with beautiful background images from Pexels
- Autoplay (5 seconds per slide)
- Smooth fade transitions
- Navigation arrows (left/right)
- Dot indicators
- Pause on hover
- Keyboard navigation (arrow keys)
- Text overlay with title, subtitle, and CTA button

#### Navigation
- Sticky header with logo and navigation
- Mobile-responsive hamburger menu
- Smooth scrolling to sections
- Active section highlighting
- Animated on scroll

#### Sections
1. **Insurance Products** - 4 cards (Home, Auto, Health, Life)
2. **Benefits** - 6 benefit items with icons
3. **Testimonials** - 3 customer testimonials with ratings
4. **FAQ** - Accordion with 6 questions
5. **Contact** - Form with validation and EmailJS integration

#### Contact Form
- Client-side validation
- Required fields: Name, Email, Message
- Optional fields: Phone, Insurance Type
- Real-time error messages
- EmailJS integration for sending emails
- Success message after submission
- "Send Another Message" button to reset form
- Works without EmailJS (shows demo success message)

#### Animations
- IntersectionObserver for scroll-in animations
- Smooth hover effects on cards and buttons
- FAQ accordion with smooth transitions
- Mobile menu slide animations

## Project Structure

```
├── index.html              # Home page
├── privacy.html            # Privacy policy
├── cookies.html            # Cookies policy
├── css/
│   └── style.css          # All styles
├── js/
│   └── main.js            # All JavaScript
├── assets/
│   └── images/            # Image directory (currently using external URLs)
└── README.md              # This file
```

## Setup & Usage

### Basic Setup

1. **Clone or download** this project
2. **Open index.html** in your browser
3. That's it! The website is fully functional as a static site.

### Development

If you want to use the Vite dev server:

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```

This creates an optimized version in the `dist/` folder.

## EmailJS Integration (Optional)

To enable the contact form to send real emails:

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Connect an email service (Gmail, Outlook, etc.)

### Step 2: Create Email Template
Create a template with these variables:
- `{{name}}` - Sender's name
- `{{email}}` - Sender's email
- `{{phone}}` - Sender's phone
- `{{insurance_type}}` - Insurance type selected
- `{{message}}` - Message content

### Step 3: Get Your Credentials
- Service ID
- Template ID
- Public Key

### Step 4: Update the Code

**In index.html**, add before closing `</body>` tag:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
    (function(){
        emailjs.init('YOUR_PUBLIC_KEY');
    })();
</script>
<script src="/js/main.js"></script>
```

**In js/main.js**, update these lines (around line 238):
```javascript
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';
```

### Step 5: Test
Submit the contact form and check if you receive the email!

## Customization

### Change Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #0066FF;
    --primary-dark: #0052CC;
    /* ... more colors */
}
```

### Change Images
The hero slideshow currently uses images from Pexels. To use your own:

1. Add images to `assets/images/`
2. Update image sources in `index.html`:
```html
<img src="/assets/images/your-image.jpg" alt="Description">
```

### Add More Slides
In `index.html`, duplicate a `.hero-slide` div and add a corresponding `.hero-dot` button.

### Modify Content
All content is in the HTML files. Simply edit the text, add/remove sections as needed.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, CSS Variables, Animations
- **JavaScript ES6+** - Vanilla JS, IntersectionObserver API
- **Google Fonts** - Inter font family
- **Pexels** - Hero slideshow images
- **Pravatar** - Testimonial avatars

## Performance

- Lightweight (~50KB total uncompressed)
- No framework overhead
- Optimized images from CDN
- CSS/JS minification in production build
- Fast loading and smooth animations

## Accessibility

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Sufficient color contrast
- Focus indicators on interactive elements
- Responsive text sizing

## License

This is a demo project. Feel free to use and modify as needed.

## Credits

- Images: [Pexels](https://www.pexels.com/)
- Avatars: [Pravatar](https://pravatar.cc/)
- Font: [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- Icons: SVG inline icons

## Support

For questions or issues, please refer to the inline code comments in `js/main.js` and `css/style.css`.

---

**Built with ❤️ using only HTML, CSS, and JavaScript**
