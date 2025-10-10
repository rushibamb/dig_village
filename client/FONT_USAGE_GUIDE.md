# Marathi Font Usage Guide for Developers

## Quick Start

### Adding Marathi Text
Simply add `lang="mr"` attribute to automatically use the best Marathi fonts:

```html
<h1 lang="mr">ग्रामपंचायत पोर्टल</h1>
<p lang="mr">आपले स्वागत आहे</p>
```

## Font Classes Reference

### `.font-marathi` - Primary Marathi Font
**Font:** Mukta  
**Best for:** Body text, paragraphs, general content  
**Example:**
```html
<p class="font-marathi text-lg">
  हे मुख्य मराठी फॉन्ट आहे. हे वाचनासाठी सर्वोत्तम आहे.
</p>
```

### `.font-marathi-display` - Display/Decorative Font
**Font:** Tiro Devanagari Marathi  
**Best for:** Hero sections, large headings, banners  
**Example:**
```html
<h1 class="font-marathi-display text-6xl text-center">
  स्वागत आहे
</h1>
```

### `.font-devanagari` - Fallback Font
**Font:** Noto Sans Devanagari + Mukta  
**Best for:** General Devanagari text  
**Example:**
```html
<div class="font-devanagari">
  सामान्य देवनागरी मजकूर
</div>
```

## Real-World Examples

### Example 1: Page Header
```html
<header class="bg-blue-600 text-white p-8">
  <h1 class="font-marathi-display text-4xl md:text-6xl text-center mb-4">
    ग्रामपंचायत पोर्टल
  </h1>
  <p class="font-marathi text-xl text-center">
    आपल्या गावाची संपूर्ण माहिती एका क्लिकवर
  </p>
</header>
```

### Example 2: Card Component
```html
<div class="card p-6 rounded-lg shadow-lg">
  <h2 class="font-marathi text-2xl font-semibold mb-3" lang="mr">
    सेवा
  </h2>
  <p class="font-marathi text-base leading-relaxed" lang="mr">
    आमच्या ग्रामपंचायतीच्या विविध सेवा ऑनलाइन उपलब्ध आहेत.
    तुम्ही घरबसल्या सर्व सेवा मिळवू शकता.
  </p>
</div>
```

### Example 3: Navigation Menu
```html
<nav class="flex gap-6">
  <a href="#" class="font-marathi hover:text-blue-600" lang="mr">
    मुख्यपृष्ठ
  </a>
  <a href="#" class="font-marathi hover:text-blue-600" lang="mr">
    सेवा
  </a>
  <a href="#" class="font-marathi hover:text-blue-600" lang="mr">
    तक्रारी
  </a>
</nav>
```

### Example 4: Hero Section
```html
<section class="hero bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
  <div class="container mx-auto text-center">
    <h1 class="font-marathi-display text-5xl md:text-7xl font-bold mb-6" lang="mr">
      डिजिटल ग्रामपंचायत
    </h1>
    <p class="font-marathi text-xl md:text-2xl mb-8" lang="mr">
      आधुनिक तंत्रज्ञानाद्वारे ग्रामविकास
    </p>
    <button class="font-marathi bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition">
      अधिक माहिती
    </button>
  </div>
</section>
```

### Example 5: Form Labels
```html
<form class="space-y-4">
  <div>
    <label class="font-marathi text-sm font-medium mb-2 block" lang="mr">
      तुमचे नाव
    </label>
    <input type="text" class="font-marathi w-full p-2 border rounded" 
           placeholder="पूर्ण नाव टाका" />
  </div>
  
  <div>
    <label class="font-marathi text-sm font-medium mb-2 block" lang="mr">
      मोबाइल नंबर
    </label>
    <input type="tel" class="font-marathi w-full p-2 border rounded" 
           placeholder="१०-अंकी मोबाइल नंबर" />
  </div>
</form>
```

### Example 6: Alert/Notification
```html
<div class="bg-green-100 border-l-4 border-green-500 p-4">
  <p class="font-marathi text-green-700 font-medium" lang="mr">
    ✓ तुमची विनंती यशस्वीरित्या सबमिट झाली आहे
  </p>
</div>
```

### Example 7: Table Headers
```html
<table class="w-full">
  <thead class="bg-gray-100">
    <tr class="font-marathi" lang="mr">
      <th class="p-3 text-left">क्रमांक</th>
      <th class="p-3 text-left">नाव</th>
      <th class="p-3 text-left">गाव</th>
      <th class="p-3 text-left">स्थिती</th>
    </tr>
  </thead>
  <tbody class="font-marathi" lang="mr">
    <tr>
      <td class="p-3">१</td>
      <td class="p-3">राज कुमार</td>
      <td class="p-3">आदर्श नगर</td>
      <td class="p-3">सक्रिय</td>
    </tr>
  </tbody>
</table>
```

### Example 8: Footer
```html
<footer class="bg-gray-800 text-white py-8">
  <div class="container mx-auto">
    <div class="grid md:grid-cols-3 gap-8">
      <div>
        <h3 class="font-marathi text-xl font-semibold mb-4" lang="mr">
          संपर्क
        </h3>
        <p class="font-marathi" lang="mr">
          ग्रामपंचायत कार्यालय<br/>
          फोन: ०२१-१२३४५६७<br/>
          ईमेल: info@grampanchayat.gov.in
        </p>
      </div>
      <div>
        <h3 class="font-marathi text-xl font-semibold mb-4" lang="mr">
          द्रुत दुवे
        </h3>
        <ul class="font-marathi space-y-2" lang="mr">
          <li><a href="#" class="hover:text-blue-400">मुख्यपृष्ठ</a></li>
          <li><a href="#" class="hover:text-blue-400">सेवा</a></li>
          <li><a href="#" class="hover:text-blue-400">संपर्क</a></li>
        </ul>
      </div>
    </div>
  </div>
</footer>
```

## Typography Best Practices

### Font Sizes for Marathi
```css
/* Headings - slightly larger for Devanagari */
.marathi-heading-1 { font-size: 3rem; }     /* 48px */
.marathi-heading-2 { font-size: 2.25rem; }  /* 36px */
.marathi-heading-3 { font-size: 1.875rem; } /* 30px */
.marathi-heading-4 { font-size: 1.5rem; }   /* 24px */

/* Body text */
.marathi-body { font-size: 1rem; }          /* 16px */
.marathi-small { font-size: 0.875rem; }     /* 14px */
```

### Line Heights for Readability
```html
<!-- Tight (headings) -->
<h1 class="font-marathi leading-tight" lang="mr">शीर्षक</h1>

<!-- Normal (body) -->
<p class="font-marathi leading-normal" lang="mr">मजकूर</p>

<!-- Relaxed (long paragraphs) -->
<p class="font-marathi leading-relaxed" lang="mr">मोठा परिच्छेद</p>

<!-- Loose (emphasis) -->
<p class="font-marathi leading-loose" lang="mr">विशेष मजकूर</p>
```

### Font Weights
```html
<!-- Regular (400) - Default -->
<p class="font-marathi font-normal" lang="mr">सामान्य</p>

<!-- Medium (500) - Slight emphasis -->
<p class="font-marathi font-medium" lang="mr">मध्यम</p>

<!-- Semi-bold (600) - Headings -->
<h2 class="font-marathi font-semibold" lang="mr">अर्ध-ठळक</h2>

<!-- Bold (700) - Strong emphasis -->
<strong class="font-marathi font-bold" lang="mr">ठळक</strong>
```

## Component Examples

### Button Component
```html
<!-- Primary button -->
<button class="font-marathi bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
  सबमिट करा
</button>

<!-- Secondary button -->
<button class="font-marathi bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition">
  रद्द करा
</button>
```

### Badge Component
```html
<span class="font-marathi bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
  मंजूर
</span>

<span class="font-marathi bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
  नाकारले
</span>
```

### Card with Mixed Content
```html
<div class="card bg-white rounded-lg shadow-lg p-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="font-marathi text-xl font-semibold" lang="mr">कर रेकॉर्ड</h3>
    <span class="font-marathi bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm">
      प्रलंबित
    </span>
  </div>
  <div class="space-y-2 font-marathi text-gray-700" lang="mr">
    <p>घर क्रमांक: <span class="font-semibold">१०१</span></p>
    <p>मालकाचे नाव: <span class="font-semibold">श्री. राज कुमार</span></p>
    <p>रक्कम: <span class="font-semibold text-red-600">₹५,००० /-</span></p>
  </div>
</div>
```

## Responsive Typography

```html
<!-- Mobile: smaller, Desktop: larger -->
<h1 class="font-marathi text-3xl md:text-5xl lg:text-6xl font-bold" lang="mr">
  प्रतिसादात्मक शीर्षक
</h1>

<!-- Responsive paragraph -->
<p class="font-marathi text-sm md:text-base lg:text-lg leading-relaxed" lang="mr">
  या परिच्छेदाचा आकार स्क्रीनच्या आकारानुसार बदलतो.
</p>
```

## Pro Tips

### ✅ Do's
- Always use `lang="mr"` for Marathi content
- Use `.font-marathi` for body text
- Use `.font-marathi-display` for large decorative text
- Keep line-height between 1.4-1.6 for Devanagari
- Use font-weight 600 (semibold) for headings

### ❌ Don'ts
- Don't mix too many different fonts
- Don't use font sizes smaller than 14px for Marathi text
- Don't use tight line-heights (less than 1.3)
- Don't use all-caps for Marathi (Devanagari doesn't have uppercase)
- Don't use light weights (300 or below) for body text

## Browser Testing Checklist

- [ ] Check font loading in Chrome
- [ ] Check font loading in Firefox  
- [ ] Check font loading in Safari
- [ ] Test on mobile devices
- [ ] Verify fallback fonts work
- [ ] Check readability on different screen sizes
- [ ] Test with slow internet (font loading)

---

**Need Help?** Check `FONT_IMPROVEMENTS.md` for detailed technical information.




