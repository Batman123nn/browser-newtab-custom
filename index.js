(function(){
  "use strict";

  var STORE_KEY = "localstart_v2";
  var WALLPAPER_INDEX_KEY = "localstart_brave_wallpaper_index";
  var WALLPAPER_BAG_KEY = "localstart_brave_wallpaper_bag";
  var WALLPAPER_DIR = "Assets/wallpapers/brave/";

  var ENGINES = {
    google:     { name: "Google",     url: "https://www.google.com/search?q=" },
    duckduckgo: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
    bing:       { name: "Bing",       url: "https://www.bing.com/search?q=" },
    brave:      { name: "Brave",      url: "https://search.brave.com/search?q=" },
    startpage:  { name: "Startpage",  url: "https://www.startpage.com/sp/search?query=" },
    ecosia:     { name: "Ecosia",     url: "https://www.ecosia.org/search?q=" }
  };

  var DEFAULT_LINKS = [];

  var ACCENT_PRESETS = [
    "#4b99c9", "#6c9bff", "#a78bfa", "#f472b6",
    "#fb923c", "#34d399", "#facc15", "#f87171"
  ];

  // Authentic Brave New Tab wallpapers, with attribution from Brave's own
  // backgrounds.ts files. No sponsored / New Tab Takeover images.
  var BRAVE_WALLPAPERS = [
    { f: "ntp-1.jpg", by: "Pok Rie", url: "https://www.pexels.com/@pok-rie-33563" },
    { f: "ntp-2.jpg", by: "Jack Millard", url: "https://unsplash.com/@millarjb" },
    { f: "ntp-3.jpg", by: "Buzz Andersen", url: "https://unsplash.com/@ldandersen" },
    { f: "ntp-4.jpg", by: "Frank McKenna", url: "https://unsplash.com/@frankiefoto" },
    { f: "ntp-5.jpg", by: "SpaceX", url: "https://www.flickr.com/photos/spacex/" },
    { f: "ntp-6.jpg", by: "SpaceX", url: "https://www.flickr.com/photos/spacex/" },
    { f: "ntp-7.jpg", by: "SpaceX", url: "https://www.flickr.com/photos/spacex/" },
    { f: "ntp-8.jpg", by: "Will Christiansen", url: "https://www.theskyfolk.com" },
    { f: "ntp-9.jpg", by: "Will Christiansen", url: "https://www.theskyfolk.com" },
    { f: "ntp-10.jpg", by: "Will Christiansen", url: "https://www.theskyfolk.com" },
    { f: "ntp-11.jpg", by: "Nout Gons", url: "https://www.instagram.com/ntgns/" },
    { f: "ntp-12.jpg", by: "Artem Bali", url: "https://www.pexels.com/@belart84" },
    { f: "ntp-13.jpg", by: "Hristo Fidanov", url: "https://www.pexels.com/@hristo-fidanov-520662" },
    { f: "ntp-14.jpg", by: "Life of Pix", url: "https://www.pexels.com/@life-of-pix" },
    { f: "ntp-15.jpg", by: "Cassie Boca", url: "https://unsplash.com/@cassieboca" },
    { f: "ntp-16.jpg", by: "Braden Jarvis", url: "https://unsplash.com/@jarvisphoto" },
    { f: "anders-jilden.jpg", by: "Anders Jildén", url: "https://unsplash.com/@andersjilden" },
    { f: "andreas-gucklhorn.jpg", by: "Andreas Gücklhorn", url: "https://unsplash.com/@draufsicht" },
    { f: "andy-mai.jpg", by: "Andy Mai", url: "https://unsplash.com/@veroz" },
    { f: "annie-spratt.jpg", by: "Annie Spratt", url: "https://unsplash.com/@anniespratt" },
    { f: "anton-repponen.jpg", by: "Anton Repponen", url: "https://unsplash.com/@repponen" },
    { f: "ben-karpinski.jpg", by: "Ben Karpinski", url: "https://www.benkarpinski.com/landscapes" },
    { f: "dc-cavalleri.jpg", by: "D.C. Cavalleri", url: "https://gradivis.com" },
    { f: "joe-gardner.jpg", by: "Joe Gardner", url: "https://unsplash.com/@josephgardnerphotography" },
    { f: "louis-kim.jpg", by: "Louis Kim", url: "http://louiskimphotography.com" },
    { f: "matt-palmer.jpg", by: "Matt Palmer", url: "https://unsplash.com/@mattpalmer" },
    { f: "oliwier-gesla.jpg", by: "Oliwier Gesla", url: "https://www.instagram.com/oliwiergesla/" },
    { f: "svalbard-jerol-soibam.jpg", by: "Jerol Soibam", url: "https://www.instagram.com/jerol_soibam" },
    { f: "will-christiansen-glacier-peak.jpg", by: "Will Christiansen", url: "https://www.theskyfolk.com" },
    { f: "will-christiansen-ice.jpg", by: "Will Christiansen", url: "https://www.theskyfolk.com" },
    { f: "xavier-balderas-cejudo.jpg", by: "Xavier Balderas Cejudo", url: "https://unsplash.com/@xavibalderas" },
    { f: "alex-plesovskich.jpg", by: "Alex Plesovskich", url: "https://unsplash.com/@aples" },
    { f: "andre-benz.jpg", by: "Andre Benz", url: "https://unsplash.com/@trapnation" },
    { f: "corwin-prescott_beach.jpg", by: "Corwin Prescott", url: null },
    { f: "corwin-prescott_canyon.jpg", by: "Corwin Prescott", url: null },
    { f: "corwin-prescott_crestone.jpg", by: "Corwin Prescott", url: null },
    { f: "corwin-prescott_olympic.jpg", by: "Corwin Prescott", url: null },
    { f: "dylan-malval_alps.jpg", by: "Dylan Malval", url: "https://www.instagram.com/vass_captures/" },
    { f: "dylan-malval_sea.jpg", by: "Dylan Malval", url: "https://www.instagram.com/vass_captures/" },
    { f: "sora-sagano.jpg", by: "Sora Sogano", url: "https://unsplash.com/@sorasagano" },
    { f: "spencer-moore_desert.jpg", by: "Spencer M. Moore", url: "https://www.smoorevisuals.com/landscapes" },
    { f: "spencer-moore_fern.jpg", by: "Spencer M. Moore", url: "https://www.smoorevisuals.com/landscapes" },
    { f: "spencer-moore_lake.jpg", by: "Spencer M. Moore", url: "https://www.smoorevisuals.com/landscapes" },
    { f: "spencer-moore_ocean.jpg", by: "Spencer M. Moore", url: "https://www.smoorevisuals.com/landscapes" },
    { f: "su-san-lee.jpg", by: "Su San Lee", url: "https://unsplash.com/@blackodc" },
    { f: "zane-lee.jpg", by: "Zane Lee", url: "https://unsplash.com/@zane4004" },
    { f: "pascal-debrunner.jpg", by: "Pascal Debrunner", url: "https://unsplash.com/photos/rugged-mountain-peaks-and-grassy-ridges-at-dawn-Z2720kCJg6I" },
    { f: "rafael-peier2.jpg", by: "Rafael Peier", url: "https://unsplash.com/photos/sand-dunes-with-long-shadows-dESI6T4gaN4" },
    { f: "david-becker.jpg", by: "David Becker", url: "https://unsplash.com/photos/vibrant-sunset-illuminates-ocean-waves-crashing-on-a-rocky-shore--ZQfwGY-RAo" },
    { f: "hunter-newton.jpg", by: "Hunter Newton", url: "https://unsplash.com/photos/waterfall-and-rocky-stream-flow-through-a-lush-dark-forest-TWrKDYt-vVM" },
    { f: "andrew-svk.jpg", by: "Andrew Svk", url: "https://unsplash.com/photos/a-mountain-range-with-a-pink-sky-in-the-background-150fZ07GQqs" },
    { f: "daniel-schwarz.jpg", by: "Daniel Schwarz", url: "https://unsplash.com/photos/lake-surrounded-by-forested-mountains-under-a-blue-sky-ZeGQ22v9Zhk" },
    { f: "gabriele-merlino.jpg", by: "Gabriele Merlino", url: "https://unsplash.com/photos/rowboats-on-clear-turquoise-water-fa5so58oDAI" },
    { f: "freestocks.jpg", by: "Freestocks", url: "https://unsplash.com/photos/green-field-plains-under-cloudy-sky-Gqc1jl2kd1U" },
    { f: "ken-cheung.jpg", by: "Ken Cheung", url: "https://unsplash.com/photos/a-sandbar-snakes-through-the-turquoise-ocean-water-gzMBvmSl95U" },
    { f: "kristaps-ungurs.jpg", by: "Kristaps Ungurs", url: "https://unsplash.com/photos/dark-lake-surrounded-by-vibrant-green-forest-aerial-view-bVy49uEJbpw" },
    { f: "john-murphey.jpg", by: "John Murphey", url: "https://unsplash.com/photos/the-sun-is-setting-over-the-sand-dunes-Mag-3qz3gko" },
    { f: "fudo-jahic.jpg", by: "Fudo Jahic", url: "https://unsplash.com/photos/brown-rock-formation-under-blue-sky-during-daytime-PQf2Vv7xWjo" },
    { f: "benjamin-hibbert.jpg", by: "Benjamin Hibbert", url: "https://unsplash.com/photos/rugged-coastal-rock-formations-with-waves-crashing-4IH2rRlCnKs" },
    { f: "juho-luomala.jpg", by: "Juho Luomala", url: "https://unsplash.com/photos/aurora-borealis-over-a-snowy-forest-road-pzBTqFBmEJc" },
    { f: "pascal-debrunner2.jpg", by: "Pascal Debrunner", url: "https://unsplash.com/photos/wildflowers-by-glacial-mountain-lake-d7Bvh_2cFnA" },
    { f: "fer-troulik.jpg", by: "Fer Troulik", url: "https://unsplash.com/photos/modern-building-facade-with-vertical-fins-and-a-glass-walkway-4Pf98CHLUzg" },
    { f: "mike-hindle.jpg", by: "Mike Hindle", url: "https://unsplash.com/photos/a-black-and-white-photo-of-a-spiral-staircase-tjafmz6trWg" },
    { f: "tom-moser.jpg", by: "Tom Moser", url: "https://unsplash.com/photos/a-city-with-many-buildings-uR6VahqorEk" },
    { f: "oliver-plattner.jpg", by: "Oliver Plattner", url: "https://unsplash.com/photos/golden-gate-bridge-in-san-francisco-Plt0vHDRb9U" },
    { f: "massimiliano-morosinotto.jpg", by: "Massimiliano Morosinotto", url: "https://unsplash.com/photos/low-angle-photography-of-buildings-YMPUJexvNa8" },
    { f: "anton-volnuhin.jpg", by: "Anton Volnuhin", url: "https://unsplash.com/photos/a-shadow-of-a-building-on-a-wall-N8ucHGuZtUs" },
    { f: "rafael-peier.jpg", by: "Rafael Peier", url: "https://unsplash.com/photos/close-up-of-vibrant-orange-flower-petals-with-dew-drops-S1vS1KgQCug" },
    { f: "neom.jpg", by: "Neom", url: "https://unsplash.com/photos/a-large-group-of-fish-swimming-over-a-coral-reef-bOMVTvE2QFU" },
    { f: "david-clode.jpg", by: "David Clode", url: "https://unsplash.com/photos/a-chameleons-colorful-tail-curled-into-a-spiral-on-black-oGmKb2DJHfA" },
    { f: "elizabeth-gottwald.jpg", by: "Elizabeth Gottwald", url: "https://unsplash.com/photos/white-and-pink-herons-in-beach-IpbnuyBWQqY" },
    { f: "ngoc-nguyen-phuong.jpg", by: "Ngoc Nguyen Phuong", url: "https://unsplash.com/photos/variegated-leaf-among-lush-green-foliage-M6BMH-9Aj8Q" },
    { f: "daniil-komov.jpg", by: "Daniil Komov", url: "https://unsplash.com/photos/a-small-bird-sitting-on-top-of-a-dry-grass-dSZyPg9rCRA" },
    { f: "fabio-sasso.jpg", by: "Fabio Sasso", url: "https://unsplash.com/photos/sunset-over-a-lake-seen-through-silhouetted-forest-trees-T_YG9paUo5I" },
    { f: "lukasz-rawa.jpg", by: "Lukasz Rawa", url: "https://unsplash.com/photos/dark-green-leaves-with-red-veins-CdA2yxbG1hg" },
    { f: "damian-kamp.jpg", by: "Damian Kamp", url: "https://unsplash.com/photos/dynamic-blue-ocean-waves-with-white-foam-and-motion-blur-NFALS3IsNBg" },
    { f: "xiao-lou.jpg", by: "Xiao Lou", url: "https://unsplash.com/photos/abstract-blue-ice-formations-create-a-textured-pattern-rBDQ9WrnvUA" },
    { f: "veli-batuhan.jpg", by: "Veli Batuhan Aytaç", url: "https://unsplash.com/photos/abstract-iridescent-curves-on-a-black-background-p-8ZW6wy1QM" },
    { f: "daniil-silantev.jpg", by: "Daniil Silantev", url: "https://unsplash.com/photos/sunset-reflects-over-water-with-tall-grass-in-focus-xUfATl0k8Cg" },
    { f: "milad-fakurian.jpg", by: "Milad Fakurian", url: "https://unsplash.com/photos/abstract-purple-and-pink-gradient-waves-nY14Fs8pxT8" },
    { f: "daniel-olah.jpg", by: "Daniel Olah", url: "https://unsplash.com/photos/sand-dunes-under-starry-night-sky-6KQETG8J-zI" },
    { f: "alex-oviedo.jpg", by: "Alex Oviedo", url: "https://alexovi.com/" },
    { f: "mogli-maureal.jpg", by: "Mogli Maureal", url: "https://www.themogli.com/" },
    { f: "nicholas-stankus.jpg", by: "Nicholas Stankus", url: "https://www.nixter.net/" },
    { f: "matteo-menardi.jpg", by: "Matteo Menardi", url: "https://matteomenardimenego.com/" },
    { f: "pedro-gomes.jpg", by: "Pedro Gomes", url: "https://unsplash.com/@mgomespedro" }
  ];

  var DAYS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var DAYS_HR = ["Nedjelja","Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak","Subota"];
  var MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var MONTHS_HR = ["siječnja","veljače","ožujka","travnja","svibnja","lipnja","srpnja","kolovoza","rujna","listopada","studenoga","prosinca"];

  function $(id){ return document.getElementById(id); }

  function loadState(){
    try{
      var raw = localStorage.getItem(STORE_KEY);
      if(!raw) return null;
      return JSON.parse(raw);
    }catch(e){ return null; }
  }

  function defaultState(){
    return {
      wallpaper: null,
      engine: "duckduckgo",
      credit: "",
      links: DEFAULT_LINKS.slice(),
      lang: "en",
      timeFormat: "24",
      showSeconds: false,
      accentColor: "#4b99c9",
      clockSize: 128,
      clockX: 0,
      clockY: 0,
      searchY: 0,
      addBtnY: 0,
      showAddButton: true,
      overlayOpacity: 100,
      gradA: "#1d1915",
      gradB: "#14110e",
      greeting: "",
      braveShuffle: true,
      showPhotoCredit: true,
      lastBraveIndex: -1,
      wallpaperBag: []
    };
  }

  var state = Object.assign(defaultState(), loadState() || {});

  // A shuffled bag of every wallpaper index. Each pick removes one entry, so
  // nothing repeats until the bag is empty; then a fresh shuffled bag starts.
  function freshWallpaperBag(lastIndex){
    var bag = [];
    for(var i = 0; i < BRAVE_WALLPAPERS.length; i++) bag.push(i);
    for(var i = bag.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = bag[i]; bag[i] = bag[j]; bag[j] = tmp;
    }
    // We pop from the end, so keep the just-used photo off the top of a
    // new cycle when possible.
    if(bag.length > 1 && bag[bag.length - 1] === lastIndex){
      var k = Math.floor(Math.random() * (bag.length - 1));
      var swap = bag[bag.length - 1];
      bag[bag.length - 1] = bag[k];
      bag[k] = swap;
    }
    return bag;
  }

  function loadWallpaperBagState(){
    try{
      var data = JSON.parse(localStorage.getItem(WALLPAPER_BAG_KEY));
      if(data && data.count === BRAVE_WALLPAPERS.length && Array.isArray(data.remaining)){
        var seen = {}, clean = [];
        data.remaining.forEach(function(n){
          if(typeof n === "number" && n >= 0 && n < BRAVE_WALLPAPERS.length && !seen[n]){
            seen[n] = 1;
            clean.push(n);
          }
        });
        if(clean.length){
          return {
            bag: clean,
            last: (typeof data.last === "number") ? data.last : -1
          };
        }
      }
    }catch(e){ /* ignore */ }

    // Migrate the older single-index key.
    var last = -1;
    try{
      var old = parseInt(localStorage.getItem(WALLPAPER_INDEX_KEY), 10);
      if(!isNaN(old) && old >= 0 && old < BRAVE_WALLPAPERS.length) last = old;
    }catch(e){ /* ignore */ }
    return { bag: freshWallpaperBag(last), last: last };
  }

  function saveWallpaperBag(){
    try{
      localStorage.setItem(WALLPAPER_BAG_KEY, JSON.stringify({
        count: BRAVE_WALLPAPERS.length,
        last: state.lastBraveIndex,
        remaining: state.wallpaperBag
      }));
      localStorage.setItem(WALLPAPER_INDEX_KEY, String(state.lastBraveIndex));
    }catch(e){ /* non-fatal */ }
  }

  var loadedBag = loadWallpaperBagState();
  state.wallpaperBag = loadedBag.bag;
  state.lastBraveIndex = loadedBag.last;

  function save(){
    try{
      var toStore = Object.assign({}, state);
      // Kept in its own tiny key so a large uploaded image doesn't get
      // re-serialized every time a new wallpaper is picked.
      delete toStore.lastBraveIndex;
      delete toStore.wallpaperBag;
      localStorage.setItem(STORE_KEY, JSON.stringify(toStore));
      return true;
    }catch(e){
      alert("Couldn't save — the image is probably too large. Try a smaller file (under ~3-4MB).");
      return false;
    }
  }

  /* ---------- accent color ---------- */
  function hexToRgb(hex){
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return {r:r, g:g, b:b};
  }
  function applyAccent(){
    var c = hexToRgb(state.accentColor);
    var root = document.documentElement.style;
    root.setProperty("--accent", state.accentColor);
    root.setProperty("--accent-soft", "rgba("+c.r+","+c.g+","+c.b+",0.35)");
    root.setProperty("--accent-glow", "rgba("+c.r+","+c.g+","+c.b+",0.18)");
  }

  /* ---------- clock ---------- */
  function formatDate(d){
    var lang = state.lang;
    var dayName = lang === "hr" ? DAYS_HR[d.getDay()] : DAYS_EN[d.getDay()];
    var monthName = lang === "hr" ? MONTHS_HR[d.getMonth()] : MONTHS_EN[d.getMonth()];
    if(lang === "hr"){
      return dayName + ", " + d.getDate() + ". " + monthName + " " + d.getFullYear() + ".";
    }
    return dayName + ", " + monthName + " " + d.getDate();
  }

  function formatTime(d){
    var h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
    var suffix = "";
    if(state.timeFormat === "12"){
      suffix = h >= 12 ? " PM" : " AM";
      h = h % 12 || 12;
    }
    var pad = function(n){ return n < 10 ? "0" + n : "" + n; };
    var str = pad(h) + ":" + pad(m);
    if(state.showSeconds) str += ":" + pad(s);
    return str + suffix;
  }

  function tick(){
    var now = new Date();
    $("clock").textContent = formatTime(now);
    $("date").textContent = formatDate(now);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- wallpaper ---------- */
  var wallpaperEl = $("wallpaper");
  var creditEl = $("credit");
  var currentBraveUrl = null;
  var braveCreditText = "";
  var braveCreditLink = null;
  var wallpaperLoadId = 0;

  function setCredit(text, link){
    creditEl.innerHTML = "";
    if(!text){ creditEl.textContent = "\u00a0"; return; }
    if(link){
      var a = document.createElement("a");
      a.href = link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = text;
      creditEl.appendChild(a);
    } else {
      creditEl.textContent = text;
    }
  }

  function applyWallpaper(){
    if(state.braveShuffle && currentBraveUrl){
      wallpaperEl.style.backgroundImage = "url(" + currentBraveUrl + ")";
      wallpaperEl.classList.remove("empty");
      if(state.showPhotoCredit) setCredit(braveCreditText, braveCreditLink);
      else setCredit("", null);
    } else if(state.wallpaper){
      wallpaperEl.style.backgroundImage = "url(" + state.wallpaper + ")";
      wallpaperEl.classList.remove("empty");
      setCredit(state.credit || "", null);
    } else {
      wallpaperEl.style.backgroundImage = "";
      wallpaperEl.classList.add("empty");
      setCredit(state.credit || "", null);
    }
  }

  function pickRandomIndex(){
    if(BRAVE_WALLPAPERS.length <= 1) return 0;

    if(!state.wallpaperBag.length){
      state.wallpaperBag = freshWallpaperBag(state.lastBraveIndex);
    }
    // Pop from the pre-shuffled bag: every wallpaper is used exactly once
    // before the whole set starts over.
    var index = state.wallpaperBag.pop();
    state.lastBraveIndex = index;
    saveWallpaperBag();
    return index;
  }

  function pickBraveWallpaper(){
    if(!BRAVE_WALLPAPERS.length || !state.braveShuffle) return;
    var index = pickRandomIndex();
    var item = BRAVE_WALLPAPERS[index];
    var url = WALLPAPER_DIR + item.f;
    var thisLoad = ++wallpaperLoadId;

    // Preload before swapping, so we never show a half-loaded background.
    var img = new Image();
    img.onload = function(){
      if(thisLoad !== wallpaperLoadId || !state.braveShuffle) return;
      currentBraveUrl = url;
      braveCreditText = "Photo by " + item.by + " · Brave";
      braveCreditLink = item.url;
      wallpaperEl.classList.add("fade");
      applyWallpaper();
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ wallpaperEl.classList.remove("fade"); });
      });
    };
    img.onerror = function(){
      if(thisLoad !== wallpaperLoadId) return;
      currentBraveUrl = null;
      applyWallpaper();
    };
    img.src = url;
  }

  function syncShuffleUI(){
    var on = !!state.braveShuffle;
    $("braveShuffleToggle").classList.toggle("on", on);
    $("braveShuffleToggle").setAttribute("aria-checked", on);
    $("shuffleBtn").classList.toggle("hidden", !on);
    $("newWallpaperBtn").disabled = !on;
  }

  function applyOverlay(){
    document.documentElement.style.setProperty("--overlay-opacity", (state.overlayOpacity / 100).toString());
  }
  function applyGradient(){
    var root = document.documentElement.style;
    root.setProperty("--grad-a", state.gradA);
    root.setProperty("--grad-b", state.gradB);
  }
  function applyClockSize(){
    document.documentElement.style.setProperty("--clock-size", state.clockSize + "px");
  }
  function applyClockPos(){
    var root = document.documentElement.style;
    root.setProperty("--clock-x", state.clockX + "px");
    root.setProperty("--clock-y", state.clockY + "px");
  }
  function applySearchPos(){
    document.documentElement.style.setProperty("--search-y", state.searchY + "px");
  }
  function applyAddBtnPos(){
    document.documentElement.style.setProperty("--add-btn-y", state.addBtnY + "px");
  }

  function fileToDataURL(file, cb){
    var reader = new FileReader();
    reader.onload = function(){ cb(reader.result); };
    reader.readAsDataURL(file);
  }

  $("shuffleBtn").addEventListener("click", pickBraveWallpaper);
  $("newWallpaperBtn").addEventListener("click", pickBraveWallpaper);

  $("chooseWallpaper").addEventListener("click", function(){ $("wallpaperInput").click(); });
  $("wallpaperInput").addEventListener("change", function(e){
    var file = e.target.files && e.target.files[0];
    if(!file) return;
    fileToDataURL(file, function(dataUrl){
      state.wallpaper = dataUrl;
      state.braveShuffle = false;
      currentBraveUrl = null;
      wallpaperLoadId++;
      if(save()){
        syncShuffleUI();
        applyWallpaper();
      }
    });
  });
  $("clearWallpaper").addEventListener("click", function(){
    state.wallpaper = null;
    state.braveShuffle = false;
    currentBraveUrl = null;
    wallpaperLoadId++;
    save();
    syncShuffleUI();
    applyWallpaper();
  });

  /* ---------- search ---------- */
  function populateEngineSelects(){
    [$("engineSelect"), $("engineSelectPanel")].forEach(function(sel){
      sel.innerHTML = "";
      Object.keys(ENGINES).forEach(function(key){
        var opt = document.createElement("option");
        opt.value = key;
        opt.textContent = ENGINES[key].name;
        if(key === state.engine) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.onchange = function(e){
        state.engine = e.target.value;
        save();
        populateEngineSelects();
      };
    });
  }

  function looksLikeUrl(q){
    return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}([\/?#].*)?$/i.test(q.trim());
  }

  $("searchForm").addEventListener("submit", function(e){
    e.preventDefault();
    var q = $("searchInput").value.trim();
    if(!q){
      var submit = document.querySelector(".search-submit");
      submit.classList.remove("jiggle");
      void submit.offsetWidth;
      submit.classList.add("jiggle");
      $("searchInput").focus();
      return;
    }
    hideSuggestions();
    if(looksLikeUrl(q)){
      window.location.href = /^https?:\/\//i.test(q) ? q : "https://" + q;
    } else {
      var engine = ENGINES[state.engine] || ENGINES.duckduckgo;
      window.location.href = engine.url + encodeURIComponent(q);
    }
  });

  /* ---------- search suggestions ---------- */
  var debounceTimer = null;
  var typingTimer = null;
  var suggestionsEl = $("suggestions");
  var searchInput = $("searchInput");

  function hideSuggestions(){
    suggestionsEl.classList.remove("open");
    suggestionsEl.innerHTML = "";
  }

  function showSuggestions(items){
    suggestionsEl.innerHTML = "";
    if(!items.length){ hideSuggestions(); return; }
    items.forEach(function(text){
      var div = document.createElement("div");
      div.className = "suggestion-item";
      div.innerHTML = '<svg class="sug-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg>' + text;
      div.addEventListener("click", function(){
        searchInput.value = text;
        hideSuggestions();
        $("searchForm").dispatchEvent(new Event("submit"));
      });
      suggestionsEl.appendChild(div);
    });
    suggestionsEl.classList.add("open");
  }

  function fetchSuggestions(query){
    // MV3 extensions cannot load remote JSONP scripts, so use
    // an extension-authorized request there. Normal pages use JSONP.
    if(window.location.protocol === "chrome-extension:" ||
       window.location.protocol === "moz-extension:"){
      fetch("https://suggestqueries.google.com/complete/search?client=firefox&q=" +
        encodeURIComponent(query))
        .then(function(response){
          if(!response.ok) throw new Error("HTTP " + response.status);
          return response.json();
        })
        .then(function(data){
          var items = (data && Array.isArray(data[1])) ? data[1] : [];
          showSuggestions(items.slice(0, 8));
        })
        .catch(function(){
          hideSuggestions();
        });
      return;
    }

    // JSONP bypasses CORS for normal HTTP/HTTPS pages.
    var callbackName = "_sugCb_" + Date.now();
    var script = document.createElement("script");
    script.src = "https://suggestqueries.google.com/complete/search?client=chrome&q=" +
      encodeURIComponent(query) + "&callback=" + callbackName;

    window[callbackName] = function(data){
      // Google returns: ["query", ["suggestion1", "suggestion2", ...]]
      var items = (data && Array.isArray(data[1])) ? data[1] : [];
      showSuggestions(items.slice(0, 8));
      cleanup();
    };

    script.onerror = function(){
      console.warn("Suggestions failed to load");
      hideSuggestions();
      cleanup();
    };

    function cleanup(){
      delete window[callbackName];
      if(script.parentNode) script.parentNode.removeChild(script);
    }

    document.head.appendChild(script);
  }

  searchInput.addEventListener("input", function(e){
    var q = e.target.value.trim();
    clearTimeout(debounceTimer);
    clearTimeout(typingTimer);
    var bar = $("searchForm");
    bar.classList.add("typing");
    typingTimer = setTimeout(function(){ bar.classList.remove("typing"); }, 650);
    if(!q){ hideSuggestions(); return; }
    debounceTimer = setTimeout(function(){ fetchSuggestions(q); }, 200);
  });

  searchInput.addEventListener("blur", function(){
    setTimeout(hideSuggestions, 200);
  });

  searchInput.addEventListener("focus", function(){
    var q = searchInput.value.trim();
    if(q) fetchSuggestions(q);
  });

  // Clicking anywhere on the pill (padding, glow edge, empty space) should
  // start typing, not only the text field in the middle.
  function isInside(el, parent){
    while(el){
      if(el === parent) return true;
      el = el.parentNode;
    }
    return false;
  }
  $("searchForm").addEventListener("click", function(e){
    if(isInside(e.target, $("engineSelect")) || isInside(e.target, this.querySelector(".search-submit"))) return;
    searchInput.focus({ preventScroll: true });
  });

  /* ---------- greeting ---------- */
  function applyGreeting(){
    $("greeting").textContent = state.greeting || "";
    $("greeting").style.display = state.greeting ? "" : "none";
  }

  /* ---------- segmented toggle helper ---------- */
  function setupSegToggle(el, key, onChange){
    var btns = el.querySelectorAll("button");
    btns.forEach(function(btn){
      if(btn.dataset.val === state[key]) btn.classList.add("active");
      else btn.classList.remove("active");
      btn.addEventListener("click", function(){
        state[key] = btn.dataset.val;
        save();
        btns.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        if(onChange) onChange();
      });
    });
  }

  /* ---------- toggle switch helper ---------- */
  function setupToggle(btnEl, key, onChange){
    if(state[key]) btnEl.classList.add("on");
    else btnEl.classList.remove("on");
    btnEl.setAttribute("aria-checked", !!state[key]);
    btnEl.addEventListener("click", function(){
      state[key] = !state[key];
      save();
      btnEl.classList.toggle("on", state[key]);
      btnEl.setAttribute("aria-checked", !!state[key]);
      if(onChange) onChange();
    });
  }

  /* ---------- links ---------- */
  function renderLinks(){
    var wrap = $("links");
    wrap.innerHTML = "";
    state.links.forEach(function(link, idx){
      var a = document.createElement("a");
      a.className = "link-chip";
      a.href = link.url;
      a.style.animationDelay = (0.5 + idx * 0.07) + "s";
      var dot = document.createElement("span");
      dot.className = "link-dot";
      a.appendChild(dot);
      var label = document.createElement("span");
      label.textContent = link.name;
      a.appendChild(label);
      var rm = document.createElement("span");
      rm.className = "remove";
      rm.textContent = "✕";
      rm.title = "Remove";
      rm.addEventListener("click", function(ev){
        ev.preventDefault(); ev.stopPropagation();
        state.links.splice(idx, 1);
        save();
        renderLinks();
      });
      a.appendChild(rm);
      wrap.appendChild(a);
    });

    var add = document.createElement("button");
    add.type = "button";
    add.className = "link-chip add-chip" + (state.showAddButton ? "" : " hidden");
    add.textContent = "+ add";
    add.addEventListener("click", openPanel);
    wrap.appendChild(add);
  }

  $("addLink").addEventListener("click", function(){
    var name = $("linkName").value.trim();
    var url = $("linkUrl").value.trim();
    if(!name || !url) return;
    if(!/^https?:\/\//i.test(url)) url = "https://" + url;
    state.links.push({ name: name, url: url });
    save();
    renderLinks();
    $("linkName").value = "";
    $("linkUrl").value = "";
  });

  /* ---------- panel ---------- */
  var panel = $("panel");
  var scrim = $("scrim");

  function openPanel(){
    $("creditInput").value = state.credit || "";
    $("greetingInput").value = state.greeting || "";
    panel.classList.add("open");
    scrim.classList.add("open");
  }
  function closePanelFn(){
    panel.classList.remove("open");
    scrim.classList.remove("open");
  }
  $("settingsBtn").addEventListener("click", openPanel);
  $("closePanel").addEventListener("click", closePanelFn);
  scrim.addEventListener("click", closePanelFn);

  $("creditInput").addEventListener("input", function(e){
    state.credit = e.target.value;
    save();
    applyWallpaper();
  });

  $("greetingInput").addEventListener("input", function(e){
    state.greeting = e.target.value;
    save();
    applyGreeting();
  });

  /* ---------- accent presets ---------- */
  function renderAccentPresets(){
    var wrap = $("accentPresets");
    wrap.innerHTML = "";
    ACCENT_PRESETS.forEach(function(hex){
      var btn = document.createElement("button");
      btn.className = "accent-swatch" + (hex === state.accentColor ? " active" : "");
      btn.style.background = hex;
      btn.title = hex;
      btn.addEventListener("click", function(){
        state.accentColor = hex;
        save();
        applyAccent();
        $("accentColor").value = hex;
        $("accentHexLabel").textContent = hex;
        renderAccentPresets();
      });
      wrap.appendChild(btn);
    });
  }

  $("accentColor").addEventListener("input", function(e){
    state.accentColor = e.target.value;
    save();
    applyAccent();
    $("accentHexLabel").textContent = e.target.value;
    renderAccentPresets();
  });

  /* ---------- overlay slider ---------- */
  $("overlayRange").addEventListener("input", function(e){
    state.overlayOpacity = parseInt(e.target.value);
    $("overlayVal").textContent = state.overlayOpacity + "%";
    save();
    applyOverlay();
  });

  /* ---------- clock size slider ---------- */
  $("clockSizeRange").addEventListener("input", function(e){
    state.clockSize = parseInt(e.target.value);
    $("clockSizeVal").textContent = state.clockSize + "px";
    save();
    applyClockSize();
  });

  /* ---------- clock position sliders ---------- */
  $("clockXRange").addEventListener("input", function(e){
    state.clockX = parseInt(e.target.value);
    $("clockXVal").textContent = state.clockX;
    save();
    applyClockPos();
  });
  $("clockYRange").addEventListener("input", function(e){
    state.clockY = parseInt(e.target.value);
    $("clockYVal").textContent = state.clockY;
    save();
    applyClockPos();
  });

  /* ---------- search position slider ---------- */
  $("searchYRange").addEventListener("input", function(e){
    state.searchY = parseInt(e.target.value);
    $("searchYVal").textContent = state.searchY;
    save();
    applySearchPos();
  });

  /* ---------- add button position slider ---------- */
  $("addBtnYRange").addEventListener("input", function(e){
    state.addBtnY = parseInt(e.target.value);
    $("addBtnYVal").textContent = state.addBtnY;
    save();
    applyAddBtnPos();
  });

  /* ---------- gradient colors ---------- */
  $("gradA").addEventListener("input", function(e){
    state.gradA = e.target.value;
    save();
    applyGradient();
  });
  $("gradB").addEventListener("input", function(e){
    state.gradB = e.target.value;
    save();
    applyGradient();
  });

  /* ---------- reset ---------- */
  $("resetAll").addEventListener("click", function(){
    if(!confirm("Reset everything back to defaults?")) return;
    state = defaultState();
    state.wallpaperBag = freshWallpaperBag(-1);
    state.lastBraveIndex = -1;
    saveWallpaperBag();
    currentBraveUrl = null;
    wallpaperLoadId++;
    save();
    applyAccent();
    applyWallpaper();
    pickBraveWallpaper();
    applyOverlay();
    applyGradient();
    applyClockSize();
    applyClockPos();
    applySearchPos();
    applyAddBtnPos();
    applyGreeting();
    populateEngineSelects();
    renderLinks();
    renderAccentPresets();
    syncUI();
    tick();
    closePanelFn();
  });

  /* ---------- sync UI from state (no listeners) ---------- */
  function syncUI(){
    // segmented toggles
    [$("langToggle"), $("timeFormatToggle")].forEach(function(el){
      var key = el === $("langToggle") ? "lang" : "timeFormat";
      el.querySelectorAll("button").forEach(function(btn){
        btn.classList.toggle("active", btn.dataset.val === state[key]);
      });
    });
    // boolean toggle
    $("showSecondsToggle").classList.toggle("on", !!state.showSeconds);
    $("showSecondsToggle").setAttribute("aria-checked", !!state.showSeconds);
    $("showAddButtonToggle").classList.toggle("on", !!state.showAddButton);
    $("showAddButtonToggle").setAttribute("aria-checked", !!state.showAddButton);
    $("showPhotoCreditToggle").classList.toggle("on", !!state.showPhotoCredit);
    $("showPhotoCreditToggle").setAttribute("aria-checked", !!state.showPhotoCredit);
    // sliders
    $("clockSizeRange").value = state.clockSize;
    $("clockSizeVal").textContent = state.clockSize + "px";
    $("clockXRange").value = state.clockX;
    $("clockXVal").textContent = state.clockX;
    $("clockYRange").value = state.clockY;
    $("clockYVal").textContent = state.clockY;
    $("searchYRange").value = state.searchY;
    $("searchYVal").textContent = state.searchY;
    $("addBtnYRange").value = state.addBtnY;
    $("addBtnYVal").textContent = state.addBtnY;
    $("overlayRange").value = state.overlayOpacity;
    $("overlayVal").textContent = state.overlayOpacity + "%";
    // colors
    $("accentColor").value = state.accentColor;
    $("accentHexLabel").textContent = state.accentColor;
    $("gradA").value = state.gradA;
    $("gradB").value = state.gradB;
    // inputs
    $("greetingInput").value = state.greeting || "";
    $("creditInput").value = state.credit || "";
    syncShuffleUI();
  }

  /* ---------- init ---------- */
  // set up one-time listeners for toggles
  setupSegToggle($("langToggle"), "lang", tick);
  setupSegToggle($("timeFormatToggle"), "timeFormat", tick);
  setupToggle($("showSecondsToggle"), "showSeconds");
  setupToggle($("showAddButtonToggle"), "showAddButton", renderLinks);
  setupToggle($("showPhotoCreditToggle"), "showPhotoCredit", applyWallpaper);
  setupToggle($("braveShuffleToggle"), "braveShuffle", function(){
    syncShuffleUI();
    if(state.braveShuffle){
      pickBraveWallpaper();
    } else {
      currentBraveUrl = null;
      wallpaperLoadId++;
      applyWallpaper();
    }
  });

  // apply visual state
  applyAccent();
  applyWallpaper();
  pickBraveWallpaper();
  applyOverlay();
  applyGradient();
  applyClockSize();
  applyClockPos();
  applySearchPos();
  applyAddBtnPos();
  applyGreeting();
  populateEngineSelects();
  renderLinks();
  renderAccentPresets();
  syncUI();

  /* ---------- Focus search input ---------- */
  function focusSearchInput(){
    var input = $("searchInput");
    if(!input || panel.classList.contains("open")) return;
    if(document.activeElement === document.body ||
       document.activeElement === document.documentElement ||
       document.activeElement === input){
      window.focus();
      input.focus({ preventScroll: true });
    }
  }

  focusSearchInput();
  window.addEventListener("load", focusSearchInput);
  window.addEventListener("pageshow", focusSearchInput);

  // Brave can finish activating a New Tab after the page loads.
  var focusAttempts = 0;
  var focusTimer = setInterval(function(){
    focusSearchInput();
    focusAttempts++;
    if(focusAttempts >= 20 || document.activeElement === $("searchInput")){
      clearInterval(focusTimer);
    }
  }, 100);

  /* ---------- URL-based search ---------- */
  (function(){
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    if(query){
      $("searchInput").value = query;
      setTimeout(function(){
        $("searchForm").dispatchEvent(new Event("submit"));
      }, 100);
    }
  })();
})();
