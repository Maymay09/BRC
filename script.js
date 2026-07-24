/* ==========================================================================
   BODIEDRIGHT BY CHEEDAH — SCRIPT.JS
   LocalStorage acts as the database for now (Firebase temporarily disconnected
   at your request — the code is structured so it's a quick swap to reconnect
   whenever you're ready).
   Organized into: Data Seeding | Storage Helpers | Render Functions |
   Cart | Checkout | Consultation | Sliders/FAQ | UI Chrome | Admin
   ========================================================================== */

/* ---------------------------------------------------------------------
   0. CONSTANTS
   --------------------------------------------------------------------- */
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";
const DEFAULT_DELIVERY_ZONES = [
  { id:"dz1", state:"Lagos", fee:2500 }, { id:"dz2", state:"Ogun", fee:3000 },
  { id:"dz3", state:"Oyo", fee:3500 }, { id:"dz4", state:"Rivers", fee:4000 },
  { id:"dz5", state:"Abuja", fee:3500 }, { id:"dz6", state:"Kano", fee:4500 },
  { id:"dz7", state:"Kaduna", fee:4500 }, { id:"dz8", state:"Enugu", fee:4000 },
  { id:"dz9", state:"Delta", fee:4000 }, { id:"dz10", state:"Edo", fee:3800 },
  { id:"dz11", state:"Anambra", fee:4000 }, { id:"dz12", state:"Imo", fee:4200 },
  { id:"dz13", state:"Cross River", fee:4500 }, { id:"dz14", state:"Akwa Ibom", fee:4500 },
  { id:"dz15", state:"Ondo", fee:3500 }, { id:"dz16", state:"Osun", fee:3500 },
  { id:"dz17", state:"Ekiti", fee:3800 }, { id:"dz18", state:"Kwara", fee:3800 },
  { id:"dz19", state:"Plateau", fee:4200 }, { id:"dz20", state:"Others", fee:5000 }
];

const LS = {
  products:"bodiedright_products", combos:"bodiedright_combos", promos:"bodiedright_promos",
  testimonials:"bodiedright_testimonials", consultations:"bodiedright_consultations",
  orders:"bodiedright_orders", settings:"bodiedright_settings", cart:"bodiedright_cart",
  deliveryZones:"bodiedright_delivery_zones", seeded:"bodiedright_seeded"
};

/* ---------------------------------------------------------------------
   1. SAMPLE DATA (seeded once into LocalStorage)
   --------------------------------------------------------------------- */
function img(seed, w=600, h=600){ return `https://picsum.photos/seed/${seed}/${w}/${h}`; }

const SAMPLE_PRODUCTS = [
  { id:"p1", name:"Fuller Flax Capsules", shortDesc:"Herbal flaxseed & fenugreek capsules for gradual weight gain.",
    fullDesc:"Our flagship capsule blend combines cold-pressed flaxseed oil with fenugreek and pumpkin seed extract to support healthy appetite and curve development over 8-12 weeks.",
    benefits:["Boosts appetite naturally","Supports hip & bust fullness","No harsh hormones"],
    ingredients:["Flaxseed extract","Fenugreek","Pumpkin seed oil","Vitamin E"],
    usage:"Take 2 capsules twice daily with meals for best results.",
    price:18500, discountPrice:15500, category:"capsules", featured:true, bestSeller:true, image:img("flax1"),
    gallery:[img("flax1"),img("flax1b"),img("flax1c")] },
  { id:"p2", name:"BodiedRight Boost Syrup", shortDesc:"Fast-acting herbal syrup for appetite & weight support.",
    fullDesc:"A rich tonic syrup made from natural roots and honey to stimulate appetite and support consistent daily weight gain.",
    benefits:["Improves appetite within days","Rich in natural vitamins","Pleasant honey taste"],
    ingredients:["Honey","Ginger root","Milk thistle","Multivitamin blend"],
    usage:"Take 2 tablespoons every morning before breakfast.",
    price:14000, discountPrice:0, category:"syrups", featured:true, bestSeller:false, image:img("syrup1"),
    gallery:[img("syrup1"),img("syrup1b")] },
  { id:"p3", name:"Hip & Bust Massage Oil", shortDesc:"Firming massage oil for a fuller, toned silhouette.",
    fullDesc:"Blended with fenugreek, vitamin E and shea butter, this warming oil is massaged into hips and bust to support skin elasticity as your body fills out.",
    benefits:["Improves skin elasticity","Warming, non-greasy formula","Supports curve massage routine"],
    ingredients:["Shea butter","Fenugreek oil","Vitamin E","Rosemary extract"],
    usage:"Massage in circular motion twice daily for 5-10 minutes.",
    price:12500, discountPrice:9900, category:"oils", featured:true, bestSeller:true, image:img("oil1"),
    gallery:[img("oil1"),img("oil1b"),img("oil1c")] },
  { id:"p4", name:"BodiedRight Wellness Tea", shortDesc:"Daily herbal tea blend to support digestion & appetite.",
    fullDesc:"A soothing tea blend with fennel, chamomile and fenugreek to keep digestion smooth while your appetite increases.",
    benefits:["Supports digestion","Caffeine-free","Calming evening ritual"],
    ingredients:["Fennel","Chamomile","Fenugreek","Lemongrass"],
    usage:"Steep one sachet in hot water for 5 minutes, drink after meals.",
    price:8500, discountPrice:0, category:"teas", featured:false, bestSeller:false, image:img("tea1"),
    gallery:[img("tea1"),img("tea1b")] },
  { id:"p5", name:"Bust Firming Cream", shortDesc:"Daily cream for firmer, fuller-looking bust area.",
    fullDesc:"A lightweight cream enriched with collagen-boosting botanicals to keep skin firm as your body changes shape.",
    benefits:["Boosts skin firmness","Lightweight, fast-absorbing","Pleasant floral scent"],
    ingredients:["Collagen peptides","Cocoa butter","Vitamin C","Aloe vera"],
    usage:"Apply morning and night with gentle upward massage.",
    price:16000, discountPrice:13500, category:"oils", featured:false, bestSeller:true, image:img("cream1"),
    gallery:[img("cream1"),img("cream1b")] },
  { id:"p6", name:"Appetite Booster Gummies", shortDesc:"Delicious daily gummies to naturally boost appetite.",
    fullDesc:"Fruit-flavoured gummies packed with fenugreek extract and B-vitamins, made for women who struggle to eat consistently.",
    benefits:["Tasty daily ritual","Boosts appetite gently","Vegan friendly"],
    ingredients:["Fenugreek extract","Vitamin B-complex","Pectin","Natural fruit flavour"],
    usage:"Chew 2 gummies daily, morning or evening.",
    price:11000, discountPrice:0, category:"capsules", featured:true, bestSeller:false, image:img("gummy1"),
    gallery:[img("gummy1"),img("gummy1b")] },
  { id:"p7", name:"Waist & Hip Shaping Belt", shortDesc:"Comfortable shaping belt to enhance your curve routine.",
    fullDesc:"A breathable compression belt designed to support your posture and enhance the visual effect of your weight gain journey.",
    benefits:["Breathable fabric","Adjustable fit","Supports posture"],
    ingredients:["Latex-free elastic blend"],
    usage:"Wear for up to 6 hours daily, take breaks as needed.",
    price:22000, discountPrice:18500, category:"accessories", featured:false, bestSeller:false, image:img("belt1"),
    gallery:[img("belt1"),img("belt1b")] },
  { id:"p8", name:"Overnight Repair Oil", shortDesc:"Nighttime botanical oil for skin renewal & softness.",
    fullDesc:"A deeply nourishing overnight oil that keeps skin soft and elastic through your body transformation journey.",
    benefits:["Deep overnight hydration","Reduces stretch mark appearance","Soothing lavender scent"],
    ingredients:["Rosehip oil","Lavender","Vitamin E","Argan oil"],
    usage:"Apply generously before bed to hips, thighs and bust.",
    price:13500, discountPrice:0, category:"oils", featured:false, bestSeller:false, image:img("oil2"),
    gallery:[img("oil2"),img("oil2b")] },
  { id:"p10", name:"BodiedRight Multivitamin Capsules", shortDesc:"Daily multivitamin to support overall wellness.",
    fullDesc:"A complete multivitamin formulated to fill nutritional gaps and support energy while you focus on gaining weight healthily.",
    benefits:["Full daily nutrient support","Boosts energy levels","Supports immune health"],
    ingredients:["Vitamin A-Z blend","Zinc","Iron","Folic acid"],
    usage:"Take 1 capsule daily with breakfast.",
    price:10500, discountPrice:0, category:"capsules", featured:false, bestSeller:true, image:img("vit1"),
    gallery:[img("vit1"),img("vit1b")] },
  { id:"p12", name:"Deep Nourish Body Butter", shortDesc:"Rich whipped body butter for soft, supple skin.",
    fullDesc:"An ultra-rich whipped butter that locks in moisture, keeping skin smooth and radiant as your body changes.",
    benefits:["24hr moisture lock","Whipped, non-greasy texture","Cocoa & shea blend"],
    ingredients:["Shea butter","Cocoa butter","Coconut oil","Vitamin E"],
    usage:"Apply all over body after shower for best absorption.",
    price:15000, discountPrice:12500, category:"oils", featured:true, bestSeller:false, image:img("butter1"),
    gallery:[img("butter1"),img("butter1b")] }
];

const SAMPLE_COMBOS = [
  { id:"c1", name:"Starter Body Goal Kit", products:["Fuller Flax Capsules","BodiedRight Boost Syrup","BodiedRight Wellness Tea"],
    originalPrice:41000, promoPrice:32000, image:img("combo1") },
  { id:"c2", name:"Full Body Transformation Bundle", products:["Fuller Flax Capsules","Hip & Bust Massage Oil","Bust Firming Cream","BodiedRight Multivitamin Capsules"],
    originalPrice:61000, promoPrice:46500, image:img("combo2") },
  { id:"c3", name:"Glow & Grow Bundle", products:["Appetite Booster Gummies","Deep Nourish Body Butter","Overnight Repair Oil"],
    originalPrice:39500, promoPrice:29900, image:img("combo3") },
  { id:"c4", name:"Total Wellness Combo", products:["BodiedRight Boost Syrup","BodiedRight Wellness Tea","BodiedRight Multivitamin Capsules","Waist & Hip Shaping Belt"],
    originalPrice:54000, promoPrice:41000, image:img("combo4") }
];

const SAMPLE_TESTIMONIALS = [
  { id:"t1", name:"Chiamaka O.", rating:5, review:"I gained 6kg in 2 months and my hips finally filled out my jeans! BodiedRight changed my confidence completely.", photo:img("cust1",200,200), before:img("ba1a",300,400), after:img("ba1b",300,400) },
  { id:"t2", name:"Blessing A.", rating:5, review:"The consultation team was so patient with me. My appetite has never been this consistent.", photo:img("cust2",200,200), before:img("ba2a",300,400), after:img("ba2b",300,400) },
  { id:"t3", name:"Funmilayo T.", rating:4, review:"Massage oil smells amazing and my skin feels so much firmer already. Would recommend to any woman.", photo:img("cust3",200,200), before:img("ba3a",300,400), after:img("ba3b",300,400) },
  { id:"t4", name:"Ngozi E.", rating:5, review:"Three months in and the results speak for themselves. Delivery was fast even to Enugu.", photo:img("cust4",200,200), before:img("ba4a",300,400), after:img("ba4b",300,400) },
  { id:"t5", name:"Aisha M.", rating:5, review:"Best decision I made this year. The combo bundle saved me so much money and gave visible results.", photo:img("cust5",200,200), before:img("ba5a",300,400), after:img("ba5b",300,400) },
  { id:"t6", name:"Temitope B.", rating:4, review:"Customer service replies fast on WhatsApp and the products are genuinely natural. No side effects for me.", photo:img("cust6",200,200), before:img("ba6a",300,400), after:img("ba6b",300,400) },
  { id:"t7", name:"Rita C.", rating:5, review:"I was skeptical at first but my before and after photos don't lie. Thank you BodiedRight!", photo:img("cust7",200,200), before:img("ba7a",300,400), after:img("ba7b",300,400) },
  { id:"t8", name:"Halima Y.", rating:5, review:"My appetite used to be a struggle, now I actually look forward to meals. Life changing.", photo:img("cust8",200,200), before:img("ba8a",300,400), after:img("ba8b",300,400) }
];

const SAMPLE_FAQS = [
  { q:"How long before I see results?", a:"Most clients start noticing appetite changes within 1-2 weeks, with visible body changes typically appearing between 6-12 weeks of consistent use." },
  { q:"Are BodiedRight products safe?", a:"Yes. All our products are made from natural, food-grade ingredients. However, we always recommend a free consultation first, especially if you have existing health conditions." },
  { q:"Do you deliver nationwide?", a:"We deliver to all 36 states in Nigeria. Lagos orders typically arrive within 24-48 hours, while other states take 3-5 working days." },
  { q:"Can I combine multiple products?", a:"Absolutely — many of our combo bundles are designed to be used together for faster, fuller results. Your consultation will guide the best combination for you." },
  { q:"Will I lose the results if I stop using the products?", a:"Weight gained through healthy nutrition-supporting products is generally maintained as long as you continue a balanced diet, similar to any wellness routine." },
  { q:"Do you offer refunds?", a:"Due to the nature of consumable wellness products, we do not offer refunds on opened items, but we're happy to help resolve any product concerns directly." },
  { q:"How do I know which product is right for me?", a:"Fill out our free consultation form and our wellness team will recommend a personalized plan based on your goals, body type and health history." }
];

const SAMPLE_PROMOS = [
  { id:"pr1", title:"Weekend Flash Sale — 25% Off", description:"Get 25% off all capsules and syrups this weekend only. Limited stock available.", buttonText:"Shop the Sale", image:img("promo1",260,260), enabled:true, endDate:futureDate(3) },
  { id:"pr2", title:"Free Consultation Week", description:"Book your free 1-on-1 wellness consultation and get a personalized plan.", buttonText:"Book Now", image:img("promo2",260,260), enabled:false, endDate:futureDate(7) },
  { id:"pr3", title:"Buy 2 Combos, Get Free Delivery", description:"Stock up on any two combo bundles and enjoy free nationwide delivery.", buttonText:"View Combos", image:img("promo3",260,260), enabled:false, endDate:futureDate(10) }
];

function futureDate(days){ const d=new Date(); d.setDate(d.getDate()+days); return d.toISOString().split('T')[0]; }

const DEFAULT_SETTINGS = {
  logo:"BodiedRight by Cheedah",
  heroHeading:"Nigeria's trusted functional nutrition brand for women!",
  heroSub:"Doctor-informed capsules, syrups and oils to help you gain weight, fill out your frame and feel radiant in your own skin — the healthy, natural way.",
  whatsapp:"08083907112",
  instagram:"https://www.instagram.com/bodiedrightby_cheedah?igsh=aXlrcnBlc3BiMXZn",
  tiktok:"https://www.tiktok.com/@bodiedright_by_cheedah?_r=1&_t=ZS-9899TZO7oEy",
  facebook:"",
  email:"bodiedrightbycheedah@gmail.com", phone:"08083907112",
  footerText:"..make your body goal a reality. Helping Nigerian women achieve real, healthy body transformations.",
  refundPolicy:"We do not offer refunds on opened or used consumable wellness products, in line with standard health and safety practice. If an item arrives damaged or incorrect, contact us within 48 hours of delivery with your order number and photos, and we will arrange a replacement or store credit.",
  deliveryPolicy:"We deliver nationwide across Nigeria. Lagos orders are typically delivered within 24-48 hours; other states take 3-5 working days. Delivery fees are calculated at checkout based on your state.",
  privacyPolicy:"BodiedRight by Cheedah collects only the information needed to process your order and consultation requests — name, phone number, email and delivery address. We never sell your data to third parties. Information shared during consultations is kept confidential and used only to guide your personalised recommendation.",
  termsPolicy:"By placing an order with BodiedRight by Cheedah, you confirm that the information provided is accurate and that you are purchasing for personal use. Results vary from person to person. Product descriptions are for informational purposes and are not a substitute for professional medical advice."
};

/* ---------------------------------------------------------------------
   2. STORAGE HELPERS
   --------------------------------------------------------------------- */
function getData(key){ try{ return JSON.parse(localStorage.getItem(key)) || []; } catch(e){ return []; } }
function setData(key, value){
  try{
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch(err){
    console.error('Storage error:', err);
    showToast("Save failed — storage is full. Try a smaller image.", 'triangle-exclamation');
    return false;
  }
}
function uid(prefix){ return prefix + "_" + Date.now() + "_" + Math.floor(Math.random()*1000); }
function currency(n){ return "₦" + Number(n||0).toLocaleString('en-NG'); }

// Normalizes Nigerian numbers (080..., +234..., 234...) into the digits-only
// international format wa.me requires (e.g. 2348012345678).
function toWhatsAppNumber(phone){
  let digits = String(phone||'').replace(/\D/g, '');
  if(digits.startsWith('0')) digits = '234' + digits.slice(1);
  else if(!digits.startsWith('234')) digits = '234' + digits;
  return digits;
}
function buildWhatsAppLink(phone, message){
  return `https://wa.me/${toWhatsAppNumber(phone)}?text=${encodeURIComponent(message)}`;
}

function seedData(){
  if(localStorage.getItem(LS.seeded)) return;
  setData(LS.products, SAMPLE_PRODUCTS);
  setData(LS.combos, SAMPLE_COMBOS);
  setData(LS.testimonials, SAMPLE_TESTIMONIALS);
  setData(LS.promos, SAMPLE_PROMOS);
  setData(LS.consultations, []);
  setData(LS.orders, []);
  setData(LS.deliveryZones, DEFAULT_DELIVERY_ZONES);
  localStorage.setItem(LS.settings, JSON.stringify(DEFAULT_SETTINGS));
  localStorage.setItem(LS.seeded, "true");
}

function getSettings(){
  const saved = JSON.parse(localStorage.getItem(LS.settings)) || {};
  return Object.assign({}, DEFAULT_SETTINGS, saved);
}

function getDeliveryZones(){
  const zones = getData(LS.deliveryZones);
  return zones.length ? zones : DEFAULT_DELIVERY_ZONES;
}
function deliveryFeeFor(state){
  const zones = getDeliveryZones();
  const match = zones.find(z => z.state === state);
  if(match) return match.fee;
  const fallback = zones.find(z => z.state === 'Others');
  return fallback ? fallback.fee : 0;
}

/* ---------------------------------------------------------------------
   3. TOAST NOTIFICATION
   --------------------------------------------------------------------- */
let toastTimer;
function showToast(msg, icon="circle-check"){
  const toast = document.getElementById('toast');
  toast.innerHTML = `<i class="fa-solid fa-${icon}"></i> ${msg}`;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove('show'), 3200);
}

/* ---------------------------------------------------------------------
   4. RENDER: PRODUCT CARDS
   --------------------------------------------------------------------- */
function productCardHTML(p){
  const hasDiscount = p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price;
  const pct = hasDiscount ? Math.round(100 - (p.discountPrice/p.price*100)) : 0;
  return `
  <div class="product-card" data-id="${p.id}">
    <div class="product-thumb">
      ${hasDiscount ? `<span class="badge discount">-${pct}%</span>`:''}
      ${p.featured ? `<span class="badge featured">Featured</span>`:''}
      ${p.bestSeller ? `<span class="badge bestseller" style="left:auto;right:12px;">Best Seller</span>`:''}
      <img src="${p.image}" alt="${p.name}" loading="lazy">
    </div>
    <div class="product-body">
      <h3>${p.name}</h3>
      <p class="product-desc">${p.shortDesc}</p>
      <div class="price-row">
        <span class="price-now">${currency(hasDiscount ? p.discountPrice : p.price)}</span>
        ${hasDiscount ? `<span class="price-old">${currency(p.price)}</span>`:''}
      </div>
      <div class="card-actions">
        <button class="btn btn-outline ripple view-details-btn" data-id="${p.id}">View Details</button>
        <button class="btn btn-primary ripple add-cart-btn" data-id="${p.id}"><i class="fa-solid fa-bag-shopping"></i> Add</button>
      </div>
    </div>
  </div>`;
}

function renderProductGrids(){
  renderShopGrid();
}

function renderShopGrid(){
  const products = getData(LS.products);
  const search = (document.getElementById('shopSearch')?.value || '').toLowerCase();
  const category = document.getElementById('categoryFilter')?.value || 'all';
  const sort = document.getElementById('sortFilter')?.value || 'default';

  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(search) &&
    (category === 'all' || p.category === category)
  );

  if(sort === 'price-asc') filtered.sort((a,b)=> (a.discountPrice||a.price) - (b.discountPrice||b.price));
  if(sort === 'price-desc') filtered.sort((a,b)=> (b.discountPrice||b.price) - (a.discountPrice||a.price));
  if(sort === 'name') filtered.sort((a,b)=> a.name.localeCompare(b.name));

  const grid = document.getElementById('shopGrid');
  const emptyState = document.getElementById('shopEmpty');
  grid.innerHTML = filtered.map(productCardHTML).join('');
  emptyState.style.display = filtered.length ? 'none' : 'block';
  observeFadeEls();
}

/* ---------------------------------------------------------------------
   5. RENDER: COMBOS
   --------------------------------------------------------------------- */
function renderCombos(){
  const combos = getData(LS.combos);
  document.getElementById('comboGrid').innerHTML = combos.map(c=>{
    const saved = c.originalPrice - c.promoPrice;
    const productsList = Array.isArray(c.products) ? c.products.join(', ') : c.products;
    return `
    <div class="combo-card">
      <div class="combo-img">
        <img src="${c.image}" alt="${c.name}">
        <span class="combo-save">Save ${currency(saved)}</span>
      </div>
      <div class="combo-body">
        <h3>${c.name}</h3>
        <p class="combo-products"><i class="fa-solid fa-layer-group"></i> ${productsList}</p>
        <div class="combo-prices">
          <span class="price-now">${currency(c.promoPrice)}</span>
          <span class="price-old">${currency(c.originalPrice)}</span>
        </div>
        <button class="btn btn-primary ripple buy-combo-btn" data-id="${c.id}">Buy Combo</button>
      </div>
    </div>`;
  }).join('');
  observeFadeEls();
}

/* ---------------------------------------------------------------------
   6. RENDER: TRANSFORMATION GALLERY (from testimonials with before/after)
   --------------------------------------------------------------------- */
function renderTransformGallery(){
  const testimonials = getData(LS.testimonials).slice(0,6);
  document.getElementById('transformGrid').innerHTML = testimonials.map(t => `
    <div class="transform-card">
      <div class="ba-images">
        <div><img src="${t.before}" alt="Before"><span>Before</span></div>
        <div><img src="${t.after}" alt="After"><span>After</span></div>
      </div>
      <div class="transform-caption">
        <strong>${t.name}</strong>
        <p>${t.review.slice(0,60)}${t.review.length>60?'...':''}</p>
      </div>
    </div>`).join('');
  observeFadeEls();
}

/* ---------------------------------------------------------------------
   7. RENDER: PROMO BANNER + COUNTDOWN
   --------------------------------------------------------------------- */
let countdownInterval;
function renderPromoBanner(){
  const promos = getData(LS.promos);
  const active = promos.find(p => p.enabled);
  const el = document.getElementById('promoBanner');
  clearInterval(countdownInterval);
  if(!active){ el.innerHTML=''; return; }

  el.innerHTML = `
    <div class="promo-card">
      <img src="${active.image}" alt="${active.title}">
      <div class="promo-text">
        <h3>${active.title}</h3>
        <p>${active.description}</p>
        ${active.endDate ? `<div class="promo-countdown" id="promoCountdown">
          <div><span id="cdDays">00</span><small>Days</small></div>
          <div><span id="cdHours">00</span><small>Hrs</small></div>
          <div><span id="cdMins">00</span><small>Min</small></div>
          <div><span id="cdSecs">00</span><small>Sec</small></div>
        </div>`:''}
        <a href="#shop" class="btn btn-primary ripple">${active.buttonText}</a>
      </div>
    </div>`;

  if(active.endDate){
    const endTime = new Date(active.endDate + "T23:59:59").getTime();
    const tick = ()=>{
      const now = Date.now();
      let diff = endTime - now;
      if(diff < 0) diff = 0;
      const d = Math.floor(diff/86400000);
      const h = Math.floor((diff%86400000)/3600000);
      const m = Math.floor((diff%3600000)/60000);
      const s = Math.floor((diff%60000)/1000);
      const set=(id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=String(v).padStart(2,'0'); };
      set('cdDays',d); set('cdHours',h); set('cdMins',m); set('cdSecs',s);
    };
    tick();
    countdownInterval = setInterval(tick, 1000);
  }
}

/* ---------------------------------------------------------------------
   8. RENDER: TESTIMONIALS SLIDER
   --------------------------------------------------------------------- */
let testiIndex = 0, testiAutoTimer;
function renderTestimonials(){
  const testimonials = getData(LS.testimonials);
  const track = document.getElementById('testimonialTrack');
  const dots = document.getElementById('testiDots');
  track.innerHTML = testimonials.map((t,i)=> `
    <div class="testimonial-slide ${i===0?'active':''}" data-i="${i}">
      <img class="testi-photo" src="${t.photo}" alt="${t.name}">
      <div>
        <div class="testi-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</div>
        <p class="testi-text">"${t.review}"</p>
        <p class="testi-name">${t.name}</p>
      </div>
    </div>`).join('');
  dots.innerHTML = testimonials.map((_,i)=> `<span data-i="${i}" class="${i===0?'active':''}"></span>`).join('');
  testiIndex = 0;
  bindTestimonialControls(testimonials.length);
  startTestiAuto();
}
function showTesti(i, total){
  document.querySelectorAll('.testimonial-slide').forEach((s,idx)=> s.classList.toggle('active', idx===i));
  document.querySelectorAll('#testiDots span').forEach((d,idx)=> d.classList.toggle('active', idx===i));
  testiIndex = i;
}
function bindTestimonialControls(total){
  document.getElementById('testiNext').onclick = ()=>{ showTesti((testiIndex+1)%total, total); resetTestiAuto(total); };
  document.getElementById('testiPrev').onclick = ()=>{ showTesti((testiIndex-1+total)%total, total); resetTestiAuto(total); };
  document.querySelectorAll('#testiDots span').forEach(dot=>{
    dot.onclick = ()=>{ showTesti(parseInt(dot.dataset.i), total); resetTestiAuto(total); };
  });
}
function startTestiAuto(){
  const total = getData(LS.testimonials).length;
  clearInterval(testiAutoTimer);
  testiAutoTimer = setInterval(()=> showTesti((testiIndex+1)%total, total), 5500);
}
function resetTestiAuto(total){ clearInterval(testiAutoTimer); testiAutoTimer = setInterval(()=> showTesti((testiIndex+1)%total, total), 5500); }

/* ---------------------------------------------------------------------
   9. RENDER: FAQ ACCORDION
   --------------------------------------------------------------------- */
function renderFAQ(){
  const list = document.getElementById('faqList');
  list.innerHTML = SAMPLE_FAQS.map((f,i)=> `
    <div class="faq-item" data-i="${i}">
      <div class="faq-question"><span>${f.q}</span><i class="fa-solid fa-plus"></i></div>
      <div class="faq-answer"><p>${f.a}</p></div>
    </div>`).join('');
  list.querySelectorAll('.faq-item').forEach(item=>{
    item.querySelector('.faq-question').addEventListener('click', ()=>{
      const isOpen = item.classList.contains('open');
      list.querySelectorAll('.faq-item').forEach(i=> i.classList.remove('open'));
      if(!isOpen) item.classList.add('open');
    });
  });
}

/* ---------------------------------------------------------------------
   10. RENDER: INSTAGRAM GRID + HERO SLIDER
   --------------------------------------------------------------------- */
function renderInstaGrid(){
  const products = getData(LS.products);
  const el = document.getElementById('instaGrid');
  if(!products.length){ el.innerHTML = ''; return; }
  const pics = products.slice(0,6).map(p=> p.image);
  el.innerHTML = pics.map(src=> `
    <div class="insta-item"><img src="${src}" alt="Instagram post" loading="lazy"></div>`).join('');
}
let heroIndex = 0, heroTimer;
function renderHeroSlider(){
  const el = document.getElementById('heroSlider');
  const slides = ['hero-1.jpeg', 'hero-2.jpeg','hero-3.jpeg'];

  el.innerHTML = slides.map((src,i)=> `
    <div class="hero-slide ${i===0?'active':''}" style="background-image:url('${src}')"></div>`).join('');
  clearInterval(heroTimer);
  heroTimer = setInterval(()=>{
    const allSlides = el.querySelectorAll('.hero-slide');
    allSlides[heroIndex].classList.remove('active');
    heroIndex = (heroIndex+1) % allSlides.length;
    allSlides[heroIndex].classList.add('active');
  }, 4000);
}

/* ---------------------------------------------------------------------
   11. PRODUCT DETAILS MODAL
   --------------------------------------------------------------------- */
let currentModalProduct = null, modalQty = 1, modalGalleryIndex = 0;
function openProductModal(id){
  const product = getData(LS.products).find(p=>p.id===id);
  if(!product) return;
  currentModalProduct = product; modalQty = 1; modalGalleryIndex = 0;
  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const gallery = product.gallery && product.gallery.length ? product.gallery : [product.image];

  document.getElementById('productModalBody').innerHTML = `
    <div class="pm-layout">
      <div>
        <div class="pm-gallery-main"><img id="pmMainImg" src="${gallery[0]}" alt="${product.name}"></div>
        <div class="pm-gallery-thumbs" id="pmThumbs">
          ${gallery.map((g,i)=> `<img src="${g}" class="${i===0?'active':''}" data-i="${i}">`).join('')}
        </div>
      </div>
      <div class="pm-info">
        <h2>${product.name}</h2>
        <p>${product.shortDesc}</p>
        <div class="price-row">
          <span class="price-now">${currency(hasDiscount?product.discountPrice:product.price)}</span>
          ${hasDiscount ? `<span class="price-old">${currency(product.price)}</span>`:''}
        </div>
        <div class="pm-section"><h4>Description</h4><p>${product.fullDesc||product.shortDesc}</p></div>
        ${product.benefits && product.benefits.length ? `<div class="pm-section"><h4>Benefits</h4><ul>${product.benefits.map(b=>`<li>${b}</li>`).join('')}</ul></div>`:''}
        ${product.ingredients && product.ingredients.length ? `<div class="pm-section"><h4>Ingredients</h4><p>${product.ingredients.join(', ')}</p></div>`:''}
        ${product.usage ? `<div class="pm-section"><h4>Usage</h4><p>${product.usage}</p></div>`:''}
        <div class="qty-selector">
          <button id="pmQtyMinus">−</button>
          <span id="pmQtyVal">1</span>
          <button id="pmQtyPlus">+</button>
        </div>
        <div class="pm-actions">
          <button class="btn btn-outline ripple" id="pmAddCart">Add to Cart</button>
          <button class="btn btn-primary ripple" id="pmBuyNow">Buy Now</button>
        </div>
      </div>
    </div>`;

  document.getElementById('pmThumbs').addEventListener('click', e=>{
    if(e.target.tagName === 'IMG'){
      document.getElementById('pmMainImg').src = e.target.src;
      document.querySelectorAll('#pmThumbs img').forEach(t=>t.classList.remove('active'));
      e.target.classList.add('active');
    }
  });
  document.getElementById('pmQtyMinus').onclick = ()=>{ if(modalQty>1){ modalQty--; document.getElementById('pmQtyVal').textContent=modalQty; } };
  document.getElementById('pmQtyPlus').onclick = ()=>{ modalQty++; document.getElementById('pmQtyVal').textContent=modalQty; };
  document.getElementById('pmAddCart').onclick = ()=>{ addToCart(product.id, modalQty); };
  document.getElementById('pmBuyNow').onclick = ()=>{ addToCart(product.id, modalQty); closeModal('productModalOverlay'); openCart(); };

  openModal('productModalOverlay');
}

/* ---------------------------------------------------------------------
   12. CART
   --------------------------------------------------------------------- */
function getCart(){ return getData(LS.cart); }
function saveCart(cart){ setData(LS.cart, cart); renderCartUI(); }

function addToCart(productId, qty=1){
  const products = getData(LS.products);
  const product = products.find(p=>p.id===productId);
  if(!product) return;
  const cart = getCart();
  const existing = cart.find(c=>c.id===productId);
  if(existing) existing.qty += qty;
  else cart.push({ id:product.id, name:product.name, image:product.image,
    price: (product.discountPrice && product.discountPrice>0) ? product.discountPrice : product.price, qty });
  saveCart(cart);
  showToast(`${product.name} added to cart`, 'bag-shopping');
}

function addComboToCart(comboId){
  const combo = getData(LS.combos).find(c=>c.id===comboId);
  if(!combo) return;
  const cart = getCart();
  const existing = cart.find(c=>c.id===combo.id && c.isCombo);
  if(existing) existing.qty += 1;
  else cart.push({ id:combo.id, name:combo.name, image:combo.image, price:combo.promoPrice, qty:1, isCombo:true });
  saveCart(cart);
  showToast(`${combo.name} added to cart`, 'gift');
}

function removeFromCart(id){ saveCart(getCart().filter(c=>c.id!==id)); }
function changeQty(id, delta){
  const cart = getCart();
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){ removeFromCart(id); return; }
  saveCart(cart);
}
function cartTotal(){ return getCart().reduce((sum,c)=> sum + c.price*c.qty, 0); }

function renderCartUI(){
  const cart = getCart();
  document.getElementById('cartCount').textContent = cart.reduce((s,c)=>s+c.qty,0);
  const container = document.getElementById('cartItems');
  container.innerHTML = cart.length ? cart.map(c=>`
    <div class="cart-item" data-id="${c.id}">
      <img src="${c.image}" alt="${c.name}">
      <div class="cart-item-info">
        <h4>${c.name}</h4>
        <span class="price">${currency(c.price)}</span>
        <div class="cart-item-qty">
          <button class="qty-minus" data-id="${c.id}">−</button>
          <span>${c.qty}</span>
          <button class="qty-plus" data-id="${c.id}">+</button>
        </div>
        <div class="cart-item-remove" data-id="${c.id}">Remove</div>
      </div>
    </div>`).join('') : `<div class="cart-empty"><i class="fa-solid fa-bag-shopping" style="font-size:32px;opacity:0.3;"></i><p>Your cart is empty.</p></div>`;
  document.getElementById('cartTotal').textContent = currency(cartTotal());
}

/* ---------------------------------------------------------------------
   13. CHECKOUT
   --------------------------------------------------------------------- */
function populateStateSelect(){
  const select = document.getElementById('checkoutState');
  const zones = getDeliveryZones();
  select.innerHTML = `<option value="">Select State</option>` + zones.map(z=>`<option value="${z.state}">${z.state}</option>`).join('');
}

function renderCheckoutSummary(){
  const cart = getCart();
  const container = document.getElementById('checkoutItems');
  container.innerHTML = cart.map(c=> `<div class="checkout-line"><span>${c.name} × ${c.qty}</span><span>${currency(c.price*c.qty)}</span></div>`).join('');
  const subtotal = cartTotal();
  const state = document.getElementById('checkoutState').value;
  const delivery = state ? deliveryFeeFor(state) : 0;
  document.getElementById('checkoutSubtotal').textContent = currency(subtotal);
  document.getElementById('checkoutDelivery').textContent = currency(delivery);
  document.getElementById('checkoutGrandTotal').textContent = currency(subtotal + delivery);
}

function placeOrder(customer){
  const cart = getCart();
  const state = customer.state;
  const delivery = deliveryFeeFor(state);
  const subtotal = cartTotal();
  const order = {
    id: "CV-" + Date.now().toString().slice(-8),
    customer, items: cart, subtotal, delivery, total: subtotal+delivery,
    status:"Pending", date: new Date().toISOString(),
    receivedNotified:false, shippedNotified:false
  };
  const orders = getData(LS.orders);
  orders.unshift(order);
  setData(LS.orders, orders);
  saveCart([]);
  return order;
}

/* ---------------------------------------------------------------------
   14. CONSULTATION FORM
   --------------------------------------------------------------------- */
function bindConsultationForm(){
  document.getElementById('consultForm').addEventListener('submit', e=>{
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    data.id = uid('cons');
    data.status = 'New';
    data.date = new Date().toISOString();
    const list = getData(LS.consultations);
    list.unshift(data);
    setData(LS.consultations, list);
    showToast("Consultation submitted! We'll reach out within 24 hours.", 'clipboard-check');
    form.reset();
  });
}

/* ---------------------------------------------------------------------
   15. MODAL HELPERS
   --------------------------------------------------------------------- */
function openModal(id){ document.getElementById(id).classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(id){ document.getElementById(id).classList.remove('open'); document.body.style.overflow=''; }

/* ---------------------------------------------------------------------
   16. UI CHROME: nav, mobile menu, scroll, animations, ripple
   --------------------------------------------------------------------- */
function bindUIChrome(){
  // sticky navbar shadow
  window.addEventListener('scroll', ()=>{
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
    document.getElementById('scrollTop').classList.toggle('show', window.scrollY > 500);
  });
  document.getElementById('scrollTop').addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

  // mobile menu
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  document.getElementById('menuToggle').addEventListener('click', ()=>{ mobileMenu.classList.add('open'); overlay.classList.add('show'); });
  overlay.addEventListener('click', ()=>{ mobileMenu.classList.remove('open'); overlay.classList.remove('show'); });
  document.querySelectorAll('.mobile-link').forEach(l=> l.addEventListener('click', ()=>{ mobileMenu.classList.remove('open'); overlay.classList.remove('show'); }));

  // search panel
  const searchPanel = document.getElementById('searchPanel');
  document.getElementById('searchToggle').addEventListener('click', ()=>{
    searchPanel.classList.toggle('open');
    if(searchPanel.classList.contains('open')) document.getElementById('searchInput').focus();
  });
  document.getElementById('searchClose').addEventListener('click', ()=> searchPanel.classList.remove('open'));
  document.getElementById('searchInput').addEventListener('input', e=>{
    document.getElementById('shopSearch').value = e.target.value;
    renderShopGrid();
    document.getElementById('shop').scrollIntoView({behavior:'smooth'});
  });

  // ripple effect
  document.addEventListener('click', e=>{
    const btn = e.target.closest('.ripple');
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple-effect';
    ripple.style.width = ripple.style.height = size+'px';
    ripple.style.left = (e.clientX - rect.left - size/2)+'px';
    ripple.style.top = (e.clientY - rect.top - size/2)+'px';
    btn.appendChild(ripple);
    setTimeout(()=> ripple.remove(), 650);
  });

  // smooth nav link scroll offset handled by CSS scroll-behavior; close mobile after click already bound
}

/* fade-up on scroll observer */
let fadeObserver;
function observeFadeEls(){
  if(!fadeObserver){
    fadeObserver = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('visible'); fadeObserver.unobserve(entry.target); } });
    }, { threshold:0.12 });
  }
  document.querySelectorAll('.fade-up:not(.visible)').forEach(el=> fadeObserver.observe(el));
}

/* animated counters */
function animateCounters(){
  const counters = document.querySelectorAll('.counter');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let cur = 0;
        const step = Math.max(1, Math.ceil(target/60));
        const tick = ()=>{
          cur += step;
          if(cur >= target){ el.textContent = target.toLocaleString(); return; }
          el.textContent = cur.toLocaleString();
          requestAnimationFrame(tick);
        };
        tick();
        obs.unobserve(el);
      }
    });
  }, { threshold:0.5 });
  counters.forEach(c=> obs.observe(c));
}

/* ---------------------------------------------------------------------
   17. EVENT DELEGATION: product/cart/combo buttons
   --------------------------------------------------------------------- */
function bindDelegatedEvents(){
  document.addEventListener('click', e=>{
    const viewBtn = e.target.closest('.view-details-btn');
    if(viewBtn){ openProductModal(viewBtn.dataset.id); return; }

    const addBtn = e.target.closest('.add-cart-btn');
    if(addBtn){ addToCart(addBtn.dataset.id, 1); return; }

    const comboBtn = e.target.closest('.buy-combo-btn');
    if(comboBtn){ addComboToCart(comboBtn.dataset.id); openCart(); return; }

    const productCard = e.target.closest('.product-card');
    if(productCard && !e.target.closest('button')){ openProductModal(productCard.dataset.id); return; }

    if(e.target.closest('.qty-minus')){ changeQty(e.target.closest('.qty-minus').dataset.id, -1); return; }
    if(e.target.closest('.qty-plus')){ changeQty(e.target.closest('.qty-plus').dataset.id, 1); return; }
    if(e.target.closest('.cart-item-remove')){ removeFromCart(e.target.closest('.cart-item-remove').dataset.id); return; }
  });
}

/* ---------------------------------------------------------------------
   18. CART DRAWER + CHECKOUT BINDINGS
   --------------------------------------------------------------------- */
function bindCartAndCheckout(){
  const drawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  document.getElementById('cartToggle').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  document.getElementById('checkoutBtn').addEventListener('click', ()=>{
    if(!getCart().length){ showToast("Your cart is empty", 'circle-exclamation'); return; }
    closeCart();
    renderCheckoutSummary();
    openModal('checkoutOverlay');
  });
  document.getElementById('checkoutClose').addEventListener('click', ()=> closeModal('checkoutOverlay'));
  document.getElementById('checkoutState').addEventListener('change', renderCheckoutSummary);

  document.getElementById('paystackBtn').addEventListener('click', ()=>{
    const form = document.getElementById('checkoutForm');
    if(!form.checkValidity()){ form.reportValidity(); return; }
    const customer = Object.fromEntries(new FormData(form).entries());
    const order = placeOrder(customer);
    closeModal('checkoutOverlay');
    form.reset();
    showToast(`Payment successful! Order ${order.id} confirmed.`, 'circle-check');
    renderAdminStats();
  });

  document.getElementById('newsletterForm').addEventListener('submit', e=>{ e.preventDefault(); showToast("Subscribed! Welcome to the BodiedRight Circle."); e.target.reset(); });
  document.getElementById('footerNewsletter').addEventListener('submit', e=>{ e.preventDefault(); showToast("Subscribed! Welcome to the BodiedRight Circle."); e.target.reset(); });
  document.getElementById('contactForm').addEventListener('submit', e=>{ e.preventDefault(); showToast("Message sent! We'll get back to you soon."); e.target.reset(); });
}
function openCart(){ document.getElementById('cartDrawer').classList.add('open'); document.getElementById('cartOverlay').classList.add('show'); }
function closeCart(){ document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('show'); }

/* ---------------------------------------------------------------------
   19. GENERIC MODAL CLOSE BINDINGS
   --------------------------------------------------------------------- */
function bindModalCloseButtons(){
  const map = {
    productModalClose:'productModalOverlay', checkoutClose:'checkoutOverlay',
    adminLoginClose:'adminLoginOverlay', productFormClose:'productFormOverlay',
    comboFormClose:'comboFormOverlay', promoFormClose:'promoFormOverlay',
    testimonialFormClose:'testimonialFormOverlay', deliveryZoneFormClose:'deliveryZoneFormOverlay',
    consultationDetailClose:'consultationDetailOverlay'
  };
  Object.entries(map).forEach(([btnId, overlayId])=>{
    const btn = document.getElementById(btnId);
    if(btn) btn.addEventListener('click', ()=> closeModal(overlayId));
  });
  document.querySelectorAll('.modal-overlay').forEach(ov=>{
    ov.addEventListener('click', e=>{ if(e.target === ov) closeModal(ov.id); });
  });
}

/* ---------------------------------------------------------------------
   20. CONTACT INFO FROM SETTINGS
   --------------------------------------------------------------------- */
function waLink(number){ return `https://wa.me/${number.replace(/[^0-9]/g,'').replace(/^0/,'234')}`; }

function applySettingsToDOM(){
  const s = getSettings();
  document.title = `${s.logo} — ${s.heroHeading}`;
  document.getElementById('footerText').textContent = s.footerText;

  // Contact section (text + working links)
  document.getElementById('contactWhatsapp').querySelector('span').textContent = `WhatsApp: ${s.whatsapp}`;
  document.getElementById('contactWhatsapp').href = waLink(s.whatsapp);
  document.getElementById('contactInstagram').querySelector('span').textContent = '@bodiedrightby_cheedah';
  document.getElementById('contactInstagram').href = s.instagram;
  document.getElementById('contactTiktok').querySelector('span').textContent = '@bodiedright_by_cheedah';
  document.getElementById('contactTiktok').href = s.tiktok;
  document.getElementById('contactEmail').querySelector('span').textContent = s.email;
  document.getElementById('contactEmail').href = `mailto:${s.email}`;
  document.getElementById('contactPhone').querySelector('span').textContent = s.phone;
  document.getElementById('contactPhone').href = `tel:${s.phone.replace(/[^0-9+]/g,'')}`;

  // Footer social icons
  document.getElementById('footerInstagram').href = s.instagram;
  document.getElementById('footerWhatsapp').href = waLink(s.whatsapp);
  document.getElementById('footerTiktok').href = s.tiktok;
}

/* ---------------------------------------------------------------------
   20b. POLICY MODAL
   --------------------------------------------------------------------- */
function bindPolicyLinks(){
  const map = {
    policyRefund:{ title:'Refund Policy', key:'refundPolicy' },
    policyDelivery:{ title:'Delivery Policy', key:'deliveryPolicy' },
    policyPrivacy:{ title:'Privacy Policy', key:'privacyPolicy' },
    policyTerms:{ title:'Terms & Conditions', key:'termsPolicy' }
  };
  Object.entries(map).forEach(([id, cfg])=>{
    const link = document.getElementById(id);
    if(!link) return;
    link.addEventListener('click', e=>{
      e.preventDefault();
      const s = getSettings();
      document.getElementById('policyModalTitle').textContent = cfg.title;
      document.getElementById('policyModalBody').textContent = s[cfg.key] || 'This policy has not been added yet.';
      openModal('policyOverlay');
    });
  });
  const closeBtn = document.getElementById('policyClose');
  if(closeBtn) closeBtn.addEventListener('click', ()=> closeModal('policyOverlay'));
}

/* ---------------------------------------------------------------------
   21. ADMIN: LOGIN / LOGOUT
   --------------------------------------------------------------------- */
function bindAdminAccess(){
  document.getElementById('adminEntryLink').addEventListener('click', e=>{ e.preventDefault(); openModal('adminLoginOverlay'); });
  document.getElementById('mobileAdminLink').addEventListener('click', e=>{ e.preventDefault(); document.getElementById('mobileMenu').classList.remove('open'); document.getElementById('overlay').classList.remove('show'); openModal('adminLoginOverlay'); });

  document.getElementById('adminLoginForm').addEventListener('submit', e=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const errorEl = document.getElementById('adminLoginError');
    if(data.username === ADMIN_USER && data.password === ADMIN_PASS){
      errorEl.classList.remove('show');
      closeModal('adminLoginOverlay');
      e.target.reset();
      openAdminPanel();
    } else {
      errorEl.classList.add('show');
    }
  });

  document.getElementById('adminLogout').addEventListener('click', ()=>{
    document.getElementById('adminPanel').classList.remove('open');
    document.body.style.overflow = '';
    closeAdminMobileSidebar();
  });
}
function openAdminPanel(){
  document.getElementById('adminPanel').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderAdminStats(); renderAdminProducts(); renderAdminCombos(); renderAdminPromos();
  renderAdminTestimonials(); renderAdminConsultations(); renderAdminOrders();
  renderAdminDeliveryZones(); loadSettingsForm();
}

/* ---------------------------------------------------------------------
   22. ADMIN: TAB NAVIGATION
   --------------------------------------------------------------------- */
function bindAdminTabs(){
  document.querySelectorAll('.admin-nav-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.admin-nav-btn').forEach(b=> b.classList.remove('active'));
      document.querySelectorAll('.admin-tab').forEach(t=> t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
      closeAdminMobileSidebar();
    });
  });
}

function openAdminMobileSidebar(){
  document.getElementById('adminSidebar').classList.add('open');
  document.getElementById('adminSidebarOverlay').classList.add('show');
}
function closeAdminMobileSidebar(){
  document.getElementById('adminSidebar').classList.remove('open');
  document.getElementById('adminSidebarOverlay').classList.remove('show');
}
function bindAdminMobileSidebar(){
  document.getElementById('adminMobileToggle').addEventListener('click', openAdminMobileSidebar);
  document.getElementById('adminSidebarOverlay').addEventListener('click', closeAdminMobileSidebar);
}

/* ---------------------------------------------------------------------
   23. ADMIN: DASHBOARD STATS
   --------------------------------------------------------------------- */
function renderAdminStats(){
  document.getElementById('statProducts').textContent = getData(LS.products).length;
  document.getElementById('statOrders').textContent = getData(LS.orders).length;
  document.getElementById('statConsultations').textContent = getData(LS.consultations).length;
  document.getElementById('statCombos').textContent = getData(LS.combos).length;
  const revenue = getData(LS.orders).reduce((s,o)=> s + o.total, 0);
  document.getElementById('statRevenue').textContent = currency(revenue);

  const pendingNotify = getData(LS.orders).filter(o=>
    o.status !== 'Cancelled' &&
    (!o.receivedNotified || ((o.status==='Shipped' || o.status==='Delivered') && !o.shippedNotified))
  ).length;
  document.getElementById('statPendingNotify').textContent = pendingNotify;
}

/* ---------------------------------------------------------------------
   24. ADMIN: IMAGE FILE → BASE64 PREVIEW HELPER
   --------------------------------------------------------------------- */
function bindImagePreview(inputName, previewId, form){
  const input = form.querySelector(`[name="${inputName}"]`);
  const preview = document.getElementById(previewId);
  input.addEventListener('change', ()=>{
    const file = input.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = e=>{ preview.src = e.target.result; preview.style.display='block'; preview.dataset.base64 = e.target.result; };
    reader.readAsDataURL(file);
  });
}

/* ---------------------------------------------------------------------
   25. ADMIN: PRODUCT CRUD
   --------------------------------------------------------------------- */
function renderAdminProducts(){
  const products = getData(LS.products);
  document.querySelector('#productsTable tbody').innerHTML = products.map(p=> `
    <tr data-id="${p.id}">
      <td><img src="${p.image}" alt=""></td>
      <td>${p.name}</td>
      <td style="text-transform:capitalize;">${p.category}</td>
      <td>${currency(p.price)}</td>
      <td>${p.discountPrice ? currency(p.discountPrice) : '—'}</td>
      <td><span class="pill ${p.featured?'yes':'no'}">${p.featured?'Yes':'No'}</span></td>
      <td><span class="pill ${p.bestSeller?'yes':'no'}">${p.bestSeller?'Yes':'No'}</span></td>
      <td>
        <button class="table-action edit" data-edit="${p.id}">Edit</button>
        <button class="table-action delete" data-delete="${p.id}">Delete</button>
      </td>
    </tr>`).join('');
}

function openProductForm(product=null){
  const form = document.getElementById('productForm');
  form.reset();
  document.getElementById('productImgPreview').style.display='none';
  document.getElementById('productFormTitle').textContent = product ? 'Edit Product' : 'Add Product';
  form.id.value = product ? product.id : '';
  if(product){
    form.name.value = product.name;
    form.shortDesc.value = product.shortDesc;
    form.fullDesc.value = product.fullDesc || '';
    form.benefits.value = (product.benefits||[]).join(', ');
    form.ingredients.value = (product.ingredients||[]).join(', ');
    form.usage.value = product.usage || '';
    form.price.value = product.price;
    form.discountPrice.value = product.discountPrice || '';
    form.category.value = product.category;
    form.featured.checked = !!product.featured;
    form.bestSeller.checked = !!product.bestSeller;
    if(product.image){ const pv=document.getElementById('productImgPreview'); pv.src=product.image; pv.style.display='block'; pv.dataset.base64 = product.image; }
  }
  openModal('productFormOverlay');
}

function bindProductForm(){
  const form = document.getElementById('productForm');
  bindImagePreview('imageFile', 'productImgPreview', form);
  document.getElementById('addProductBtn').addEventListener('click', ()=> openProductForm());

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const products = getData(LS.products);
    const preview = document.getElementById('productImgPreview');
    const imageSrc = preview.dataset.base64 || (data.id ? products.find(p=>p.id===data.id)?.image : img('product'+Date.now()));

    const productObj = {
      id: data.id || uid('p'),
      name: data.name, shortDesc: data.shortDesc, fullDesc: data.fullDesc,
      benefits: data.benefits ? data.benefits.split(',').map(s=>s.trim()).filter(Boolean) : [],
      ingredients: data.ingredients ? data.ingredients.split(',').map(s=>s.trim()).filter(Boolean) : [],
      usage: data.usage, price: Number(data.price), discountPrice: data.discountPrice ? Number(data.discountPrice) : 0,
      category: data.category, featured: form.featured.checked, bestSeller: form.bestSeller.checked,
      image: imageSrc, gallery: [imageSrc]
    };

    if(data.id){
      const idx = products.findIndex(p=>p.id===data.id);
      productObj.gallery = products[idx].gallery && products[idx].gallery.length>1 ? products[idx].gallery : [imageSrc];
      products[idx] = productObj;
    } else {
      products.push(productObj);
    }
    setData(LS.products, products);
    closeModal('productFormOverlay');
    renderAdminProducts(); renderProductGrids(); renderAdminStats();
    showToast(data.id ? "Product updated" : "Product added");
  });
}

function bindAdminTableActions(){
  document.addEventListener('click', e=>{
    // Products
    const editP = e.target.closest('[data-edit]');
    const delP = e.target.closest('[data-delete]');
    if(editP && editP.closest('#productsTable')){ openProductForm(getData(LS.products).find(p=>p.id===editP.dataset.edit)); return; }
    if(delP && delP.closest('#productsTable')){
      if(confirm('Delete this product?')){
        setData(LS.products, getData(LS.products).filter(p=>p.id!==delP.dataset.delete));
        renderAdminProducts(); renderProductGrids(); renderAdminStats();
        showToast('Product deleted', 'trash');
      }
      return;
    }
    // Combos
    if(editP && editP.closest('#combosTable')){ openComboForm(getData(LS.combos).find(c=>c.id===editP.dataset.edit)); return; }
    if(delP && delP.closest('#combosTable')){
      if(confirm('Delete this combo?')){
        setData(LS.combos, getData(LS.combos).filter(c=>c.id!==delP.dataset.delete));
        renderAdminCombos(); renderCombos(); renderAdminStats();
        showToast('Combo deleted', 'trash');
      }
      return;
    }
    // Promos
    if(editP && editP.closest('#promosTable')){ openPromoForm(getData(LS.promos).find(p=>p.id===editP.dataset.edit)); return; }
    if(delP && delP.closest('#promosTable')){
      if(confirm('Delete this banner?')){
        setData(LS.promos, getData(LS.promos).filter(p=>p.id!==delP.dataset.delete));
        renderAdminPromos(); renderPromoBanner();
        showToast('Banner deleted', 'trash');
      }
      return;
    }
    const togglePromo = e.target.closest('[data-toggle-promo]');
    if(togglePromo){
      const promos = getData(LS.promos);
      promos.forEach(p=> p.enabled = (p.id === togglePromo.dataset.togglePromo) ? !p.enabled : false);
      setData(LS.promos, promos);
      renderAdminPromos(); renderPromoBanner();
      return;
    }
    // Testimonials
    if(editP && editP.closest('#testimonialsTable')){ openTestimonialForm(getData(LS.testimonials).find(t=>t.id===editP.dataset.edit)); return; }
    if(delP && delP.closest('#testimonialsTable')){
      if(confirm('Delete this testimonial?')){
        setData(LS.testimonials, getData(LS.testimonials).filter(t=>t.id!==delP.dataset.delete));
        renderAdminTestimonials(); renderTestimonials(); renderTransformGallery();
        showToast('Testimonial deleted', 'trash');
      }
      return;
    }
    // Consultations
    const viewConsultBtn = e.target.closest('[data-view-consultation]');
    if(viewConsultBtn){
      openConsultationDetail(getData(LS.consultations).find(c=>c.id===viewConsultBtn.dataset.viewConsultation));
      return;
    }
    const contactedBtn = e.target.closest('[data-contacted]');
    if(contactedBtn){
      const list = getData(LS.consultations);
      const item = list.find(c=>c.id===contactedBtn.dataset.contacted);
      if(item) item.status = item.status === 'Contacted' ? 'New' : 'Contacted';
      setData(LS.consultations, list);
      renderAdminConsultations();
      return;
    }
    if(delP && delP.closest('#consultationsTable')){
      if(confirm('Delete this consultation request?')){
        setData(LS.consultations, getData(LS.consultations).filter(c=>c.id!==delP.dataset.delete));
        renderAdminConsultations(); renderAdminStats();
        showToast('Consultation deleted', 'trash');
      }
      return;
    }
    // Delivery Zones
    const editZone = e.target.closest('[data-edit-zone]');
    const delZone = e.target.closest('[data-delete-zone]');
    if(editZone){ openDeliveryZoneForm(getDeliveryZones().find(z=>z.id===editZone.dataset.editZone)); return; }
    if(delZone){
      if(confirm('Delete this delivery zone? Customers in this state will fall back to the "Others" fee at checkout.')){
        setData(LS.deliveryZones, getDeliveryZones().filter(z=>z.id!==delZone.dataset.deleteZone));
        renderAdminDeliveryZones();
        populateStateSelect();
        showToast('Delivery zone deleted', 'trash');
      }
      return;
    }
    // Order WhatsApp notifications
    const notifyReceivedBtn = e.target.closest('[data-notify-received]');
    if(notifyReceivedBtn){
      const orders = getData(LS.orders);
      const order = orders.find(o=>o.id===notifyReceivedBtn.dataset.notifyReceived);
      if(order){
        const message = `Hi ${order.customer.name}, thank you for your order from BodiedRight by Cheedah! 💜\n\nOrder ${order.id} has been received and total is ${currency(order.total)}. We'll let you know as soon as it's shipped.`;
        window.open(buildWhatsAppLink(order.customer.phone, message), '_blank');
        order.receivedNotified = true;
        setData(LS.orders, orders);
        renderAdminOrders();
      }
      return;
    }
    const notifyShippedBtn = e.target.closest('[data-notify-shipped]');
    if(notifyShippedBtn){
      const orders = getData(LS.orders);
      const order = orders.find(o=>o.id===notifyShippedBtn.dataset.notifyShipped);
      if(order){
        const message = `Hi ${order.customer.name}, good news! Your BodiedRight by Cheedah order ${order.id} has been shipped and is on its way to you. Thank you for shopping with us! 💜`;
        window.open(buildWhatsAppLink(order.customer.phone, message), '_blank');
        order.shippedNotified = true;
        setData(LS.orders, orders);
        renderAdminOrders();
      }
      return;
    }
  });

  // Order status change
  document.addEventListener('change', e=>{
    const statusSelect = e.target.closest('.status-select');
    if(statusSelect){
      const orders = getData(LS.orders);
      const order = orders.find(o=>o.id===statusSelect.dataset.id);
      if(order){ order.status = statusSelect.value; setData(LS.orders, orders); renderAdminOrders(); showToast('Order status updated'); }
    }
  });
}

/* ---------------------------------------------------------------------
   26. ADMIN: COMBO CRUD
   --------------------------------------------------------------------- */
function renderAdminCombos(){
  const combos = getData(LS.combos);
  document.querySelector('#combosTable tbody').innerHTML = combos.map(c=> `
    <tr data-id="${c.id}">
      <td><img src="${c.image}" alt=""></td>
      <td>${c.name}</td>
      <td style="max-width:220px;">${Array.isArray(c.products)?c.products.join(', '):c.products}</td>
      <td>${currency(c.originalPrice)}</td>
      <td>${currency(c.promoPrice)}</td>
      <td>
        <button class="table-action edit" data-edit="${c.id}">Edit</button>
        <button class="table-action delete" data-delete="${c.id}">Delete</button>
      </td>
    </tr>`).join('');
}
function openComboForm(combo=null){
  const form = document.getElementById('comboForm');
  form.reset();
  document.getElementById('comboImgPreview').style.display='none';
  document.getElementById('comboFormTitle').textContent = combo ? 'Edit Combo' : 'Add Combo';
  form.id.value = combo ? combo.id : '';
  if(combo){
    form.name.value = combo.name;
    form.products.value = Array.isArray(combo.products) ? combo.products.join(', ') : combo.products;
    form.originalPrice.value = combo.originalPrice;
    form.promoPrice.value = combo.promoPrice;
    const pv=document.getElementById('comboImgPreview'); pv.src=combo.image; pv.style.display='block'; pv.dataset.base64=combo.image;
  }
  openModal('comboFormOverlay');
}
function bindComboForm(){
  const form = document.getElementById('comboForm');
  bindImagePreview('imageFile', 'comboImgPreview', form);
  document.getElementById('addComboBtn').addEventListener('click', ()=> openComboForm());
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const combos = getData(LS.combos);
    const preview = document.getElementById('comboImgPreview');
    const imageSrc = preview.dataset.base64 || (data.id ? combos.find(c=>c.id===data.id)?.image : img('combo'+Date.now()));
    const comboObj = {
      id: data.id || uid('c'), name: data.name,
      products: data.products.split(',').map(s=>s.trim()).filter(Boolean),
      originalPrice: Number(data.originalPrice), promoPrice: Number(data.promoPrice), image: imageSrc
    };
    if(data.id){ const idx = combos.findIndex(c=>c.id===data.id); combos[idx] = comboObj; }
    else combos.push(comboObj);
    setData(LS.combos, combos);
    closeModal('comboFormOverlay');
    renderAdminCombos(); renderCombos(); renderAdminStats();
    showToast(data.id ? "Combo updated" : "Combo added");
  });
}

/* ---------------------------------------------------------------------
   27. ADMIN: PROMO CRUD
   --------------------------------------------------------------------- */
function renderAdminPromos(){
  const promos = getData(LS.promos);
  document.querySelector('#promosTable tbody').innerHTML = promos.map(p=> `
    <tr data-id="${p.id}">
      <td><img src="${p.image}" alt=""></td>
      <td>${p.title}</td>
      <td style="max-width:220px;">${p.description}</td>
      <td>${p.buttonText}</td>
      <td><span class="pill ${p.enabled?'yes':'no'}" data-toggle-promo="${p.id}" style="cursor:pointer;">${p.enabled?'Enabled':'Disabled'}</span></td>
      <td>
        <button class="table-action edit" data-edit="${p.id}">Edit</button>
        <button class="table-action delete" data-delete="${p.id}">Delete</button>
      </td>
    </tr>`).join('');
}
function openPromoForm(promo=null){
  const form = document.getElementById('promoForm');
  form.reset();
  document.getElementById('promoImgPreview').style.display='none';
  document.getElementById('promoFormTitle').textContent = promo ? 'Edit Banner' : 'New Promo Banner';
  form.id.value = promo ? promo.id : '';
  if(promo){
    form.title.value = promo.title; form.description.value = promo.description;
    form.buttonText.value = promo.buttonText; form.endDate.value = promo.endDate || '';
    form.enabled.checked = !!promo.enabled;
    const pv=document.getElementById('promoImgPreview'); pv.src=promo.image; pv.style.display='block'; pv.dataset.base64=promo.image;
  }
  openModal('promoFormOverlay');
}
function bindPromoForm(){
  const form = document.getElementById('promoForm');
  bindImagePreview('imageFile', 'promoImgPreview', form);
  document.getElementById('addPromoBtn').addEventListener('click', ()=> openPromoForm());
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const promos = getData(LS.promos);
    const preview = document.getElementById('promoImgPreview');
    const imageSrc = preview.dataset.base64 || (data.id ? promos.find(p=>p.id===data.id)?.image : img('promo'+Date.now(),260,260));
    const enabled = form.enabled.checked;
    const promoObj = {
      id: data.id || uid('pr'), title: data.title, description: data.description,
      buttonText: data.buttonText, endDate: data.endDate, image: imageSrc, enabled
    };
    if(enabled){ promos.forEach(p=> p.enabled = false); }
    if(data.id){ const idx = promos.findIndex(p=>p.id===data.id); promos[idx] = promoObj; }
    else promos.push(promoObj);
    setData(LS.promos, promos);
    closeModal('promoFormOverlay');
    renderAdminPromos(); renderPromoBanner();
    showToast(data.id ? "Banner updated" : "Banner created");
  });
}

/* ---------------------------------------------------------------------
   28. ADMIN: TESTIMONIALS CRUD
   --------------------------------------------------------------------- */
function renderAdminTestimonials(){
  const testimonials = getData(LS.testimonials);
  document.querySelector('#testimonialsTable tbody').innerHTML = testimonials.map(t=> `
    <tr data-id="${t.id}">
      <td><img src="${t.photo}" alt=""></td>
      <td>${t.name}</td>
      <td>${'★'.repeat(t.rating)}</td>
      <td style="max-width:260px;">${t.review}</td>
      <td>
        <button class="table-action edit" data-edit="${t.id}">Edit</button>
        <button class="table-action delete" data-delete="${t.id}">Delete</button>
      </td>
    </tr>`).join('');
}

function openTestimonialForm(testimonial=null){
  const form = document.getElementById('testimonialForm');
  form.reset();
  ['testiPhotoPreview','testiBeforePreview','testiAfterPreview'].forEach(id=>{
    const el = document.getElementById(id);
    el.style.display = 'none';
    delete el.dataset.base64;
  });
  document.getElementById('testimonialFormTitle').textContent = testimonial ? 'Edit Testimonial' : 'Add Testimonial';
  form.id.value = testimonial ? testimonial.id : '';
  if(testimonial){
    form.name.value = testimonial.name;
    form.rating.value = testimonial.rating;
    form.review.value = testimonial.review;
    const setPreview = (id, src)=>{ const el=document.getElementById(id); el.src=src; el.style.display='block'; el.dataset.base64=src; };
    if(testimonial.photo) setPreview('testiPhotoPreview', testimonial.photo);
    if(testimonial.before) setPreview('testiBeforePreview', testimonial.before);
    if(testimonial.after) setPreview('testiAfterPreview', testimonial.after);
  }
  openModal('testimonialFormOverlay');
}

function bindTestimonialForm(){
  const form = document.getElementById('testimonialForm');
  bindImagePreview('photoFile', 'testiPhotoPreview', form);
  bindImagePreview('beforeFile', 'testiBeforePreview', form);
  bindImagePreview('afterFile', 'testiAfterPreview', form);
  document.getElementById('addTestimonialBtn').addEventListener('click', ()=> openTestimonialForm());

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const photoPreview = document.getElementById('testiPhotoPreview');
    const beforePreview = document.getElementById('testiBeforePreview');
    const afterPreview = document.getElementById('testiAfterPreview');
    const testimonials = getData(LS.testimonials);

    const testiObj = {
      id: data.id || uid('t'), name: data.name, rating: Number(data.rating), review: data.review,
      photo: photoPreview.dataset.base64 || (data.id ? testimonials.find(t=>t.id===data.id)?.photo : img('cust'+Date.now(),200,200)),
      before: beforePreview.dataset.base64 || (data.id ? testimonials.find(t=>t.id===data.id)?.before : img('ba'+Date.now()+'a',300,400)),
      after: afterPreview.dataset.base64 || (data.id ? testimonials.find(t=>t.id===data.id)?.after : img('ba'+Date.now()+'b',300,400))
    };

    if(data.id){
      const idx = testimonials.findIndex(t=>t.id===data.id);
      testimonials[idx] = testiObj;
    } else {
      testimonials.push(testiObj);
    }
    setData(LS.testimonials, testimonials);
    closeModal('testimonialFormOverlay');
    renderAdminTestimonials(); renderTestimonials(); renderTransformGallery();
    showToast(data.id ? "Testimonial updated" : "Testimonial added");
  });
}

/* ---------------------------------------------------------------------
   29. ADMIN: CONSULTATIONS
   --------------------------------------------------------------------- */
function renderAdminConsultations(){
  const list = getData(LS.consultations);
  document.querySelector('#consultationsTable tbody').innerHTML = list.length ? list.map(c=> `
    <tr data-id="${c.id}">
      <td>${c.fullName}</td>
      <td>${c.phone}</td>
      <td>${c.email}</td>
      <td>${c.currentWeight}kg → ${c.desiredWeight}kg</td>
      <td><span class="pill ${c.status==='Contacted'?'yes':'pending'}">${c.status}</span></td>
      <td>
        <button class="table-action edit" data-view-consultation="${c.id}">View</button>
        <button class="table-action contacted" data-contacted="${c.id}">${c.status==='Contacted'?'Mark New':'Mark Contacted'}</button>
        <button class="table-action delete" data-delete="${c.id}">Delete</button>
      </td>
    </tr>`).join('') : `<tr><td colspan="6" style="text-align:center;color:var(--charcoal-soft);">No consultation requests yet.</td></tr>`;
}

function openConsultationDetail(c){
  if(!c) return;
  const row = (label, value)=> `
    <div class="detail-row"><span class="detail-label">${label}</span><span class="detail-value">${value && String(value).trim() ? value : '—'}</span></div>`;
  document.getElementById('consultationDetailBody').innerHTML = `
    <div class="detail-grid">
      ${row('Full Name', c.fullName)}
      ${row('Phone', c.phone)}
      ${row('WhatsApp', c.whatsapp)}
      ${row('Email', c.email)}
      ${row('Age', c.age)}
      ${row('Gender', c.gender)}
      ${row('Current Weight', c.currentWeight ? c.currentWeight+'kg' : '')}
      ${row('Desired Weight', c.desiredWeight ? c.desiredWeight+'kg' : '')}
      ${row('Appetite Level', c.appetite)}
      ${row('Health Concerns', c.healthConcerns)}
      ${row('Current Medications', c.medications)}
      ${row('Status', c.status)}
      ${row('Submitted', c.date ? new Date(c.date).toLocaleString() : '')}
    </div>
    <div class="detail-notes">
      <span class="detail-label">Additional Notes</span>
      <p>${c.notes && c.notes.trim() ? c.notes : 'No additional notes provided.'}</p>
    </div>`;
  openModal('consultationDetailOverlay');
}

/* ---------------------------------------------------------------------
   30. ADMIN: ORDERS
   --------------------------------------------------------------------- */
function renderAdminOrders(){
  const orders = getData(LS.orders);
  document.querySelector('#ordersTable tbody').innerHTML = orders.length ? orders.map(o=> `
    <tr data-id="${o.id}">
      <td>${o.id}</td>
      <td>${o.customer.name}<br><small style="color:var(--charcoal-soft);">${o.customer.phone}</small></td>
      <td>${o.items.reduce((s,i)=>s+i.qty,0)} item(s)</td>
      <td>${currency(o.total)}</td>
      <td>
        <select class="status-select" data-id="${o.id}">
          ${['Pending','Processing','Shipped','Delivered','Cancelled'].map(s=> `<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </td>
      <td class="notify-cell">
        <button class="table-action notify-btn ${o.receivedNotified?'sent':''}" data-notify-received="${o.id}">
          <i class="fa-brands fa-whatsapp"></i> ${o.receivedNotified ? 'Received ✓' : 'Notify Received'}
        </button>
        <button class="table-action notify-btn ${o.shippedNotified?'sent':''}" data-notify-shipped="${o.id}">
          <i class="fa-brands fa-whatsapp"></i> ${o.shippedNotified ? 'Shipped ✓' : 'Notify Shipped'}
        </button>
      </td>
    </tr>`).join('') : `<tr><td colspan="6" style="text-align:center;color:var(--charcoal-soft);">No orders yet. Demo orders appear here after checkout.</td></tr>`;
}

/* ---------------------------------------------------------------------
   30b. ADMIN: DELIVERY ZONES (states & fees, editable — feeds checkout)
   --------------------------------------------------------------------- */
function renderAdminDeliveryZones(){
  const zones = getDeliveryZones();
  document.querySelector('#deliveryZonesTable tbody').innerHTML = zones.length ? zones.map(z=> `
    <tr data-id="${z.id}">
      <td>${z.state}</td>
      <td>${currency(z.fee)}</td>
      <td>
        <button class="table-action edit" data-edit-zone="${z.id}">Edit</button>
        <button class="table-action delete" data-delete-zone="${z.id}">Delete</button>
      </td>
    </tr>`).join('') : `<tr><td colspan="3" style="text-align:center;color:var(--charcoal-soft);">No delivery zones yet.</td></tr>`;
}

function openDeliveryZoneForm(zone=null){
  const form = document.getElementById('deliveryZoneForm');
  form.reset();
  document.getElementById('deliveryZoneFormTitle').textContent = zone ? 'Edit Delivery Zone' : 'Add Delivery Zone';
  form.id.value = zone ? zone.id : '';
  form.originalState.value = zone ? zone.state : '';
  if(zone){ form.state.value = zone.state; form.fee.value = zone.fee; }
  openModal('deliveryZoneFormOverlay');
}

function bindDeliveryZoneForm(){
  const form = document.getElementById('deliveryZoneForm');
  document.getElementById('addDeliveryZoneBtn').addEventListener('click', ()=> openDeliveryZoneForm());

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const zones = getDeliveryZones();
    const newState = data.state.trim();

    // Prevent duplicate zone names (except when editing the same zone)
    const duplicate = zones.find(z => z.state.toLowerCase() === newState.toLowerCase() && z.id !== data.id);
    if(duplicate){ showToast(`"${newState}" already exists as a delivery zone`, 'triangle-exclamation'); return; }

    if(data.id){
      const idx = zones.findIndex(z=>z.id===data.id);
      zones[idx] = { id:data.id, state:newState, fee:Number(data.fee) };
    } else {
      zones.push({ id: uid('dz'), state:newState, fee:Number(data.fee) });
    }
    setData(LS.deliveryZones, zones);
    closeModal('deliveryZoneFormOverlay');
    renderAdminDeliveryZones();
    populateStateSelect();
    showToast(data.id ? "Delivery zone updated" : "Delivery zone added");
  });
}

/* ---------------------------------------------------------------------
   31. ADMIN: SETTINGS
   --------------------------------------------------------------------- */
function loadSettingsForm(){
  const s = getSettings();
  document.getElementById('settingLogo').value = s.logo;
  document.getElementById('settingHeroHeading').value = s.heroHeading;
  document.getElementById('settingHeroSub').value = s.heroSub;
  document.getElementById('settingWhatsapp').value = s.whatsapp;
  document.getElementById('settingInstagram').value = s.instagram;
  document.getElementById('settingFacebook').value = s.facebook;
  document.getElementById('settingTiktok').value = s.tiktok;
  document.getElementById('settingEmail').value = s.email;
  document.getElementById('settingPhone').value = s.phone;
  document.getElementById('settingFooterText').value = s.footerText;
  document.getElementById('settingRefundPolicy').value = s.refundPolicy || '';
  document.getElementById('settingDeliveryPolicy').value = s.deliveryPolicy || '';
  document.getElementById('settingPrivacyPolicy').value = s.privacyPolicy || '';
  document.getElementById('settingTermsPolicy').value = s.termsPolicy || '';
}
function bindSettingsForm(){
  document.getElementById('settingsForm').addEventListener('submit', e=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const merged = Object.assign({}, getSettings(), data);
    localStorage.setItem(LS.settings, JSON.stringify(merged));
    applySettingsToDOM();
    showToast("Settings saved");
  });
}

/* ---------------------------------------------------------------------
   32. SHOP CONTROLS BINDINGS
   --------------------------------------------------------------------- */
function bindShopControls(){
  document.getElementById('shopSearch').addEventListener('input', renderShopGrid);
  document.getElementById('categoryFilter').addEventListener('change', renderShopGrid);
  document.getElementById('sortFilter').addEventListener('change', renderShopGrid);
}

/* ---------------------------------------------------------------------
   33. INIT
   --------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  seedData();
  applySettingsToDOM();
  renderProductGrids();
  renderCombos();
  renderTransformGallery();
  renderPromoBanner();
  renderTestimonials();
  renderFAQ();
  renderHeroSlider();
  renderInstaGrid();
  renderCartUI();
  populateStateSelect();

  bindUIChrome();
  bindDelegatedEvents();
  bindCartAndCheckout();
  bindModalCloseButtons();
  bindConsultationForm();
  bindShopControls();
  bindPolicyLinks();

  bindAdminAccess();
  bindAdminTabs();
  bindAdminMobileSidebar();
  bindProductForm();
  bindComboForm();
  bindPromoForm();
  bindTestimonialForm();
  bindDeliveryZoneForm();
  bindSettingsForm();
  bindAdminTableActions();

  observeFadeEls();
  animateCounters();

  window.addEventListener('resize', ()=>{});

  // Live sync across tabs: if admin edits happen in one tab (or window) while
  // the storefront is open in another, refresh everything automatically
  // instead of requiring a manual reload.
  window.addEventListener('storage', (e)=>{
    if(!e.key || !Object.values(LS).includes(e.key)) return;
    applySettingsToDOM();
    renderProductGrids();
    renderCombos();
    renderTransformGallery();
    renderPromoBanner();
    renderTestimonials();
    renderHeroSlider();
    renderInstaGrid();
    renderCartUI();
    populateStateSelect();
    if(document.getElementById('adminPanel').classList.contains('open')){
      renderAdminStats(); renderAdminProducts(); renderAdminCombos(); renderAdminPromos();
      renderAdminTestimonials(); renderAdminConsultations(); renderAdminOrders(); renderAdminDeliveryZones();
    }
  });

  setTimeout(()=> document.getElementById('loader').classList.add('hide'), 500);
});
