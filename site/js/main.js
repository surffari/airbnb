(function () {
  "use strict";

  /* ---------- Accordion: only one open per group at a time ---------- */
  document.querySelectorAll(".accordion-group").forEach(function (group) {
    var items = group.querySelectorAll("details.accordion");
    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (item.open) {
          items.forEach(function (other) {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  });

  /* ---------- Wi-Fi reveal (contents already gated by CSS via data-access) ---------- */
  document.querySelectorAll("[data-wifi-btn]").forEach(function (btn) {
    var showLabel = btn.getAttribute("data-label-show") || btn.textContent;
    var hideLabel = btn.getAttribute("data-label-hide") || btn.textContent;
    btn.addEventListener("click", function () {
      var unit = btn.getAttribute("data-wifi-btn");
      var details = document.querySelector('[data-wifi-details="' + unit + '"]');
      if (!details) return;
      var isHidden = details.hasAttribute("hidden");
      if (isHidden) {
        details.removeAttribute("hidden");
        btn.textContent = hideLabel;
      } else {
        details.setAttribute("hidden", "");
        btn.textContent = showLabel;
      }
    });
  });

  /* ---------- Encrypted content: the guest's code IS the decryption key ----------
     Sensitive fields (host contact, Wi-Fi creds, the QR photo) ship only as
     AES-256-GCM ciphertext — no plaintext and no copy of the correct code
     exist anywhere in this file. The code from ?show_details=... (or a
     30-day cookie from a prior successful unlock) is run through PBKDF2 to
     derive the AES key; if it's right, the GCM auth tag verifies and the
     plaintext comes back. If it's wrong or absent, decryption throws and
     everything stays locked. */
  (function () {
    var body = document.body;
    var storeKey = body.dataset.secretStore;
    var src = body.dataset.encryptedSrc;
    if (!storeKey || !src || !window.crypto || !window.crypto.subtle) return;

    function getCookie(name) {
      var match = document.cookie.match(
        new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
      );
      return match ? decodeURIComponent(match[1]) : "";
    }

    function setCookie(name, value, days) {
      var expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie =
        name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/; SameSite=Lax";
    }

    function b64ToBytes(b64) {
      var bin = atob(b64);
      var arr = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return arr;
    }

    function deriveKey(data, code) {
      return crypto.subtle
        .importKey("raw", new TextEncoder().encode(code), "PBKDF2", false, ["deriveKey"])
        .then(function (keyMaterial) {
          return crypto.subtle.deriveKey(
            { name: "PBKDF2", salt: b64ToBytes(data.salt), iterations: data.iterations, hash: "SHA-256" },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["decrypt"]
          );
        });
    }

    function decrypt(key, blob) {
      return crypto.subtle.decrypt(
        { name: "AES-GCM", iv: b64ToBytes(blob.iv) },
        key,
        b64ToBytes(blob.ct)
      );
    }

    function unlockWith(data, code) {
      return deriveKey(data, code)
        .then(function (key) {
          var textNames = Object.keys(data.text || {});
          var binNames = Object.keys(data.binary || {});

          var textWork = Promise.all(
            textNames.map(function (name) {
              return decrypt(key, data.text[name]).then(function (buf) {
                return { name: name, text: new TextDecoder().decode(buf) };
              });
            })
          );
          var binWork = Promise.all(
            binNames.map(function (name) {
              return decrypt(key, data.binary[name]).then(function (buf) {
                var blob = new Blob([buf], { type: data.binary[name].mime });
                return { name: name, url: URL.createObjectURL(blob) };
              });
            })
          );

          return Promise.all([textWork, binWork]);
        })
        .then(function (results) {
          results[0].forEach(function (r) {
            document.querySelectorAll('[data-fill="' + r.name + '"]').forEach(function (el) {
              el.textContent = r.text;
            });
          });
          results[1].forEach(function (r) {
            document.querySelectorAll('[data-fill-src="' + r.name + '"]').forEach(function (el) {
              el.src = r.url;
            });
          });
          document.documentElement.dataset.access = "1";
          setCookie(storeKey, code, 30);
          return true;
        })
        .catch(function () {
          return false;
        });
    }

    var paramCode = (new URLSearchParams(location.search).get("show_details") || "").slice(0, 6);
    var storedCode = getCookie(storeKey);
    var candidate = paramCode || storedCode;
    if (!candidate) return;

    fetch(src)
      .then(function (res) { return res.json(); })
      .then(function (data) { unlockWith(data, candidate); })
      .catch(function () { /* data file missing/unreachable — stay locked */ });
  })();

  /* ---------- Wi-Fi QR modal ---------- */
  document.querySelectorAll("[data-wifi-qr-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var modal = document.getElementById("wifi-qr-modal-" + btn.getAttribute("data-wifi-qr-btn"));
      if (modal) modal.showModal();
    });
  });
  document.querySelectorAll(".wifi-qr-modal").forEach(function (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.close();
    });
    modal.querySelector("[data-wifi-qr-close]").addEventListener("click", function () {
      modal.close();
    });
  });

  /* ---------- Highlights carousel (scroll-snap, no dependencies) ---------- */
  document.querySelectorAll(".carousel").forEach(function (root) {
    var track = root.querySelector(".carousel__track");
    var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel__slide"));
    var prev = root.querySelector(".carousel__btn--prev");
    var next = root.querySelector(".carousel__btn--next");
    var dotsWrap = root.querySelector(".carousel__dots");
    if (!track || slides.length < 2) return;

    var current = 0;
    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.className = "carousel__dot";
      b.type = "button";
      b.setAttribute("aria-label", "Go to photo " + (i + 1));
      b.addEventListener("click", function () { goTo(i); });
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });

    function goTo(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
    }
    function sync() {
      var idx = Math.round(track.scrollLeft / track.clientWidth);
      idx = Math.max(0, Math.min(slides.length - 1, idx));
      current = idx;
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx === slides.length - 1;
    }
    if (prev) prev.addEventListener("click", function () { goTo(current - 1); });
    if (next) next.addEventListener("click", function () { goTo(current + 1); });

    var raf;
    track.addEventListener("scroll", function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    }, { passive: true });
    window.addEventListener("resize", function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    });
    sync();
  });

  /* ---------- Language switcher (preserves ?show_details= across languages) ---------- */
  document.querySelectorAll("[data-lang-switcher]").forEach(function (select) {
    select.addEventListener("change", function () {
      var href = select.value;
      if (location.search) href += location.search;
      location.href = href;
    });
  });

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("is-visible", window.scrollY > 700);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

})();
