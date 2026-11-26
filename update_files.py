import re, os

BASE = r'c:\Users\shahfarid\Downloads\budget_malaysia_website'

# Standard footer-top block to inject
NEW_FOOTER_TOP = '''      <div class="footer-top">
        <div class="footer-brand">
          <a class="brand" href="index.html" aria-label="Budget Malaysia Home">
            <img src="assets/images/budget-logo-navy.png" alt="Budget Car Rental" class="brand-logo-img">
          </a>
          <p>DRB-HICOM EZ-Drive Sdn. Bhd. | Company No.:197201001192 (12799-K)</p>
          <div class="footer-contact-info">
            <div><i class="fa-solid fa-building"></i> Level 2, EON Head Office Complex, No 2, Persiaran Kerjaya, Glenmarie Industrial Park, Section U1, 40150 Shah Alam, Selangor Darul Ehsan</div>
            <div><i class="fa-solid fa-phone"></i> Central Reservations: <a href="tel:+60378031122">+603-7803 1122</a></div>
            <div><i class="fa-solid fa-envelope"></i> Email: <a href="mailto:glenmarie@budgetmalaysia.com.my">glenmarie@budgetmalaysia.com.my</a></div>
          </div>
        </div>

        <div class="footer-col">
          <h4>Explore</h4>
          <div class="footer-links">
            <a href="#">Terms &amp; Condition</a>
            <a href="#">Privacy Policy</a>
            <a href="faq.html">Frequently Asked Questions (FAQ)</a>
            <a href="mailto:glenmarie@budgetmalaysia.com.my">Contact Us</a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Promotions &amp; Updates</h4>
          <p style="font-size: 12px; color: #CBD5E1; margin-bottom: 12px;">
            Subscribe to receive exclusive weekend promo codes and holiday deals:
          </p>
          <form class="newsletter-box" onsubmit="event.preventDefault(); showToast('Thank you for subscribing to Budget Malaysia!');"> 
            <input type="email" placeholder="Your email address" required>
            <button type="submit">Join</button>
          </form>
        </div>
      </div>'''

files = ['index.html', 'fleet.html', 'offer.html', 'reservation.html', 'locations.html', 'faq.html']

for fname in files:
    path = os.path.join(BASE, fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # CHANGE 1: Remove FAQ nav link (handles both 'nav-link' and 'nav-link active')
    before_nav = content
    content = re.sub(r'[ \t]*<a class="nav-link(?: active)?" href="faq\.html">FAQ</a>\r?\n', '', content)
    if content != before_nav:
        print(f'{fname}: FAQ nav link removed')
    else:
        print(f'{fname}: WARNING - FAQ nav link not found')

    # CHANGE 2: Replace entire footer-top block
    before_footer = content
    content = re.sub(
        r'      <div class="footer-top">.*?      </div>(\s*\n\s*<div class="footer-bottom")',
        NEW_FOOTER_TOP + r'\1',
        content,
        flags=re.DOTALL
    )
    if content != before_footer:
        print(f'{fname}: footer-top replaced')
    else:
        print(f'{fname}: WARNING - footer-top not found/replaced')

    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(content)

print('\nAll HTML files processed.')
