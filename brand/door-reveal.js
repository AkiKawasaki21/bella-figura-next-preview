/* Bella Figura: machine descriptions behind the door.
   The bubbles stay as they are; tapping one (or "Open the door") brings up the
   Bella Figura door with its rouge plaque, which swings open in a shower of
   gold sparkles to reveal that machine's description. */
(function () {
  if (window.__bfDoorReveal) return;
  window.__bfDoorReveal = true;

  var me = document.currentScript;
  var base = me && me.src ? me.src.replace(/brand\/door-reveal\.js.*$/, "") : "/bella-figura-next-preview/";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var css = [
    /* Description now lives behind the door. */
    ".treatment[data-bfd] .treatment__text,.treatment[data-bfd] .treatment__foot,.treatment .bfd-perks{display:none}",
    ".bfd__room .bfd-perks{display:grid;gap:.35rem;list-style:none;margin:0 0 1rem;padding:0;font-size:.82rem;letter-spacing:.04em;color:var(--gold-deep,#8a6a3a)}",
    ".bfd__room .bfd-perks li:before{content:'\\2726  ';color:#c9a46a}",
    ".treatment[data-bfd] .treatment__media{cursor:pointer}",
    ".treatment[data-sculpt] .treatment__photo{opacity:1!important;filter:drop-shadow(0 1.5rem 2rem #c2785a40)}",
    ".treatment[data-bfd] .treatment__media .treatment__photo{transition:transform .5s cubic-bezier(.2,.7,.2,1)}",
    ".treatment[data-bfd] .treatment__media:hover .treatment__photo{transform:scale(1.03)}",

    ".bfd-open-btn{margin-top:var(--space-5,1.5rem);display:inline-flex;align-items:center;gap:1rem;padding:0;border:0;background:none;font:inherit;color:inherit;cursor:pointer;text-align:left}",
    ".bfd-open-btn:focus-visible{outline:2px solid var(--gold,#c9a46a);outline-offset:6px;border-radius:.5rem}",
    ".bfd-mini{--door-w:5.6rem;--door-h:8.2rem;--crest:calc(var(--door-w) * .34);display:block;position:relative;flex:none;width:var(--door-w);height:var(--door-h);",
    "border-radius:calc(var(--door-w) / 2) calc(var(--door-w) / 2) .25rem .25rem;perspective:420px;overflow:hidden;",
    "background:radial-gradient(50% 60% at 50% 40%,#fffdf4,#ffe9bf 55%,#f5d49a);",
    "box-shadow:0 0 0 1px var(--gold,#c9a46a),0 0 0 .3rem var(--pearl,#fbf6ec),0 0 0 calc(.3rem + 1px) #c9a46ab3,0 1rem 1.6rem -.9rem #592c1d8c}",
    ".bfd-mini .gateway__leaf{display:block;z-index:2;transition:transform .7s cubic-bezier(.55,0,.2,1)}",
    ".bfd-mini__inside{position:absolute;inset:0;z-index:1;display:block}.bfd-mini__inside img{width:100%;height:100%;object-fit:cover;display:block}",
    ".bfd-mini__inside:after{content:'';position:absolute;inset:0;background:radial-gradient(60% 50% at 50% 45%,#fff3d000,#fff3d055 70%,#f5d49a88)}",
    ".bfd-mini .gateway__crest{width:var(--crest);height:auto;position:absolute;top:13%}",
    ".bfd-mini .gateway__leaf--left .gateway__crest{right:calc(var(--crest) / -2)}.bfd-mini .gateway__leaf--right .gateway__crest{left:calc(var(--crest) / -2)}",
    ".bfd-mini .gateway__panel{border-radius:.15rem;box-shadow:none}",
    ".bfd-mini .gateway__handle{width:.14rem}",
    ".bfd-open-btn:hover .bfd-mini .gateway__leaf--left,.bfd-open-btn:focus-visible .bfd-mini .gateway__leaf--left{transform:rotateY(-68deg)}",
    ".bfd-open-btn:hover .bfd-mini .gateway__leaf--right,.bfd-open-btn:focus-visible .bfd-mini .gateway__leaf--right{transform:rotateY(68deg)}",
    ".bfd-mini--peek .gateway__leaf--left{animation:bfd-peek-l 5s ease-in-out infinite}.bfd-mini--peek .gateway__leaf--right{animation:bfd-peek-r 5s ease-in-out infinite}",
    "@keyframes bfd-peek-l{0%,45%,100%{transform:none}60%,85%{transform:rotateY(-70deg)}}@keyframes bfd-peek-r{0%,45%,100%{transform:none}60%,85%{transform:rotateY(70deg)}}",
    ".bfd-mini__spark{position:absolute;z-index:5;color:#d9a94f;text-shadow:0 0 .35rem #fff6dc,0 0 .8rem #f1c46f;font-size:.8rem;line-height:1;animation:bfd-twinkle 2.6s ease-in-out infinite}",
    ".bfd-open-btn__wrap{display:block;position:relative;flex:none}",
    ".bfd-open-btn__label{display:grid;gap:.3rem}",
    ".bfd-open-btn__kicker{font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gold-deep,#8a6a3a)}",
    ".bfd-open-btn__line{font-family:var(--font-display,serif);font-size:1.25rem;line-height:1.1}",
    ".bfd-open-btn__line em{color:var(--ember,#c4452c)}",

    /* Overlay */
    ".bfd{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:clamp(1rem,4vw,2rem);",
    "background:radial-gradient(60% 45% at 50% 70%,#f2dabacc,transparent 70%),linear-gradient(var(--bone,#f7efe2),var(--bone-deep,#eddfcc));",
    "opacity:0;transition:opacity .45s ease;overscroll-behavior:contain}",
    ".bfd.is-shown{opacity:1}",
    ".bfd__close{position:absolute;top:max(1rem,env(safe-area-inset-top));right:1rem;z-index:5;width:2.75rem;height:2.75rem;border-radius:50%;",
    "border:1px solid #c9a46a;background:#fbf4e6;color:var(--ink,#2a1a14);font-size:1.25rem;line-height:1;cursor:pointer;display:grid;place-items:center}",
    ".bfd__close:focus-visible{outline:2px solid var(--gold,#c9a46a);outline-offset:3px}",
    ".bfd__stage{position:relative;display:grid;justify-items:center;gap:1rem}",
    ".bfd__kicker{margin:0;color:var(--gold-deep,#8a6a3a);font-size:.7rem;letter-spacing:.28em;text-transform:uppercase;transition:opacity .5s}",
    ".bfd.is-open .bfd__kicker{opacity:0}",

    /* The door: same leaves and plaque as the gateway, sized for the overlay. */
    ".bfd__door{--door-h:min(76svh,42rem,calc(90vw / .66));--door-w:calc(var(--door-h) * .66);--plaque-w:calc(var(--door-w) * .36);--crest:calc(var(--door-w) * .34);",
    "position:relative;width:var(--door-w);height:var(--door-h);border-radius:calc(var(--door-w) / 2) calc(var(--door-w) / 2) .4rem .4rem;perspective:1300px;",
    "background:#fbf1dc;box-shadow:0 0 0 1px var(--gold,#c9a46a),0 0 0 .55rem var(--pearl,#fbf6ec),0 0 0 calc(.55rem + 1px) #c9a46ab3,0 2.5rem 4rem -2rem #592c1d8c;",
    "overflow:hidden;transform:translateY(1.5rem) scale(.96);transition:transform .7s cubic-bezier(.2,.7,.2,1)}",
    ".bfd.is-shown .bfd__door{transform:none}",
    ".bfd__door .gateway__crest{width:var(--crest);height:auto;position:absolute;top:13%}.bfd__door .gateway__leaf--left .gateway__crest{right:calc(var(--crest) / -2)}.bfd__door .gateway__leaf--right .gateway__crest{left:calc(var(--crest) / -2)}",
    ".bfd__door .gateway__leaf{display:block;z-index:3;transition:transform 1.9s cubic-bezier(.55,0,.2,1),filter 1.9s}",
    ".bfd.is-open .bfd__door .gateway__leaf--left{transform:rotateY(-104deg);filter:brightness(.82)}",
    ".bfd.is-open .bfd__door .gateway__leaf--right{transform:rotateY(104deg);filter:brightness(.82)}",
    ".bfd__seam{position:absolute;z-index:4;top:4%;bottom:0;left:50%;width:2px;margin-left:-1px;pointer-events:none;opacity:0;",
    "background:linear-gradient(#0000,#fffbe9 20%,#fffbe6);box-shadow:0 0 1.25rem .35rem #ffe0a9bf}",
    ".bfd.is-opening .bfd__seam{animation:bfd-seam 1.4s ease forwards}",
    ".bfd__sun{position:absolute;inset:0;z-index:2;pointer-events:none;opacity:0;",
    "background:radial-gradient(40% 55% at 50% 40%,#fffdf4,#fff0d0d9 40%,#0000 80%)}",
    ".bfd.is-open .bfd__sun{animation:bfd-sun 2.2s ease forwards}",

    /* What waits behind the door */
    ".bfd__room{position:absolute;inset:0;z-index:1;overflow-y:auto;-webkit-overflow-scrolling:touch;text-align:center;",
    "padding:calc(var(--door-w) * .08) calc(var(--door-w) * .09) 2rem;display:flex;flex-direction:column;align-items:center;justify-content:safe center;",
    "background:radial-gradient(120% 50% at 50% 0,#fff8e8,transparent 70%),linear-gradient(#fbf3e3,#f3e3cc)}",
    ".bfd__room>*{opacity:0;transform:translateY(.9rem);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1)}",
    ".bfd.is-open .bfd__room>*{opacity:1;transform:none}",
    ".bfd.is-open .bfd__room>*:nth-child(1){transition-delay:.8s}.bfd.is-open .bfd__room>*:nth-child(2){transition-delay:.95s}",
    ".bfd.is-open .bfd__room>*:nth-child(3){transition-delay:1.1s}.bfd.is-open .bfd__room>*:nth-child(4){transition-delay:1.25s}",
    ".bfd.is-open .bfd__room>*:nth-child(7){transition-delay:1.7s}.bfd.is-open .bfd__room>*:nth-child(5){transition-delay:1.4s}.bfd.is-open .bfd__room>*:nth-child(6){transition-delay:1.55s}",
    ".bfd__medal{flex:none;width:calc(var(--door-w) * .24);aspect-ratio:1;border-radius:50%;overflow:hidden;margin:0 0 .7rem;",
    "box-shadow:0 0 0 1px #c9a46a,0 0 0 .3rem #fbf6ec,0 0 0 calc(.3rem + 1px) #c9a46a99,0 .8rem 1.6rem -.8rem #592c1d80}",
    ".bfd__medal img{width:100%;height:100%;object-fit:cover;display:block}",
    ".bfd__room .treatment__note{margin:0 0 .4rem}",
    ".bfd__room .treatment__title{margin:0;font-size:clamp(1.5rem,6.4vw,2.4rem);line-height:1.05}",
    ".bfd__room .treatment__tagline{margin:.15rem 0 0}",
    ".bfd__rule{flex:none;width:40%;height:1px;margin:.75rem auto;position:relative;background:linear-gradient(90deg,#0000,#c9a46a 30% 70%,#0000)}",
    ".bfd__rule:after{content:'';position:absolute;left:50%;top:50%;width:.45rem;aspect-ratio:1;transform:translate(-50%,-50%) rotate(45deg);",
    "background:linear-gradient(135deg,#f0dcae,#b48743);box-shadow:0 0 0 2px #f8eedc}",
    ".bfd__room .treatment__text{display:block;margin:0 0 1rem;max-width:28rem;font-size:.9rem;line-height:1.5}",
    ".bfd__room .treatment__foot{display:grid;justify-items:center;gap:.9rem;margin:0;opacity:1;transform:none}",
    ".bfd__room .treatment__facts{justify-content:center;margin:0}",

    /* Sparkles */
    ".bfd__sparks{position:absolute;inset:-12%;pointer-events:none;z-index:6}",
    ".bfd__spark{position:absolute;left:50%;top:50%;color:#d9a94f;text-shadow:0 0 .35rem #fff6dc,0 0 1rem #f1c46f,0 0 2rem #f3cf8a99;",
    "transform:translate(-50%,-50%) scale(0);opacity:0;line-height:1}",
    ".bfd.is-opening .bfd__spark--burst{animation:bfd-burst var(--d,1.4s) cubic-bezier(.15,.7,.3,1) var(--delay,0s) forwards}",
    ".bfd__spark--idle{animation:bfd-twinkle var(--d,2.6s) ease-in-out var(--delay,0s) infinite}",

    "@keyframes bfd-burst{0%{opacity:0;transform:translate(-50%,-50%) scale(0) rotate(0)}",
    "18%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) scale(var(--s,1)) rotate(var(--r,90deg))}}",
    "@keyframes bfd-twinkle{0%,100%{opacity:.15;transform:translate(-50%,-50%) scale(.55)}50%{opacity:1;transform:translate(-50%,-50%) scale(1)}}",
    "@keyframes bfd-seam{0%{opacity:0}35%{opacity:1}100%{opacity:0}}",
    "@keyframes bfd-sun{0%{opacity:0}30%{opacity:1}100%{opacity:0}}",

    "@media (prefers-reduced-motion:reduce){.bfd,.bfd__door,.bfd__room>*,.bfd__door .gateway__leaf{transition:none!important}",
    ".bfd__spark,.bfd-mini__spark,.bfd-mini .gateway__leaf{animation:none!important}.bfd__spark--idle{opacity:.8;transform:translate(-50%,-50%)}}",
    "html.bfd-lock,html.bfd-lock body{overflow:hidden!important}"
  ].join("");

  function addStyle() {
    if (document.getElementById("bfd-style")) return;
    var s = document.createElement("style");
    s.id = "bfd-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function leaf(side) {
    var l = el("div", "gateway__leaf gateway__leaf--" + side);
    l.setAttribute("aria-hidden", "true");
    l.innerHTML =
      '<span class="gateway__panel gateway__panel--high"></span>' +
      '<span class="gateway__panel gateway__panel--low"></span>' +
      '<span class="gateway__handle"></span>' +
      '<img class="gateway__crest" src="' + base + 'brand/monogram.svg" alt="" width="1336" height="1336">';
    return l;
  }

  function sparks() {
    var box = el("div", "bfd__sparks");
    box.setAttribute("aria-hidden", "true");
    var glyphs = ["✦", "✧", "✦", "·", "✨"];
    var i, s, a, dist;
    for (i = 0; i < 34; i++) {
      s = el("span", "bfd__spark bfd__spark--burst", glyphs[i % glyphs.length] === "✨" ? "✦" : glyphs[i % glyphs.length]);
      a = (i / 34) * Math.PI * 2 + Math.random() * 0.4;
      dist = 110 + Math.random() * 230;
      s.style.cssText =
        "--x:" + (Math.cos(a) * dist).toFixed(0) + "px;--y:" + (Math.sin(a) * dist * 1.25).toFixed(0) + "px;" +
        "--s:" + (0.6 + Math.random() * 0.9).toFixed(2) + ";--r:" + (Math.random() * 240 - 120).toFixed(0) + "deg;" +
        "--d:" + (1.5 + Math.random() * 1.1).toFixed(2) + "s;--delay:" + (0.2 + Math.random() * 0.5).toFixed(2) + "s;" +
        "font-size:" + (0.9 + Math.random() * 1.4).toFixed(2) + "rem";
      box.appendChild(s);
    }
    /* A few that keep twinkling around the arch */
    var spots = [[8, 22], [92, 18], [4, 58], [96, 52], [14, 90], [88, 88], [50, 3], [26, 6], [74, 7]];
    spots.forEach(function (p, k) {
      var t = el("span", "bfd__spark bfd__spark--idle", "✦");
      t.style.cssText = "left:" + p[0] + "%;top:" + p[1] + "%;--d:" + (2 + (k % 4) * 0.5) + "s;--delay:" + (k * 0.3) + "s;font-size:" + (0.7 + (k % 3) * 0.35) + "rem";
      box.appendChild(t);
    });
    return box;
  }

  var current = null;

  function close() {
    if (!current) return;
    var o = current.overlay, back = current.trigger;
    current = null;
    o.classList.remove("is-shown");
    document.documentElement.classList.remove("bfd-lock");
    document.removeEventListener("keydown", onKey, true);
    setTimeout(function () { o.remove(); }, reduced ? 0 : 450);
    if (back && back.focus) back.focus({ preventScroll: true });
  }

  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "Tab" && current) {
      var f = current.overlay.querySelectorAll("button,a[href]");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function open(section, trigger) {
    if (current) return;
    var title = section.querySelector(".treatment__title");
    var name = title ? title.textContent : "the session";

    var o = el("div", "bfd");
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-modal", "true");
    o.setAttribute("aria-label", name);

    var x = el("button", "bfd__close", "×");
    x.type = "button";
    x.setAttribute("aria-label", "Close");
    x.addEventListener("click", close);

    var stage = el("div", "bfd__stage");
    var kicker = el("p", "bfd__kicker", "Step inside");
    var door = el("div", "bfd__door");
    var room = el("div", "bfd__room");

    var img = section.hasAttribute("data-sculpt") ? null : section.querySelector(".treatment__photo img");
    if (img) {
      var medal = el("div", "bfd__medal");
      var im = document.createElement("img");
      im.src = (img.hasAttribute("srcset") && img.currentSrc) || img.src;
      im.alt = "";
      medal.appendChild(im);
      room.appendChild(medal);
    }
    var head = el("div", "bfd__head");
    ["treatment__note", "treatment__title", "treatment__tagline"].forEach(function (c) {
      var n = section.querySelector("." + c);
      if (n) { n = n.cloneNode(true); n.removeAttribute("id"); head.appendChild(n); }
    });
    room.appendChild(head);
    room.appendChild(el("span", "bfd__rule"));
    var text = section.querySelector(".treatment__text");
    if (text) room.appendChild(text.cloneNode(true));
    var perks = section.querySelector(".bfd-perks");
    if (perks) room.appendChild(perks.cloneNode(true));
    var foot = section.querySelector(".treatment__foot");
    if (foot) { foot = foot.cloneNode(true); foot.className = "treatment__foot"; foot.removeAttribute("style"); room.appendChild(foot); }

    door.appendChild(room);
    door.appendChild(el("span", "bfd__sun"));
    door.appendChild(leaf("left"));
    door.appendChild(leaf("right"));
    door.appendChild(el("span", "bfd__seam"));

    stage.appendChild(kicker);
    stage.appendChild(door);
    stage.appendChild(sparks());
    o.appendChild(x);
    o.appendChild(stage);
    o.addEventListener("click", function (e) { if (e.target === o) close(); });

    document.body.appendChild(o);
    document.documentElement.classList.add("bfd-lock");
    document.addEventListener("keydown", onKey, true);
    current = { overlay: o, trigger: trigger };

    void o.offsetWidth;
    o.classList.add("is-shown");
    x.focus({ preventScroll: true });
    if (reduced) { o.classList.add("is-open"); return; }
    setTimeout(function () {
      if (current && current.overlay === o) o.classList.add("is-opening", "is-open");
    }, 650);
  }

  function enhance(section) {
    if (section.hasAttribute("data-bfd")) {
      if (section.querySelector(".bfd-open-btn")) return;
    }
    var copy = section.querySelector(".treatment__copy");
    if (!copy) return;
    var title = section.querySelector(".treatment__title");
    var name = title ? title.textContent : "this session";
    section.setAttribute("data-bfd", "");
    var media = section.querySelector(".treatment__media");
    if (media && !media.hasAttribute("data-bfd-media")) {
      media.setAttribute("data-bfd-media", "");
      media.addEventListener("click", function () { open(section, section.querySelector(".bfd-open-btn")); });
    }
    var btn = el("button", "bfd-open-btn");
    var wrap = el("span", "bfd-open-btn__wrap");
    var mini = el("span", "bfd-mini bfd-mini--peek");
    mini.setAttribute("aria-hidden", "true");
    var photo = section.querySelector(".treatment__photo img");
    if (photo) {
      var inside = el("span", "bfd-mini__inside");
      var pi = document.createElement("img");
      pi.src = (photo.hasAttribute("srcset") && photo.currentSrc) || photo.src;
      pi.alt = "";
      inside.appendChild(pi);
      mini.appendChild(inside);
    }
    mini.appendChild(leaf("left"));
    mini.appendChild(leaf("right"));
    wrap.appendChild(mini);
    [["-.45rem", "-.5rem", "0s"], ["auto", "-.55rem", ".9s", "1.2rem"], ["2.6rem", "-.7rem", "1.7s"]].forEach(function (p) {
      var sp = el("span", "bfd-mini__spark", "\u2726");
      sp.setAttribute("aria-hidden", "true");
      sp.style.top = p[0]; sp.style[p[3] ? "left" : "right"] = p[1]; sp.style.animationDelay = p[2];
      if (p[3]) { sp.style.bottom = p[3]; sp.style.top = "auto"; }
      wrap.appendChild(sp);
    });
    btn.appendChild(wrap);
    btn.appendChild(el("span", "bfd-open-btn__label",
      '<span class="bfd-open-btn__kicker">Step inside \u2726</span><span class="bfd-open-btn__line">Open the door to <em>' + name.replace(/[<>&"]/g, '') + '</em></span>'));
    btn.type = "button";
    btn.setAttribute("aria-label", "Open the door to " + name);
    btn.addEventListener("click", function () { open(section, btn); });
    copy.appendChild(btn);
  }

  /* Body Sculpt: the featured new machine, built from the same section as the others. */
  var SCULPT = {
    note: "Muscle sculpting \u00b7 New",
    title: "Body Sculpt",
    tagline: "Strength, without the workout",
    text: "Lie back while focused electromagnetic energy draws your muscles into deep, rhythmic contractions, thousands of them in half an hour. Firmer, lifted and more defined, with nothing to recover from.",
    perks: ["Abs \u00b7 glutes \u00b7 arms \u00b7 thighs", "No sweat, no downtime"],
    facts: ["30 min", "New"]
  };

  function addSculpt(first) {
    if (document.querySelector("section.treatment[data-sculpt]")) return;
    var sec = first.cloneNode(true);
    sec.removeAttribute("data-form");
    sec.setAttribute("data-sculpt", "");
    sec.querySelectorAll("[data-form-anchor]").forEach(function (n) { n.removeAttribute("data-form-anchor"); });
    sec.removeAttribute("data-bfd");
    sec.setAttribute("aria-labelledby", "treatment-body-sculpt");
    sec.querySelectorAll(".bfd-open-btn,.treatment__accent").forEach(function (n) { n.remove(); });
    sec.querySelectorAll("[data-parallax]").forEach(function (n) { n.removeAttribute("data-parallax"); });
    sec.querySelectorAll("[data-bfd-media]").forEach(function (n) { n.removeAttribute("data-bfd-media"); });
    sec.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("is-in"); });
    var num = sec.querySelector(".treatment__numeral");
    if (num) num.textContent = "New";
    var img = sec.querySelector(".treatment__photo img");
    if (img) {
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.removeAttribute("loading");
      img.src = base + "images/body-sculpt.svg";
      img.alt = "Body Sculpt at Bella Figura";
    }
    var set = function (sel, txt) { var n = sec.querySelector(sel); if (n) n.textContent = txt; return n; };
    set(".treatment__note", SCULPT.note);
    var t = set(".treatment__title", SCULPT.title);
    if (t) t.id = "treatment-body-sculpt";
    var tag = sec.querySelector(".treatment__tagline");
    if (tag) tag.innerHTML = "<em>" + SCULPT.tagline + "</em>";
    var text = set(".treatment__text", SCULPT.text);
    if (text) {
      var ul = el("ul", "bfd-perks");
      SCULPT.perks.forEach(function (p) { ul.appendChild(el("li", "", p)); });
      text.parentNode.insertBefore(ul, text.nextSibling);
    }
    var facts = sec.querySelector(".treatment__facts");
    if (facts) facts.innerHTML = "<span>" + SCULPT.facts[0] + "</span><span>" + SCULPT.facts[1] + "</span>";
    var foot = sec.querySelector(".treatment__foot");
    if (foot) {
      var a = foot.querySelectorAll("a");
      if (a[0]) { a[0].href = base + "book/"; a[0].textContent = "Reserve your hour"; a[0].setAttribute("aria-label", "Reserve Body Sculpt"); }
      if (a[1]) a[1].remove();
    }
    first.parentNode.insertBefore(sec, first);
  }

  function scan() {
    var list = document.querySelectorAll("section.treatment");
    if (!list.length) return;
    addStyle();
    addSculpt(list[0]);
    list = document.querySelectorAll("section.treatment");
    for (var i = 0; i < list.length; i++) enhance(list[i]);
  }

  function start() {
    scan();
    var pending = 0;
    new MutationObserver(function () {
      if (pending) return;
      pending = requestAnimationFrame(function () { pending = 0; scan(); });
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* Wait until React has hydrated the page before touching it. */
  function later() {
    var go = function () { setTimeout(start, 300); };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  }
  later();
})();
