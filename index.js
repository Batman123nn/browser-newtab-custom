(function(){
  "use strict";

  var STORE_KEY = "localstart_v2";

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
      overlayOpacity: 100,
      gradA: "#1d1915",
      gradB: "#14110e",
      greeting: ""
    };
  }

  var state = Object.assign(defaultState(), loadState() || {});

  function save(){
    try{
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
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

  function applyWallpaper(){
    if(state.wallpaper){
      wallpaperEl.style.backgroundImage = "url(" + state.wallpaper + ")";
      wallpaperEl.classList.remove("empty");
    } else {
      wallpaperEl.style.backgroundImage = "";
      wallpaperEl.classList.add("empty");
    }
    creditEl.textContent = state.credit || "";
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

  $("chooseWallpaper").addEventListener("click", function(){ $("wallpaperInput").click(); });
  $("wallpaperInput").addEventListener("change", function(e){
    var file = e.target.files && e.target.files[0];
    if(!file) return;
    fileToDataURL(file, function(dataUrl){
      state.wallpaper = dataUrl;
      if(save()) applyWallpaper();
    });
  });
  $("clearWallpaper").addEventListener("click", function(){
    state.wallpaper = null;
    save();
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
    if(!q) return;
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
    // Use JSONP to bypass CORS — works from any domain
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
    add.className = "link-chip add-chip";
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
    save();
    applyAccent();
    applyWallpaper();
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
  }

  /* ---------- init ---------- */
  // set up one-time listeners for toggles
  setupSegToggle($("langToggle"), "lang", tick);
  setupSegToggle($("timeFormatToggle"), "timeFormat", tick);
  setupToggle($("showSecondsToggle"), "showSeconds");

  // apply visual state
  applyAccent();
  applyWallpaper();
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
  setTimeout(function(){
    $("searchInput").focus();
  }, 200);

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
