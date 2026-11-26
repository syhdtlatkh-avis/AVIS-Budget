/**
 * BUDGET MALAYSIA - OFFICIAL APPLICATION SCRIPT
 * Color System:
 *   - Header/Footer: Navy Blue #00285F
 *   - Background:    Blue Grey #E8EEF5
 *   - Alternate Sec: Light Grey #F4F6F9
 *   - Headings:      Navy Blue #00285F
 *   - Body Text:     Dark Grey #344054
 *   - Buttons:       Burnt Orange #ED5505 (Hover: #F78B00)
 *   - Icons:         Golden Orange #F78B00
 *   - Cards:         Pure White #FFFFFF
 */

// --------------------------------------------------------------------------
// 2. Global Helper Functions & Dates
// --------------------------------------------------------------------------
function formatDateForInput(date) {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 10);
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
    const day = parseInt(parts[2], 10);
    return `${day} ${month} ${year}`;
  }
  return dateStr;
}

function showToast(message) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// --------------------------------------------------------------------------
// 3. 17 Budget Malaysia Nationwide Stations Data
// --------------------------------------------------------------------------
const BUDGET_STATIONS = [
  {
    id: "glenmarie-hq",
    name: "Glenmarie, Shah Alam (TE5)",
    region: "central",
    city: "Shah Alam, Selangor",
    lat: 3.0864,
    lng: 101.5753,
    address: "Level 1, Suite 1-2B EON Head Office Complex, No 2, Persiaran Kerjaya Glenmarie Industrial Park Section U1, 40150 Shah Alam, Selangor",
    phone: "+6018-282 2611",
    hours: "08:00 - 18:00 (Mon - Fri)" + " " + "08:00 - 17:00 (Sat - Sun)",
    isAirport: false
  },
  {
    id: "klia-t1",
    name: "Kuala Lumpur International Airport Terminal 1 (KLIA T1)",
    region: "central",
    city: "Sepang, Selangor",
    lat: 2.7456,
    lng: 101.7072,
    address: "Lot 12, Carpark Block D, Ground Floor KLIA, 43900, Sepang, Selangor",
    phone: "+6012-858 2847",
    hours: "07:00 - 22:00 (Daily)",
    isAirport: true
  },
  {
    id: "klia-t2",
    name: "Kuala Lumpur International Airport Terminal 2 (KLIA T2)",
    region: "central",
    city: "Sepang, Selangor",
    lat: 2.7433,
    lng: 101.6865,
    address: "Lot 1-A09, Level 1, Gateway @ KLIA2, Terminal KLIA 2 International Airport, Jalan KLIA 2/1, 64000 KLIA, Sepang, Selangor",
    phone: "+6012-858 2847",
    hours: "08:00 - 22:00 (Daily)",
    isAirport: true
  },
  {
    id: "kl-downtown",
    name: "Kuala Lumpur Downtown (KU4)",
    region: "central",
    city: "Kuala Lumpur",
    lat: 3.1593,
    lng: 101.7001,
    address: "Sheraton Imperial Kuala Lumpur Hotel, Lot G5, Ground Floor, Faber Imperial Court, Jalan Sultan Ismail, 50250 Kuala Lumpur",
    phone: "+6018-284 0831",
    hours: "08:00 - 18:00 (Mon - Fri)" + " " + "08:00 - 17:00 (Sat - Sun)",
    isAirport: false
  },
  {
    id: "penang-airport",
    name: "Penang International Airport (PEN)",
    region: "northern",
    city: "Bayan Lepas, Penang",
    lat: 5.2972,
    lng: 100.2769,
    address: "Bayan Lepas International Airport, 11900 Bayan Lepas, Pulau Pinang",
    phone: "+6012-589 4883",
    hours: "07:30 - 21:30 (Daily)",
    isAirport: true
  },
  {
    id: "senai-airport",
    name: "Senai International Airport (JHB)",
    region: "southern",
    city: "Senai, Johor",
    lat: 1.6401,
    lng: 103.6698,
    address: "Lot E10-5 Counter, Aeromall, Senai International Airport, 81250 Johor Bahru, Johor Darul Takzim",
    phone: "+6019-230 8983",
    hours: "08:00 - 18:00 (Sun - Thu)" + " " + "08:00 - 17:00 (Fri - Sat)",
    isAirport: true
  },
  {
    id: "jb-downtown",
    name: "Johor Bahru Downtown (JH2)",
    region: "southern",
    city: "Johor Bahru, Johor",
    lat: 1.4883,
    lng: 103.7621,
    address: "Trove Hotel. Lot 1.4, Mezzanine Floor, Jalan Dato' Abdullah Tahir 80300 Johor Bahru, Johor Darul Takzim",
    phone: "+6018-227 4989",
    hours: "08:00 - 18:00 (Sun - Thu)" + " " + "08:00 - 17:00 (Fri - Sat)",
    isAirport: false
  },
  {
    id: "melaka-downtown",
    name: "Melaka Downtown (M8Y)",
    region: "southern",
    city: "Bandar Hilir, Melaka",
    lat: 2.1908,
    lng: 102.2472,
    address: "No 218, Jalan Melaka Raya 1, Taman Melaka Raya, 75000 Melaka",
    phone: "+6012-604 9917",
    hours: "08:00 - 18:00 (Daily)",
    isAirport: false
  },
  {
    id: "kuantan-airport",
    name: "Kuantan Airport (KUA)",
    region: "eastcoast",
    city: "Kuantan, Pahang",
    lat: 3.7752,
    lng: 103.2094,
    address: "Sultan Haji Ahmad Shah Airport, 25150 Kuantan, Pahang",
    phone: "+6010-430 5195",
    hours: "08:00 - 18:00 (Mon - Fri)" + " " + "08:00 - 17:00 (Sat - Sun)",
    isAirport: true
  },
  {
    id: "kota-bharu-airport",
    name: "Kota Bharu Airport (KBR)",
    region: "eastcoast",
    city: "Pengkalan Chepa, Kelantan",
    lat: 6.1669,
    lng: 102.2930,
    address: "GL11F, Ground Floor (Landside), Interim Terminal, Sultan Ismal Petra Airport, Pengkalan Chepa,16100 Kota Bharu, Kelantan",
    phone: "+6011-1641 6464",
    hours: "08:00 - 18:00 (Mon - Fri)" + " " + "08:00 - 17:00 (Sat - Sun)",
    isAirport: true
  },
  {
    id: "kk-airport",
    name: "Kota Kinabalu International Airport (SG1)",
    region: "borneo",
    city: "Kota Kinabalu, Sabah",
    lat: 5.9372,
    lng: 116.0510,
    address: "Lot No. L1 L02 (C4), Level 1 (Landside), Kota Kinabalu International Airport, 88740 Kota Kinabalu, Sabah",
    phone: "+6014-853 5313",
    hours: "08:00 - 20:00 (Daily)",
    isAirport: true
  },
  {
    id: "sandakan-airport",
    name: "Sandakan Airport (SDK)",
    region: "borneo",
    city: "Sandakan, Sabah",
    lat: 5.9009,
    lng: 118.0601,
    address: "Lot GFL015E Ground Floor (Landslide) Batu 7, Jalan Utara, Sandakan Airport Sandakan, 90000 Sabah",
    phone: "+6012-861 9451",
    hours: "08:00 - 18:00 (Mon - Fri)" + " " + "08:00 - 17:00 (Sat - Sun)",
    isAirport: true
  },
  {
    id: "tawau-airport",
    name: "Tawau Airport (TWA)",
    region: "borneo",
    city: "Tawau, Sabah",
    lat: 4.3168,
    lng: 118.1219,
    address: "Counter GF18, Arrival Concourse Tawau Airport, 91000 Sabah",
    phone: "+6013-348 0069",
    hours: "08:00 - 18:00 (Mon - Fri)" + " " + "08:00 - 17:00 (Sat - Sun)",
    isAirport: true
  },
  {
    id: "kuching-airport",
    name: "Kuching International Airport (KCH)",
    region: "borneo",
    city: "Kuching, Sarawak",
    lat: 1.4847,
    lng: 110.3469,
    address: "L1LC11, 1 Bangunan Terminal, Jalan Lapangan Terbang, Kuching International Airport, 93250 Kuching, Sarawak",
    phone: "+6017-220 0265",
    hours: "08:00 - 19:30 (Mon - Fri)" + " " + "08:00 - 17:00 (Sat - Sun)",
    isAirport: true
  },
  {
    id: "miri-airport",
    name: "Miri Airport (MRR)",
    region: "borneo",
    city: "Miri, Sarawak",
    lat: 4.3221,
    lng: 113.9872,
    address: "Lot No GL 31 Ground Level, Public Concourse, 98000 Miri Airport",
    phone: "+6019-257 8958",
    hours: "08:00 - 18:00 (Mon - Fri)" + " " + "08:00 - 17:00 (Sat - Sun)",
    isAirport: true
  },
  {
    id: "bintulu-airport",
    name: "Bintulu Airport (BTL)",
    region: "borneo",
    city: "Bintulu, Sarawak",
    lat: 4.2100,
    lng: 113.0000,
    address: "Counter GL28, Arrival Concourse Bintulu Aiport, 97000 Bintulu, Sarawak",
    phone: "+6016-805 5847",
    hours: "08:00 - 18:00 (Mon - Fri)" + " " + "08:00 - 17:00 (Sat - Sun)",
    isAirport: true
  },
  {
    id: "sibu-airport",
    name: "Sibu Airport (SBW)",
    region: "borneo",
    city: "Sibu, Sarawak",
    lat: 2.2678,
    lng: 111.8444,
    address: "Lot No. GFL 11(E), Ground Floor, Public Concourse (Landside), Sibu Airport Jalan Sibu Airport, 96000 Sibu, Sarawak",
    phone: "+6011-2360 5209",
    hours: "08:00 - 18:00 (Mon - Fri)" + " " + "08:00 - 17:00 (Sat - Sun)",
    isAirport: true
  }
];

// --------------------------------------------------------------------------
// 4. Fleet Vehicles Catalog (Budget Malaysia Exclusively Offers 2 Models)
// --------------------------------------------------------------------------
const BUDGET_FLEET = [
  {
    id: "persona",
    group: "Economy Sedan",
    category: "economy",
    title: "Proton Persona 1.6",
    subtitle: "Practicality & comfort with spacious luggage capacity",
    description: "This economy sedan offers many features such as spacious luggage capacity, USB connectivity and fuel economy. Drive the Proton Persona if you are seeking for practicality with the capacity to carry a little more in comfort.",
    image: "assets/images/proton-persona.png",
    seats: 5,
    bags: "3",
    doors: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    excess: "RM500",
    dailyRate: 145.26,
    weeklyRate: 145.26,
    rating: 4.9,
    badge: "Economy Sedan"
  },
  {
    id: "xpander",
    group: "Compact SUV",
    category: "suv",
    title: "Mitsubishi Xpander",
    subtitle: "Bold 7-seater compact SUV designed for life beyond limits",
    description: "An SUV that makes a bold statement for individuals aspiring to stand out, aligning with a lifestyle driven by goals and dreams. Its powerful design, including wide flared fenders, exudes confidence and toughness, prioritizing safety for passengers and pedestrians. The XPANDER offers a smooth, fuel-efficient performance with reduced noise, allowing drivers to live beyond limits.",
    image: "assets/images/mitsubishi-xpander.png",
    seats: 7,
    bags: "4 to 5",
    doors: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    excess: "RM1,000",
    dailyRate: 194.33,
    weeklyRate: 194.33,
    rating: 4.9,
    badge: "Compact SUV · 7-Seater"
  }
];

// --------------------------------------------------------------------------
// 5. DOM Initialization & Shared Listeners
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Update footer year dynamically
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const isOpen = navMenu.classList.contains("open");
      mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
    // Close menu on link click
    navMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // Populate stations dropdowns across all pages
  populateStationDropdowns();

  // Setup default pickup & return dates
  setupDefaultDates();

  // Quick booking widget handler (homepage)
  setupQuickBookingForm();

  // Interactive Live Pricing Estimator (homepage)
  setupLiveEstimator();

  // Fleet page filter & modal setup
  setupFleetPage();

  // Locations page map & filter setup
  setupLocationsPage();

  // Offer page promo code copy
  setupOfferPage();

  // Reservation Wizard setup
  setupReservationWizard();

  // Hero Banner Carousel setup
  setupHeroCarousel();

  // FAQ accordion
  setupFAQAccordion();

  // 360° Virtual Showroom
  setupShowroom();
});

// --------------------------------------------------------------------------
// 6. Stations Dropdown Populator
// --------------------------------------------------------------------------
function populateStationDropdowns() {
  const selects = document.querySelectorAll("select.station-select");
  selects.forEach(select => {
    // Keep first option (e.g. "Select location")
    const placeholder = select.firstElementChild ? select.firstElementChild.outerHTML : '<option value="">Select location</option>';
    let optionsHtml = placeholder;
    
    // Group by region
    const groups = {
      central: "Central & KL",
      northern: "Northern Region",
      southern: "Southern Region",
      eastcoast: "East Coast",
      borneo: "East Malaysia (Sabah & Sarawak)"
    };

    Object.keys(groups).forEach(reg => {
      const filtered = BUDGET_STATIONS.filter(s => s.region === reg);
      if (filtered.length > 0) {
        optionsHtml += `<optgroup label="${groups[reg]}">`;
        filtered.forEach(s => {
          optionsHtml += `<option value="${s.id}">${s.name}</option>`;
        });
        optionsHtml += `</optgroup>`;
      }
    });

    select.innerHTML = optionsHtml;
  });
}

// --------------------------------------------------------------------------
// 7. Date Handling
// --------------------------------------------------------------------------
function setupDefaultDates() {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2); // Default 2-day rental

  const pickupInputs = document.querySelectorAll('input[name="pickupDate"], #pickupDate');
  const returnInputs = document.querySelectorAll('input[name="returnDate"], #returnDate');

  pickupInputs.forEach(input => {
    input.min = formatDateForInput(today);
    if (!input.value) input.value = formatDateForInput(today);
    input.addEventListener("change", () => {
      returnInputs.forEach(r => {
        r.min = input.value;
        if (r.value < input.value) {
          const nextDay = new Date(input.value);
          nextDay.setDate(nextDay.getDate() + 1);
          r.value = formatDateForInput(nextDay);
        }
      });
    });
  });

  returnInputs.forEach(input => {
    input.min = formatDateForInput(today);
    if (!input.value) input.value = formatDateForInput(tomorrow);
  });
}

// --------------------------------------------------------------------------
// 8. Quick Booking Form & Live Availability Search (Homepage & Fleet)
// --------------------------------------------------------------------------
let currentFleetSearchData = null;

function renderSearchAnalysisBanner(searchData) {
  const bannerEl = document.getElementById("fleetSearchAnalysisBanner");
  if (!bannerEl || !searchData) return;

  const isWeekly = searchData.days >= 7;
  bannerEl.style.display = "block";
  bannerEl.innerHTML = `
    <div class="analysis-header-row">
      <div class="analysis-header-left">
        <span class="analysis-badge"><i class="fa-solid fa-magnifying-glass-chart"></i> LIVE AVAILABILITY &amp; RATE ANALYSIS</span>
        <h4 class="analysis-heading">Available Vehicles for Your Trip</h4>
      </div>
      <button type="button" class="btn-reset-search" id="btnResetSearch">
        <i class="fa-solid fa-rotate-left"></i> Reset Search / Show All
      </button>
    </div>
    <div class="analysis-data-grid">
      <div class="analysis-data-card">
        <span class="data-label"><i class="fa-solid fa-location-dot"></i> Pick-up Location</span>
        <span class="data-value">${searchData.pickupName || "Selected Station"}</span>
      </div>
      <div class="analysis-data-card">
        <span class="data-label"><i class="fa-solid fa-calendar-days"></i> Dates</span>
        <span class="data-value">${formatDisplayDate(searchData.pickupDate)} -&gt; ${formatDisplayDate(searchData.returnDate)}</span>
      </div>
      <div class="analysis-data-card">
        <span class="data-label"><i class="fa-solid fa-clock"></i> Duration</span>
        <span class="data-value highlight">${searchData.days} Day${searchData.days > 1 ? 's' : ''}</span>
        ${isWeekly 
          ? '<span class="analysis-badge-pill badge-pill-discount"><i class="fa-solid fa-tag"></i> Weekly Discount Applied</span>' 
          : '<span class="analysis-badge-pill badge-pill-success"><i class="fa-solid fa-check"></i> Standard Daily Rate</span>'}
      </div>
      <div class="analysis-data-card">
        <span class="data-label"><i class="fa-solid fa-shield-check"></i> Stock Availability</span>
        <span class="data-value" style="color: #065F46;">Guaranteed Available</span>
        <span class="analysis-badge-pill badge-pill-success"><i class="fa-solid fa-circle-check"></i> 100% In-Stock</span>
      </div>
    </div>
    <div class="analysis-footer-note">
      <i class="fa-solid fa-circle-info"></i>
      <span>Vehicle rates below are analyzed and calculated for <strong>${searchData.days} day${searchData.days > 1 ? 's' : ''}</strong>. Click <strong>BOOK NOW</strong> on your preferred vehicle to reserve with these dates locked in.</span>
    </div>
  `;

  // Handle Reset Search button
  const resetBtn = document.getElementById("btnResetSearch");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      currentFleetSearchData = null;
      sessionStorage.removeItem("budget_search");
      bannerEl.style.display = "none";
      bannerEl.innerHTML = "";
      const quickModelSelect = document.getElementById("quickCategorySelect");
      if (quickModelSelect) quickModelSelect.value = "all";
      document.querySelectorAll(".fleet-filter-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.category === "all");
      });
      renderFleetCards("all", null);
      showToast("Search cleared. Displaying standard fleet.");
    });
  }
}

function setupQuickBookingForm() {
  const form = document.getElementById("quickBookingForm");
  const quickModelSelect = document.getElementById("quickCategorySelect");
  const stationSelect = document.getElementById("pickupStationSelect");
  const pickupDateInput = document.getElementById("quickPickupDate");
  const returnDateInput = document.getElementById("quickReturnDate");

  // Populate stations dropdown if empty
  if (stationSelect && stationSelect.options.length <= 1 && typeof BUDGET_STATIONS !== "undefined") {
    stationSelect.innerHTML = '<option value="">Choose pick-up station</option>' +
      BUDGET_STATIONS.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
  }

  // Set min date to today
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  if (pickupDateInput) pickupDateInput.min = todayStr;
  if (returnDateInput) returnDateInput.min = todayStr;

  // 1. Instant Model Filter: Selecting a vehicle model automatically updates display
  if (quickModelSelect) {
    quickModelSelect.addEventListener("change", () => {
      const selectedCategory = quickModelSelect.value;

      // Sync filter buttons in Fleet section
      document.querySelectorAll(".fleet-filter-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.category === selectedCategory);
      });

      // Update active search category if search was performed
      if (currentFleetSearchData) {
        currentFleetSearchData.category = selectedCategory;
      }

      // Render fleet matching this category
      renderFleetCards(selectedCategory, currentFleetSearchData);

      const fleetSec = document.getElementById("fleetSection");
      if (fleetSec) {
        fleetSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  if (!form) return;

  // 2. Find Cars Button: Redirects to fleet.html with search data, or updates fleet page directly
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const stationEl = document.getElementById("pickupStationSelect");
    const pickupVal = stationEl ? stationEl.value : "";
    const pickupName = (stationEl && stationEl.selectedIndex >= 0 && stationEl.value) 
      ? stationEl.options[stationEl.selectedIndex].text 
      : "Selected Station";

    const pickupDateVal = document.getElementById("quickPickupDate") ? document.getElementById("quickPickupDate").value : "";
    const returnDateVal = document.getElementById("quickReturnDate") ? document.getElementById("quickReturnDate").value : "";
    const categoryVal = quickModelSelect ? quickModelSelect.value : "all";

    if (!pickupVal) {
      showToast("Please choose a pick-up station.");
      if (stationEl) stationEl.focus();
      return;
    }

    if (!pickupDateVal || !returnDateVal) {
      showToast("Please select both pick-up and return dates.");
      return;
    }

    if (returnDateVal < pickupDateVal) {
      alert("Return date must be equal to or after pickup date.");
      return;
    }

    // Rental duration analysis
    const pDate = new Date(pickupDateVal);
    const rDate = new Date(returnDateVal);
    const diffMs = rDate.getTime() - pDate.getTime();
    const rentalDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    currentFleetSearchData = {
      pickup: pickupVal,
      pickupName: pickupName,
      pickupDate: pickupDateVal,
      returnDate: returnDateVal,
      days: rentalDays,
      category: categoryVal
    };

    // Store in sessionStorage so fleet and reservation page can pre-populate
    sessionStorage.setItem("budget_search", JSON.stringify(currentFleetSearchData));

    // If on homepage or other page, redirect to fleet.html with search parameters
    const isFleetPage = window.location.pathname.endsWith("fleet.html") || window.location.pathname.includes("fleet");
    if (!isFleetPage) {
      const q = new URLSearchParams({
        search: "1",
        pickup: pickupVal,
        pickupName: pickupName,
        pickupDate: pickupDateVal,
        returnDate: returnDateVal,
        days: rentalDays,
        category: categoryVal
      });
      window.location.href = `fleet.html?${q.toString()}`;
      return;
    }

    // If already on fleet page, update the analysis banner and car cards in-place
    renderSearchAnalysisBanner(currentFleetSearchData);

    // Sync filter pills to the searched category
    document.querySelectorAll(".fleet-filter-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.category === categoryVal);
    });

    renderFleetCards(categoryVal, currentFleetSearchData);

    const bannerEl = document.getElementById("fleetSearchAnalysisBanner");
    if (bannerEl) {
      bannerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    showToast(`Displaying available cars for ${rentalDays} day${rentalDays > 1 ? 's' : ''}!`);
  });
}

// --------------------------------------------------------------------------
// 9. Interactive Live Price Estimator (Homepage)
// --------------------------------------------------------------------------
function setupLiveEstimator() {
  const calcForm = document.getElementById("livePriceEstimator");
  if (!calcForm) return;

  const vehicleSelect = document.getElementById("calcVehicle");
  const daysInput = document.getElementById("calcDays");
  const scdwCheck = document.getElementById("calcSCDW");
  const gpsCheck = document.getElementById("calcGPS");
  const babySeatCheck = document.getElementById("calcBabySeat");

  const basePriceEl = document.getElementById("calcBaseTotal");
  const sstEl = document.getElementById("calcSST");
  const grandTotalEl = document.getElementById("calcGrandTotal");
  const excessNoteEl = document.getElementById("calcExcessNote");

  function calculate() {
    const selectedCarId = vehicleSelect.value;
    const days = Math.max(1, parseInt(daysInput.value) || 1);
    const car = BUDGET_FLEET.find(c => c.id === selectedCarId) || BUDGET_FLEET[0];

    const dailyRate = days >= 7 ? car.weeklyRate : car.dailyRate;
    const baseRental = (dailyRate * days).toFixed(2);

    let addonDaily = 0;
    if (scdwCheck && scdwCheck.checked) addonDaily += 35; // Zero excess waiver
    if (gpsCheck && gpsCheck.checked) addonDaily += 20;
    if (babySeatCheck && babySeatCheck.checked) addonDaily += 25;

    const addonsTotal = addonDaily * days;
    const subtotal = parseFloat(baseRental) + addonsTotal;
    const sst = (subtotal * 0.08).toFixed(2); // 8% Malaysian SST
    const grandTotal = (subtotal + parseFloat(sst)).toFixed(2);

    if (basePriceEl) basePriceEl.textContent = `RM ${baseRental} (${days} days @ RM${dailyRate}/day)`;
    if (sstEl) sstEl.textContent = `RM ${sst}`;
    if (grandTotalEl) grandTotalEl.textContent = `RM ${grandTotal}`;
    if (excessNoteEl) {
      excessNoteEl.textContent = (scdwCheck && scdwCheck.checked) 
        ? "Super CDW Applied: RM 0 Zero Excess Guarantee" 
        : `Standard Excess: ${car.excess} (Select SCDW above for RM0 excess)`;
    }
  }

  [vehicleSelect, daysInput, scdwCheck, gpsCheck, babySeatCheck].forEach(el => {
    if (el) el.addEventListener("input", calculate);
  });

  calculate();
}

// --------------------------------------------------------------------------
// 10. Fleet Page & Dynamic Car Cards Renderer
// --------------------------------------------------------------------------
function renderFleetCards(filter = "all", searchData = currentFleetSearchData) {
  const fleetGrid = document.getElementById("fleetContainer");
  if (!fleetGrid) return;

  const filtered = filter === "all" ? BUDGET_FLEET : BUDGET_FLEET.filter(c => c.category === filter);

  fleetGrid.innerHTML = filtered.map(car => {
    const isSearchActive = !!searchData && searchData.days > 0;
    const isWeekly = isSearchActive && searchData.days >= 7;
    const dailyRate = isWeekly ? car.weeklyRate : car.dailyRate;
    const tripTotal = isSearchActive ? (dailyRate * searchData.days).toFixed(2) : "0.00";

    const rateLabel = isWeekly 
      ? '<span style="color:var(--burnt-orange);font-weight:700;"><i class="fa-solid fa-tag"></i> Weekly Discount Rate</span>' 
      : 'Daily Rate';

    const tripTotalHtml = isSearchActive ? `
      <div class="car-trip-total">
        <i class="fa-solid fa-calculator"></i> Total Est.: <strong>RM ${tripTotal}</strong> (${searchData.days} day${searchData.days > 1 ? 's' : ''})
      </div>
    ` : '';

    const bookUrl = isSearchActive 
      ? `reservation.html?car=${car.id}&pickup=${encodeURIComponent(searchData.pickup)}&pickupDate=${searchData.pickupDate}&returnDate=${searchData.returnDate}&days=${searchData.days}&category=${car.category}`
      : `reservation.html?car=${car.id}&category=${car.category}`;

    return `
      <article class="car-card" data-category="${car.category}">
        <div class="car-image-wrap" style="cursor:pointer" data-car-id="${car.id}">
          <span class="car-badge ${car.category === 'suv' ? 'popular' : ''}">${car.group}</span>
          <img src="${car.image}" alt="${car.title}" loading="lazy">
          <span class="car-360-badge" data-car-id="${car.id}"><i class="fa-solid fa-cube"></i> 360° View</span>
        </div>
        <div class="car-content">
          <div class="car-header">
            <div>
              <h3 class="car-title">${car.title}</h3>
              <p class="car-subtitle">${car.subtitle}</p>
            </div>
            <div class="car-rating">
              <i class="fa-solid fa-star"></i>
              <span>${car.rating}</span>
            </div>
          </div>

          <p class="car-desc">${car.description}</p>

          <div class="car-specs">
            <div class="spec-item"><i class="fa-solid fa-users"></i> Seats - ${car.seats}</div>
            <div class="spec-item"><i class="fa-solid fa-suitcase"></i> Luggage - ${car.bags}</div>
            <div class="spec-item"><i class="fa-solid fa-door-closed"></i> ${car.doors}-doors</div>
            <div class="spec-item"><i class="fa-solid fa-gears"></i> ${car.transmission}</div>
            <div class="spec-item"><i class="fa-solid fa-gas-pump"></i> Fuel - ${car.fuel}</div>
            <div class="spec-item"><i class="fa-solid fa-shield-halved"></i> Excess - ${car.excess}</div>
          </div>

          <div class="car-bottom-wrap">
            <p class="car-disclaimer">* Images shown may differ slightly from actual vehicle</p>

            <div class="car-footer">
              <div class="car-price">
                <span class="car-price-from">${rateLabel}</span>
                <div class="car-price-val">RM ${dailyRate} <span>/ day</span></div>
                ${tripTotalHtml}
                <span class="car-excess-note">Zero-excess SCDW option available</span>
              </div>
              <div class="car-footer-actions">
                <a href="${bookUrl}" class="btn btn-primary btn-sm">
                  BOOK NOW <i class="fa-solid fa-arrow-right"></i>
                </a>
                <button class="btn btn-sm btn-open-360" data-car-id="${car.id}" style="background:#00285F;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600">
                  <i class="fa-solid fa-cube"></i> 360° View
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Attach 360° showroom click events
  fleetGrid.querySelectorAll(".car-image-wrap[data-car-id], .btn-open-360[data-car-id], .car-360-badge[data-car-id]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openShowroom(el.dataset.carId);
    });
  });
}

function setupFleetPage() {
  const fleetGrid = document.getElementById("fleetContainer");
  const filterBtns = document.querySelectorAll(".fleet-filter-btn");
  if (!fleetGrid) return;

  const quickModelSelect = document.getElementById("quickCategorySelect");

  // Check URL parameters for live search data (only when user initiated search)
  const urlParams = new URLSearchParams(window.location.search);
  const hasUrlSearch = urlParams.get("search") === "1" || (urlParams.has("pickup") && urlParams.get("pickup") !== "");

  if (hasUrlSearch) {
    const pickupVal = urlParams.get("pickup") || "";
    const pickupName = urlParams.get("pickupName") || (BUDGET_STATIONS.find(s => s.id === pickupVal)?.name || "Selected Station");
    const pickupDateVal = urlParams.get("pickupDate") || "";
    const returnDateVal = urlParams.get("returnDate") || "";
    const categoryVal = urlParams.get("category") || "all";
    const daysParam = parseInt(urlParams.get("days")) || 1;

    currentFleetSearchData = {
      pickup: pickupVal,
      pickupName: pickupName,
      pickupDate: pickupDateVal,
      returnDate: returnDateVal,
      days: daysParam,
      category: categoryVal
    };
    sessionStorage.setItem("budget_search", JSON.stringify(currentFleetSearchData));
  } else {
    currentFleetSearchData = null;
  }

  // Pre-fill quick booking form inputs on fleet page if present
  if (currentFleetSearchData) {
    const stationSelect = document.getElementById("pickupStationSelect");
    const pInput = document.getElementById("quickPickupDate");
    const rInput = document.getElementById("quickReturnDate");
    if (stationSelect && currentFleetSearchData.pickup) stationSelect.value = currentFleetSearchData.pickup;
    if (pInput && currentFleetSearchData.pickupDate) pInput.value = currentFleetSearchData.pickupDate;
    if (rInput && currentFleetSearchData.returnDate) rInput.value = currentFleetSearchData.returnDate;
    if (quickModelSelect && currentFleetSearchData.category) quickModelSelect.value = currentFleetSearchData.category;

    renderSearchAnalysisBanner(currentFleetSearchData);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.category;

      if (quickModelSelect) {
        quickModelSelect.value = cat;
      }
      if (currentFleetSearchData) {
        currentFleetSearchData.category = cat;
      }

      renderFleetCards(cat, currentFleetSearchData);
    });
  });

  // Check URL category if arriving from a category link (e.g. ?category=suv)
  const urlCategory = urlParams.get("category");
  const initialCategory = (urlCategory && ["economy", "suv"].includes(urlCategory)) 
    ? urlCategory 
    : (currentFleetSearchData && currentFleetSearchData.category ? currentFleetSearchData.category : "all");

  if (initialCategory !== "all") {
    filterBtns.forEach(b => {
      b.classList.toggle("active", b.dataset.category === initialCategory);
    });
    if (quickModelSelect) quickModelSelect.value = initialCategory;
  }

  renderFleetCards(initialCategory, currentFleetSearchData);
}

// --------------------------------------------------------------------------
// 11. Locations Page (Leaflet Interactive Map & 17 Stations)
// --------------------------------------------------------------------------
function setupLocationsPage() {
  const mapEl = document.getElementById("locationsMap");
  const listContainer = document.getElementById("locationsList");
  const searchInput = document.getElementById("locationSearchInput");
  const regionBtns = document.querySelectorAll(".loc-region-btn");

  if (!mapEl || !window.L) return;

  // Initialize Leaflet Map centered on Malaysia (default zoom 5 showing entire peninsula and Borneo)
  const map = L.map("locationsMap", { scrollWheelZoom: false }).setView([3.2, 109.2], 5);

  // High contrast dark/light friendly tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors | Budget Malaysia",
    maxZoom: 18
  }).addTo(map);

  const markers = {};
  const bounds = [];

  // Update region filter button counts dynamically from BUDGET_STATIONS
  if (regionBtns.length > 0) {
    const counts = {
      all: BUDGET_STATIONS.length,
      central: BUDGET_STATIONS.filter(s => s.region === "central").length,
      northern: BUDGET_STATIONS.filter(s => s.region === "northern").length,
      southern: BUDGET_STATIONS.filter(s => s.region === "southern").length,
      eastcoast: BUDGET_STATIONS.filter(s => s.region === "eastcoast").length,
      borneo: BUDGET_STATIONS.filter(s => s.region === "borneo").length
    };
    const labels = {
      all: `All Stations (${counts.all})`,
      central: `Central & KL (${counts.central})`,
      northern: `Northern (${counts.northern})`,
      southern: `Southern (${counts.southern})`,
      eastcoast: `East Coast (${counts.eastcoast})`,
      borneo: `East Malaysia (${counts.borneo})`
    };
    regionBtns.forEach(btn => {
      const reg = btn.dataset.region;
      if (labels[reg]) btn.textContent = labels[reg];
    });
  }

  BUDGET_STATIONS.forEach((station, idx) => {
    const latLng = [station.lat, station.lng];
    bounds.push(latLng);

    const num = idx + 1;
    const customIcon = L.divIcon({
      className: "custom-leaflet-pin",
      html: `<div style="width:34px;height:34px;background:#00285F;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:800;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.2s;">${num}</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -17]
    });

    const marker = L.marker(latLng, { icon: customIcon }).addTo(map);
    marker.bindPopup(`
      <div style="font-family: inherit; padding: 4px; min-width: 220px;">
        <span style="font-size: 9px; font-weight: 800; color: #F78B00; text-transform: uppercase;">${station.isAirport ? 'Airport Branch' : 'City Hub'}</span>
        <h4 style="font-size: 14px; font-weight: 800; margin: 3px 0 6px; color: #fff;">${station.name}</h4>
        <p style="font-size: 11px; color: #CBD5E1; margin: 0 0 6px; line-height: 1.4;">${station.address}</p>
        <p style="font-size: 11px; color: #E2E8F0; margin: 0 0 6px;"><i class="fa-solid fa-clock" style="color: #F78B00;"></i> ${station.hours}</p>
        <p style="font-size: 11px; color: #F78B00; margin: 0 0 10px;"><i class="fa-solid fa-phone"></i> <a href="tel:${station.phone.replace(/[^0-9+]/g, '')}" style="color: #F78B00; text-decoration: none; font-weight: 600;">${station.phone}</a></p>
        <a href="reservation.html?pickup=${station.id}" style="display: inline-block; background: #ED5505; color: #fff; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 20px; text-decoration: none; box-shadow: 0 2px 6px rgba(237,85,5,0.4);">Book From Here </a>
      </div>
    `);

    markers[station.id] = marker;
  });

  // Render location cards in scroll area
  function renderLocationCards(filtered = BUDGET_STATIONS) {
    if (!listContainer) return;
    listContainer.innerHTML = filtered.map(s => `
      <div class="location-item" data-id="${s.id}" data-lat="${s.lat}" data-lng="${s.lng}">
        <div class="location-item-top">
          <span class="location-item-city">${s.city}</span>
          <span class="badge ${s.isAirport ? 'badge-orange' : 'badge-navy'}">${s.isAirport ? 'Airport' : 'Downtown Hub'}</span>
        </div>
        <h3 class="location-item-name">${s.name}</h3>
        <p class="location-item-addr">${s.address}</p>
        <div class="location-item-meta">
          <span><i class="fa-solid fa-clock"></i> ${s.hours}</span>
          <span><i class="fa-solid fa-phone"></i> <a href="tel:${s.phone.replace(/[^0-9+]/g, '')}" style="color: inherit; text-decoration: none;">${s.phone}</a></span>
        </div>
      </div>
    `).join("");

    // Add click listeners to focus marker
    listContainer.querySelectorAll(".location-item").forEach(item => {
      item.addEventListener("click", () => {
        const id = item.dataset.id;
        const lat = parseFloat(item.dataset.lat);
        const lng = parseFloat(item.dataset.lng);

        listContainer.querySelectorAll(".location-item").forEach(c => c.classList.remove("selected"));
        item.classList.add("selected");

        map.flyTo([lat, lng], 13, { duration: 1.2 });
        if (markers[id]) markers[id].openPopup();
      });
    });
  }

  renderLocationCards();

  // Homepage: Sync all 17 station boxes with Leaflet map
  const homeChips = document.querySelectorAll(".home-station-chip");
  if (homeChips.length > 0) {
    homeChips.forEach(chip => {
      chip.addEventListener("click", (e) => {
        const id = chip.dataset.id;
        const station = BUDGET_STATIONS.find(s => s.id === id);
        if (station && markers[id]) {
          e.preventDefault();
          homeChips.forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          map.flyTo([station.lat, station.lng], 13, { duration: 1.2 });
          markers[id].openPopup();
        }
      });
    });

    // When clicking any marker on the map, highlight corresponding chip
    BUDGET_STATIONS.forEach(s => {
      if (markers[s.id]) {
        markers[s.id].on("click", () => {
          homeChips.forEach(c => c.classList.remove("active"));
          const activeChip = document.querySelector(`.home-station-chip[data-id="${s.id}"]`);
          if (activeChip) {
            activeChip.classList.add("active");
            activeChip.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        });
      }
    });
  }

  // URL Parameter Handling: Focus target station on load (e.g. ?station=glenmarie-hq)
  const urlParams = new URLSearchParams(window.location.search);
  const targetStationId = urlParams.get("station") || urlParams.get("pickup");
  if (targetStationId) {
    const targetStation = BUDGET_STATIONS.find(s => s.id === targetStationId);
    if (targetStation) {
      setTimeout(() => {
        const targetCard = listContainer?.querySelector(`.location-item[data-id="${targetStationId}"]`);
        if (targetCard) {
          listContainer.querySelectorAll(".location-item").forEach(c => c.classList.remove("selected"));
          targetCard.classList.add("selected");
          targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        map.flyTo([targetStation.lat, targetStation.lng], 14, { duration: 1.2 });
        if (markers[targetStationId]) markers[targetStationId].openPopup();
      }, 400);
    }
  }

  // Search filter
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = BUDGET_STATIONS.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.city.toLowerCase().includes(q) || 
        s.address.toLowerCase().includes(q)
      );
      renderLocationCards(filtered);
    });
  }

  // Region tabs filter
  regionBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      regionBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const reg = btn.dataset.region;
      const filtered = reg === "all" ? BUDGET_STATIONS : BUDGET_STATIONS.filter(s => s.region === reg);
      renderLocationCards(filtered);
    });
  });
}

// --------------------------------------------------------------------------
// 12. Offer Page (Copy Promo Code & Interactive Poster Switcher)
// --------------------------------------------------------------------------
function setupOfferPage() {
  const copyButtons = document.querySelectorAll(".btn-copy-code");
  copyButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const code = btn.dataset.code;
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          showToast(`Coupon code "${code}" copied to clipboard!`);
          setTimeout(() => {
            btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy Code';
          }, 2500);
        }).catch(() => {
          showToast(`Coupon: ${code}`);
        });
      }
    });
  });

  // Poster Tab Switcher (Lifestyle vs Pricing Breakdown)
  const posterImg = document.getElementById("petaPoketPosterImg");
  const tabBtns = document.querySelectorAll(".poster-tab-btn");
  if (posterImg && tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const posterSrc = btn.dataset.poster;
        if (posterSrc) {
          posterImg.style.opacity = "0.3";
          setTimeout(() => {
            posterImg.src = posterSrc;
            posterImg.style.opacity = "1";
          }, 140);
        }
      });
    });
  }
}

// --------------------------------------------------------------------------
// 13. Multi-Step Reservation Wizard (reservation.html)
// --------------------------------------------------------------------------
function setupReservationWizard() {
  const wizardContainer = document.getElementById("reservationWizard");
  if (!wizardContainer) return;

  let currentStep = 1;
  const totalSteps = 4;

  // Selected Booking State
  const bookingState = {
    pickupStation: "klia-t1",
    returnStation: "klia-t1",
    pickupDate: formatDateForInput(new Date()),
    pickupTime: "10:00",
    returnDate: formatDateForInput(new Date(Date.now() + 86400000 * 3)),
    returnTime: "10:00",
    selectedCar: BUDGET_FLEET[0], // Proton Persona 1.6 default
    addons: {
      scdw: true, // Super Collision Damage Waiver
      gps: false,
      babySeat: false,
      extraDriver: false
    },
    driver: {
      name: "",
      email: "",
      phone: "",
      flightNum: ""
    }
  };

  // Pre-fill from URL or SessionStorage
  const urlParams = new URLSearchParams(window.location.search);
  const sessionSearch = sessionStorage.getItem("budget_search");
  if (sessionSearch) {
    try {
      const parsed = JSON.parse(sessionSearch);
      if (parsed.pickup) bookingState.pickupStation = parsed.pickup;
      if (parsed.pickupDate) bookingState.pickupDate = parsed.pickupDate;
      if (parsed.returnDate) bookingState.returnDate = parsed.returnDate;
    } catch (e) {}
  }

  if (urlParams.get("car")) {
    const matched = BUDGET_FLEET.find(c => c.id === urlParams.get("car"));
    if (matched) bookingState.selectedCar = matched;
  }
  if (urlParams.get("pickup")) bookingState.pickupStation = urlParams.get("pickup");
  if (urlParams.get("pickupDate")) bookingState.pickupDate = urlParams.get("pickupDate");
  if (urlParams.get("returnDate")) bookingState.returnDate = urlParams.get("returnDate");

  // Sync initial form values to bookingState
  const wizPickupEl = document.getElementById("wizPickup");
  if (wizPickupEl && bookingState.pickupStation) {
    wizPickupEl.value = bookingState.pickupStation;
    wizPickupEl.addEventListener("change", () => {
      bookingState.pickupStation = wizPickupEl.value;
      if (document.getElementById("wizReturn")?.value === "") {
        bookingState.returnStation = wizPickupEl.value;
      }
      updateSummaryPanel();
    });
  }
  const wizReturnEl = document.getElementById("wizReturn");
  if (wizReturnEl) {
    if (bookingState.returnStation) wizReturnEl.value = bookingState.returnStation;
    wizReturnEl.addEventListener("change", () => {
      bookingState.returnStation = wizReturnEl.value || bookingState.pickupStation;
      updateSummaryPanel();
    });
  }
  const wizPDateEl = document.getElementById("wizPickupDate");
  if (wizPDateEl && bookingState.pickupDate) wizPDateEl.value = bookingState.pickupDate;
  const wizRDateEl = document.getElementById("wizReturnDate");
  if (wizRDateEl && bookingState.returnDate) wizRDateEl.value = bookingState.returnDate;

  // Step Indicators & Panels
  const stepIndicators = document.querySelectorAll(".step-indicator");
  const panels = document.querySelectorAll(".wizard-step-panel");

  function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    currentStep = step;

    panels.forEach(p => p.classList.remove("active"));
    const activePanel = document.getElementById(`wizardStep${step}`);
    if (activePanel) activePanel.classList.add("active");

    stepIndicators.forEach((ind, i) => {
      ind.classList.remove("active", "completed");
      if (i + 1 === step) ind.classList.add("active");
      else if (i + 1 < step) ind.classList.add("completed");
    });

    updateSummaryPanel();
    window.scrollTo({ top: wizardContainer.offsetTop - 100, behavior: "smooth" });
  }

  // Next & Back Buttons
  document.querySelectorAll("[data-wizard-next]").forEach(btn => {
    btn.addEventListener("click", () => {
      // Validate step 1
      if (currentStep === 1) {
        const pDate = document.getElementById("wizPickupDate")?.value;
        const rDate = document.getElementById("wizReturnDate")?.value;
        if (rDate < pDate) {
          alert("Return date cannot be earlier than pickup date.");
          return;
        }
        bookingState.pickupDate = pDate;
        bookingState.returnDate = rDate;
        bookingState.pickupStation = document.getElementById("wizPickup")?.value;
        bookingState.returnStation = document.getElementById("wizReturn")?.value;
      }
      // Validate step 4
      if (currentStep === 4) {
        completeBooking();
        return;
      }
      goToStep(currentStep + 1);
    });
  });

  document.querySelectorAll("[data-wizard-prev]").forEach(btn => {
    btn.addEventListener("click", () => {
      goToStep(currentStep - 1);
    });
  });

  // Render Vehicles in Step 2
  const vehicleListContainer = document.getElementById("wizVehicleList");
  if (vehicleListContainer) {
    vehicleListContainer.innerHTML = BUDGET_FLEET.map(car => `
      <div class="vehicle-select-item ${car.id === bookingState.selectedCar.id ? 'selected' : ''}" data-id="${car.id}">
        <img class="v-select-img" src="${car.image}" alt="${car.title}">
        <div class="v-select-info">
          <h4>${car.title}</h4>
          <p><i class="fa-solid fa-users"></i> ${car.seats} Seats · <i class="fa-solid fa-suitcase"></i> ${car.bags} Bags · ${car.transmission}</p>
        </div>
        <div class="v-select-price">
          <b>RM ${car.dailyRate}</b>
          <small>/ day</small>
        </div>
      </div>
    `).join("");

    vehicleListContainer.querySelectorAll(".vehicle-select-item").forEach(item => {
      item.addEventListener("click", () => {
        vehicleListContainer.querySelectorAll(".vehicle-select-item").forEach(i => i.classList.remove("selected"));
        item.classList.add("selected");
        const found = BUDGET_FLEET.find(c => c.id === item.dataset.id);
        if (found) {
          bookingState.selectedCar = found;
          updateSummaryPanel();
        }
      });
    });
  }

  // Setup Addons listeners in Step 3
  ["scdw", "gps", "babySeat", "extraDriver"].forEach(addonKey => {
    const el = document.getElementById(`addon_${addonKey}`);
    if (el) {
      el.addEventListener("change", () => {
        bookingState.addons[addonKey] = el.checked;
        updateSummaryPanel();
      });
    }
  });

  // Calculate & Update Summary Sidebar
  function updateSummaryPanel() {
    const pDate = new Date(bookingState.pickupDate);
    const rDate = new Date(bookingState.returnDate);
    const diffTime = Math.abs(rDate - pDate);
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) || 1;

    const car = bookingState.selectedCar;
    const rate = days >= 7 ? car.weeklyRate : car.dailyRate;
    const baseTotal = rate * days;

    let addonDaily = 0;
    if (bookingState.addons.scdw) addonDaily += 35;
    if (bookingState.addons.gps) addonDaily += 20;
    if (bookingState.addons.babySeat) addonDaily += 25;
    if (bookingState.addons.extraDriver) addonDaily += 15;

    const addonsTotal = addonDaily * days;
    const subtotal = baseTotal + addonsTotal;
    const sst = Math.round(subtotal * 0.08);
    const grandTotal = subtotal + sst;

    const pickupStationObj = BUDGET_STATIONS.find(s => s.id === bookingState.pickupStation) || BUDGET_STATIONS[0];
    const returnStationObj = BUDGET_STATIONS.find(s => s.id === bookingState.returnStation) || pickupStationObj;

    // Update DOM nodes
    const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

    setText("sumCarName", car.title);
    setText("sumCarGroup", car.group);
    setText("sumDuration", `${days} Day${days > 1 ? 's' : ''}`);
    setText("sumDates", `${bookingState.pickupDate} -> ${bookingState.returnDate}`);
    setText("sumPickupStation", pickupStationObj.name);
    setText("sumReturnStation", returnStationObj.name);
    setText("sumRentalRate", `RM ${baseTotal} (${days}d @ RM${rate})`);
    setText("sumAddons", `RM ${addonsTotal}`);
    setText("sumSST", `RM ${sst}`);
    setText("sumGrandTotal", `RM ${grandTotal}`);

    const carImgEl = document.getElementById("sumCarImg");
    if (carImgEl) carImgEl.src = car.image;
  }

  // Complete Booking (Simulated Confirmation Voucher)
  function completeBooking() {
    const nameInput = document.getElementById("driverName")?.value || "Guest Traveler";
    const emailInput = document.getElementById("driverEmail")?.value || "traveler@example.com";
    const refNumber = "BM-" + Math.floor(100000 + Math.random() * 900000);

    const confirmationPanel = document.getElementById("wizardConfirmationModal");
    if (confirmationPanel) {
      document.getElementById("confRefNum").textContent = refNumber;
      document.getElementById("confDriverName").textContent = nameInput;
      document.getElementById("confEmail").textContent = emailInput;
      confirmationPanel.classList.add("active");
    } else {
      alert(`Booking Confirmed! Reference: ${refNumber}\nThank you for choosing Budget Malaysia.`);
    }
  }

  // Initial populate
  updateSummaryPanel();
}

// --------------------------------------------------------------------------
// 14. FAQ Accordion Interaction & FAQ Page Search/Filter
// --------------------------------------------------------------------------
function setupFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const btn = item.querySelector(".faq-question");
    if (btn) {
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        // Close others
        faqItems.forEach(i => i.classList.remove("open"));
        if (!isOpen) {
          item.classList.add("open");
        }
      });
    }
  });

  // Dedicated FAQ Page Search & Category Filter
  const faqSearch = document.getElementById("faqSearchInput");
  const faqCatPills = document.querySelectorAll(".faq-cat-pill");
  const allFaqList = document.querySelectorAll(".faq-page-content .faq-item");

  if (faqSearch && allFaqList.length > 0) {
    faqSearch.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      allFaqList.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? "" : "none";
      });
    });
  }

  if (faqCatPills.length > 0 && allFaqList.length > 0) {
    faqCatPills.forEach(pill => {
      pill.addEventListener("click", () => {
        faqCatPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        const cat = pill.dataset.category;
        allFaqList.forEach(item => {
          if (cat === "all" || item.dataset.category === cat) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }
}

// --------------------------------------------------------------------------
// 15. Full-Width Hero Banner Carousel (Image Slider)
// --------------------------------------------------------------------------
function setupHeroCarousel() {
  const carousel = document.getElementById("heroCarousel");
  const track = document.getElementById("carouselTrack");
  if (!carousel || !track) return;

  const slides = track.querySelectorAll(".carousel-slide");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  const dots = document.querySelectorAll(".carousel-dot");
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  let currentIndex = 0;
  let slideTimer = null;
  const SLIDE_INTERVAL_MS = 2500; // 2.5 seconds for comfortable reading of banner promotions and terms

  function updateSlide(animate = true) {
    track.style.transition = animate ? "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)" : "none";
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      const isActive = idx === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlide();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlide();
  }

  function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
      currentIndex = index;
      updateSlide();
    }
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideTimer = setInterval(nextSlide, SLIDE_INTERVAL_MS);
  }

  function stopAutoSlide() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
  }

  // Navigation Arrows
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAutoSlide();
    });
  }

  // Navigation Dots
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const targetIndex = parseInt(dot.dataset.slide, 10);
      goToSlide(targetIndex);
      startAutoSlide();
    });
  });

  // Pause auto-sliding when users hover over the banner
  carousel.addEventListener("mouseenter", stopAutoSlide);
  carousel.addEventListener("mouseleave", startAutoSlide);

  // Mobile Touch Swipe Navigation
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener("touchstart", (e) => {
    stopAutoSlide();
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoSlide();
  }, { passive: true });

  // Initialize carousel state and start timer
  updateSlide(false);
  startAutoSlide();
}


// --------------------------------------------------------------------------
// 14. 360° VIRTUAL SHOWROOM
// --------------------------------------------------------------------------

// Hotspot data for each car
const SHOWROOM_HOTSPOTS = {
  persona: {
    features: {
      title: "Features",
      items: [
        { icon: "fa-usb", text: "USB Connectivity & Bluetooth Audio" },
        { icon: "fa-suitcase-rolling", text: "Spacious Boot / Luggage Capacity" },
        { icon: "fa-snowflake", text: "Automatic Climate Control" },
        { icon: "fa-gauge-high", text: "Fuel-Efficient 1.6L Engine" },
        { icon: "fa-chair", text: "Comfortable Fabric Seats for 5" }
      ]
    },
    specifications: {
      title: "Specifications",
      items: [
        { icon: "fa-engine", text: "Engine: 1.6L 4-Cylinder VVT" },
        { icon: "fa-gears", text: "Transmission: CVT Automatic" },
        { icon: "fa-users", text: "Seating: 5 Passengers" },
        { icon: "fa-door-closed", text: "Doors: 4" },
        { icon: "fa-gas-pump", text: "Fuel: Petrol" },
        { icon: "fa-suitcase", text: "Luggage: 3 Bags" }
      ]
    },
    accessories: {
      title: "Accessories",
      items: [
        { icon: "fa-location-crosshairs", text: "GPS Navigation (Add-on)" },
        { icon: "fa-baby", text: "Child / Baby Seat (Add-on)" },
        { icon: "fa-wifi", text: "Mobile WiFi Hotspot (Add-on)" },
        { icon: "fa-phone", text: "Phone Holder & Charger" }
      ]
    },
    reviews: {
      title: "Reviews",
      items: [
        { icon: "fa-star", text: "Rating: 4.9 / 5.0 *****" },
        { icon: "fa-quote-left", text: "\"Perfect for city driving and road trips!\"" },
        { icon: "fa-quote-left", text: "\"Great fuel economy, smooth ride.\"" },
        { icon: "fa-thumbs-up", text: "98% of customers recommend this car" }
      ]
    },
    safety: {
      title: "Safety & Protection",
      items: [
        { icon: "fa-shield-halved", text: "CDW - Collision Damage Waiver included" },
        { icon: "fa-shield", text: "SCDW - Zero-Excess option available" },
        { icon: "fa-car-burst", text: "Excess: RM500 (standard CDW)" },
        { icon: "fa-user-shield", text: "Third-Party Liability Coverage" },
        { icon: "fa-triangle-exclamation", text: "24/7 Roadside Assistance" }
      ]
    },
    warranty: {
      title: "Warranty & Support",
      items: [
        { icon: "fa-certificate", text: "Well-maintained & regularly serviced" },
        { icon: "fa-phone-volume", text: "24/7 Roadside Assistance Hotline" },
        { icon: "fa-arrows-rotate", text: "Free vehicle replacement if breakdown > 2hrs" },
        { icon: "fa-headset", text: "Dedicated Customer Support: +603-7803 1122" }
      ]
    }
  },
  xpander: {
    features: {
      title: "Features",
      items: [
        { icon: "fa-users", text: "Spacious 7-Seater Configuration" },
        { icon: "fa-car", text: "Bold Design with Wide Flared Fenders" },
        { icon: "fa-volume-low", text: "Reduced Noise for Smooth Ride" },
        { icon: "fa-snowflake", text: "Dual-Zone Automatic Climate Control" },
        { icon: "fa-display", text: "7\" Touchscreen Infotainment System" }
      ]
    },
    specifications: {
      title: "Specifications",
      items: [
        { icon: "fa-engine", text: "Engine: 1.5L MIVEC 4-Cylinder" },
        { icon: "fa-gears", text: "Transmission: 4-Speed Automatic" },
        { icon: "fa-users", text: "Seating: 7 Passengers" },
        { icon: "fa-door-closed", text: "Doors: 5" },
        { icon: "fa-gas-pump", text: "Fuel: Petrol" },
        { icon: "fa-suitcase", text: "Luggage: 4 to 5 Bags" }
      ]
    },
    accessories: {
      title: "Accessories",
      items: [
        { icon: "fa-location-crosshairs", text: "GPS Navigation (Add-on)" },
        { icon: "fa-baby", text: "Child / Baby Seat (Add-on)" },
        { icon: "fa-wifi", text: "Mobile WiFi Hotspot (Add-on)" },
        { icon: "fa-box", text: "Roof Rack / Cargo Box (Add-on)" }
      ]
    },
    reviews: {
      title: "Reviews",
      items: [
        { icon: "fa-star", text: "Rating: 4.9 / 5.0 *****" },
        { icon: "fa-quote-left", text: "\"Perfect for family trips -- seats 7 comfortably!\"" },
        { icon: "fa-quote-left", text: "\"Fuel-efficient SUV, great highway performance.\"" },
        { icon: "fa-thumbs-up", text: "97% of customers recommend this car" }
      ]
    },
    safety: {
      title: "Safety & Protection",
      items: [
        { icon: "fa-shield-halved", text: "CDW - Collision Damage Waiver included" },
        { icon: "fa-shield", text: "SCDW - Zero-Excess option available" },
        { icon: "fa-car-burst", text: "Excess: RM1,000 (standard CDW)" },
        { icon: "fa-user-shield", text: "Third-Party Liability Coverage" },
        { icon: "fa-triangle-exclamation", text: "24/7 Roadside Assistance" }
      ]
    },
    warranty: {
      title: "Warranty & Support",
      items: [
        { icon: "fa-certificate", text: "Well-maintained & regularly serviced" },
        { icon: "fa-phone-volume", text: "24/7 Roadside Assistance Hotline" },
        { icon: "fa-arrows-rotate", text: "Free vehicle replacement if breakdown > 2hrs" },
        { icon: "fa-headset", text: "Dedicated Customer Support: +603-7803 1122" }
      ]
    }
  }
};

// 8-Angle Turntable Frame Sets (Official 360 photography)
const VEHICLE_360_FRAMES = {
  persona: [
    "assets/images/proton-persona-000.png",
    "assets/images/proton-persona-045.png",
    "assets/images/proton-persona-090.png",
    "assets/images/proton-persona-135.png",
    "assets/images/proton-persona-180.png",
    "assets/images/proton-persona-225.png",
    "assets/images/proton-persona-270.png",
    "assets/images/proton-persona-315.png"
  ],
  xpander: [
    "assets/images/mitsubishi-xpander-000.png",
    "assets/images/mitsubishi-xpander-045.png",
    "assets/images/mitsubishi-xpander-090.png",
    "assets/images/mitsubishi-xpander-135.png",
    "assets/images/mitsubishi-xpander-180.png",
    "assets/images/mitsubishi-xpander-225.png",
    "assets/images/mitsubishi-xpander-270.png",
    "assets/images/mitsubishi-xpander-315.png"
  ]
};

// Current showroom state
let showroomState = {
  carId: null,
  rotation: 0,
  autoSpin: false,
  autoSpinRAF: null,
  isDragging: false,
  dragStartX: 0,
  dragStartRotation: 0,
  activeView: "exterior"
};

function preloadShowroomFrames(carId) {
  const list = VEHICLE_360_FRAMES[carId];
  if (!list) return [];
  return list.map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });
}

function openShowroom(carId) {
  const car = BUDGET_FLEET.find(c => c.id === carId);
  if (!car) return;

  const modal = document.getElementById("showroomModal");
  if (!modal) return;

  showroomState.carId = carId;
  showroomState.rotation = 0;
  showroomState.autoSpin = false;
  showroomState.activeView = "exterior";

  // Preload frames for smooth rotation
  preloadShowroomFrames(carId);

  // Populate header
  document.getElementById("showroomTitle").textContent = car.title;
  document.getElementById("showroomClass").textContent = car.group;
  document.getElementById("showroomPrice").querySelector(".showroom-price-val").innerHTML =
    "RM " + car.dailyRate + " <small>/ day</small>";

  // Set car image directly to the transparent car illustration (000 front angle)
  const carImg = document.getElementById("car3dImg");
  const frames = VEHICLE_360_FRAMES[carId];
  if (frames && frames.length > 0) {
    carImg.src = frames[0];
  } else {
    carImg.src = car.image;
  }
  carImg.alt = car.title + " 360° View";
  carImg.className = "car-3d-img";
  carImg.style.transform = "";

  // Reset rotation and 3D turntable state
  updateRotation(0);

  // Reset tabs
  modal.querySelectorAll(".showroom-tab").forEach(t => t.classList.remove("active"));
  const extTab = modal.querySelector('.showroom-tab[data-view="exterior"]');
  if (extTab) extTab.classList.add("active");

  // Show exterior, hide interior
  document.getElementById("vehicleTurntable").style.display = "";
  document.getElementById("interiorView").style.display = "none";

  // Hide hotspot HUD
  const hud = document.getElementById("hotspotHud");
  if (hud) hud.style.display = "none";

  // Reset auto-spin button
  const spinBtn = document.getElementById("autoSpinBtn");
  if (spinBtn) spinBtn.classList.remove("active");

  // Update book now link
  const bookBtn = document.getElementById("showroomBookBtn");
  if (bookBtn) bookBtn.href = "reservation.html?car=" + car.id + "&category=" + car.category;

  // Show modal
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeShowroom() {
  const modal = document.getElementById("showroomModal");
  if (!modal) return;

  // Stop auto-spin
  showroomState.autoSpin = false;
  if (showroomState.autoSpinRAF) {
    cancelAnimationFrame(showroomState.autoSpinRAF);
    showroomState.autoSpinRAF = null;
  }

  modal.classList.remove("open");
  document.body.style.overflow = "";
}

function updateRotation(deg) {
  // Normalize to 0-360
  showroomState.rotation = ((deg % 360) + 360) % 360;
  const rot = showroomState.rotation;

  const carImg = document.getElementById("car3dImg");
  const shadow = document.querySelector(".car-shadow");
  const frames = VEHICLE_360_FRAMES[showroomState.carId];

  if (frames && frames.length === 8 && carImg) {
    // 8 sectors: 0..7
    // 0 is centered around 0° (i.e. -22.5° to +22.5°)
    const frameIdx = Math.round(rot / 45) % 8;
    carImg.src = frames[frameIdx];
    carImg.style.transform = "";
  }

  // Subtle natural contact shadow drift on floor
  const rad = (rot * Math.PI) / 180;
  if (shadow) {
    shadow.style.transform = `scale(${1 - Math.abs(Math.sin(rad)) * 0.08}) translateX(${Math.sin(rad) * 10}px)`;
  }

  const slider = document.getElementById("rotationSlider");
  if (slider) slider.value = Math.round(rot);

  const degreeDisplay = document.getElementById("rotationDegree");
  if (degreeDisplay) degreeDisplay.textContent = Math.round(rot) + "°";
}

function toggleAutoSpin() {
  showroomState.autoSpin = !showroomState.autoSpin;
  const spinBtn = document.getElementById("autoSpinBtn");

  if (showroomState.autoSpin) {
    if (spinBtn) spinBtn.classList.add("active");
    autoSpinLoop();
  } else {
    if (spinBtn) spinBtn.classList.remove("active");
    if (showroomState.autoSpinRAF) {
      cancelAnimationFrame(showroomState.autoSpinRAF);
      showroomState.autoSpinRAF = null;
    }
  }
}

function autoSpinLoop() {
  if (!showroomState.autoSpin) return;
  updateRotation(showroomState.rotation + 0.8);
  showroomState.autoSpinRAF = requestAnimationFrame(autoSpinLoop);
}

function applyColorFilter(color) {
  const carImg = document.getElementById("car3dImg");
  if (!carImg) return;

  // Remove all color filter classes
  carImg.classList.remove("color-navy", "color-white", "color-black", "color-red");

  showroomState.currentColor = color;

  if (color !== "default") {
    carImg.classList.add("color-" + color);
  }
}

function showHotspot(nodeKey) {
  const hotspots = SHOWROOM_HOTSPOTS[showroomState.carId];
  if (!hotspots || !hotspots[nodeKey]) return;

  const data = hotspots[nodeKey];
  const hud = document.getElementById("hotspotHud");
  const hudTitle = document.getElementById("hudTitle");
  const hudBody = document.getElementById("hudBody");

  if (!hud || !hudTitle || !hudBody) return;

  hudTitle.textContent = data.title;
  hudBody.innerHTML = data.items.map(item =>
    '<div class="hud-item"><i class="fa-solid ' + item.icon + '"></i><span>' + item.text + '</span></div>'
  ).join("");

  hud.style.display = "block";

  // Highlight active node
  document.querySelectorAll(".orbit-node-btn").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector('.orbit-node-btn[data-node="' + nodeKey + '"]');
  if (activeBtn) activeBtn.classList.add("active");
}

function setupShowroom() {
  const modal = document.getElementById("showroomModal");
  if (!modal) return;

  // Close handlers
  const closeBtn = document.getElementById("showroomClose");
  const backdrop = document.getElementById("showroomBackdrop");
  if (closeBtn) closeBtn.addEventListener("click", closeShowroom);
  if (backdrop) backdrop.addEventListener("click", closeShowroom);

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeShowroom();
    }
  });

  // ---- MOUSE DRAG ROTATION ----
  const turntable = document.getElementById("vehicleTurntable");
  if (turntable) {
    turntable.addEventListener("mousedown", (e) => {
      if (showroomState.activeView !== "exterior") return;
      showroomState.isDragging = true;
      showroomState.dragStartX = e.clientX;
      showroomState.dragStartRotation = showroomState.rotation;
      turntable.style.cursor = "grabbing";

      // Stop auto-spin while dragging
      if (showroomState.autoSpin) {
        showroomState.autoSpin = false;
        const spinBtn = document.getElementById("autoSpinBtn");
        if (spinBtn) spinBtn.classList.remove("active");
        if (showroomState.autoSpinRAF) {
          cancelAnimationFrame(showroomState.autoSpinRAF);
          showroomState.autoSpinRAF = null;
        }
      }
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!showroomState.isDragging) return;
      const deltaX = e.clientX - showroomState.dragStartX;
      const newRotation = showroomState.dragStartRotation + (deltaX * 0.5);
      updateRotation(newRotation);
    });

    document.addEventListener("mouseup", () => {
      if (showroomState.isDragging) {
        showroomState.isDragging = false;
        if (turntable) turntable.style.cursor = "grab";
      }
    });

    // Touch support
    turntable.addEventListener("touchstart", (e) => {
      if (showroomState.activeView !== "exterior") return;
      showroomState.isDragging = true;
      showroomState.dragStartX = e.touches[0].clientX;
      showroomState.dragStartRotation = showroomState.rotation;
    }, { passive: true });

    document.addEventListener("touchmove", (e) => {
      if (!showroomState.isDragging) return;
      const deltaX = e.touches[0].clientX - showroomState.dragStartX;
      const newRotation = showroomState.dragStartRotation + (deltaX * 0.5);
      updateRotation(newRotation);
    }, { passive: true });

    document.addEventListener("touchend", () => {
      showroomState.isDragging = false;
    });
  }

  // ---- ROTATION SLIDER ----
  const slider = document.getElementById("rotationSlider");
  if (slider) {
    slider.addEventListener("input", () => {
      updateRotation(parseInt(slider.value));
    });
  }

  // ---- SCRUBBER BUTTONS ----
  const scrubPrev = document.getElementById("scrubPrev");
  const scrubNext = document.getElementById("scrubNext");
  if (scrubPrev) {
    scrubPrev.addEventListener("click", () => {
      updateRotation(showroomState.rotation - 15);
    });
  }
  if (scrubNext) {
    scrubNext.addEventListener("click", () => {
      updateRotation(showroomState.rotation + 15);
    });
  }

  // ---- AUTO-SPIN ----
  const autoSpinBtn = document.getElementById("autoSpinBtn");
  if (autoSpinBtn) {
    autoSpinBtn.addEventListener("click", toggleAutoSpin);
  }

  // (Color swatches removed)

  // ---- HOTSPOT NODES ----
  modal.querySelectorAll(".orbit-node-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const nodeKey = btn.dataset.node;
      const hud = document.getElementById("hotspotHud");

      // Toggle: if same node is active, close HUD
      if (btn.classList.contains("active")) {
        btn.classList.remove("active");
        if (hud) hud.style.display = "none";
        return;
      }
      showHotspot(nodeKey);
    });
  });

  // ---- HUD CLOSE ----
  const hudClose = document.getElementById("hudClose");
  if (hudClose) {
    hudClose.addEventListener("click", () => {
      const hud = document.getElementById("hotspotHud");
      if (hud) hud.style.display = "none";
      modal.querySelectorAll(".orbit-node-btn").forEach(btn => btn.classList.remove("active"));
    });
  }

  // ---- EXTERIOR / INTERIOR TABS ----
  modal.querySelectorAll(".showroom-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      modal.querySelectorAll(".showroom-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const view = tab.dataset.view;
      showroomState.activeView = view;

      const turntableEl = document.getElementById("vehicleTurntable");
      const interiorEl = document.getElementById("interiorView");

      if (view === "exterior") {
        if (turntableEl) turntableEl.style.display = "";
        if (interiorEl) interiorEl.style.display = "none";
      } else {
        if (turntableEl) turntableEl.style.display = "none";
        if (interiorEl) interiorEl.style.display = "flex";
      }
    });
  });
}
