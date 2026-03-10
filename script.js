const sections = document.querySelectorAll("section");
const navLinks  = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop    = section.offsetTop - 150;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

/* ─────────────────────────────────────────────────
   ORIGINAL ② — Premium project interaction
───────────────────────────────────────────────── */
const pjCards       = document.querySelectorAll(".project-card");
const pjOverlay     = document.querySelector(".pj-overlay");
const pjPanel       = document.querySelector(".pj-panel");
const pjTitle       = document.querySelector(".pj-title");
const pjDescription = document.querySelector(".pj-description");

// Click handler for project cards
pjCards.forEach(card => {
  card.addEventListener("click", () => {
    const isActive = card.classList.contains("active");

    // Close all panels first
    closePanel();

    if (!isActive) {
      card.classList.add("active");
      pjOverlay.classList.add("show");
      pjPanel.classList.add("show");

      // ALWAYS use data-description from the card div
      const title       = card.querySelector(".project-desc").innerText;
      const description = card.dataset.description || "A featured project showcasing functionality, structure, and clean UI implementation.";

      pjTitle.textContent       = title;
      pjDescription.textContent = description;

      // Handle video autoplay if the card has a <video>
      const video = card.querySelector("video");
      if (video) {
        video.currentTime = 0;
        video.play();
      }
    }
  });
});

// Close panel on overlay click
pjOverlay.addEventListener("click", closePanel);

// Close panel on Escape key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closePanel();
});

// Close panel function
function closePanel() {
  pjOverlay.classList.remove("show");
  pjPanel.classList.remove("show");
  pjCards.forEach(c => {
    c.classList.remove("active");
    const video = c.querySelector("video");
    if (video) video.pause();
  });
}

/* ─────────────────────────────────────────────────
   ORIGINAL ③ — Video + Description Panel Handling
───────────────────────────────────────────────── */
const pjMediaContainer = document.createElement("div");
pjMediaContainer.classList.add("pj-media-container");
pjPanel.insertBefore(pjMediaContainer, pjDescription); // video above description

pjCards.forEach(card => {
  card.addEventListener("click", () => {
    const isActive = card.classList.contains("active");
    closePanel();

    if (!isActive) {
      card.classList.add("active");
      pjOverlay.classList.add("show");
      pjPanel.classList.add("show");

      const title       = card.querySelector(".project-desc").innerText;
      const description = card.dataset.description || "";

      pjTitle.textContent       = title;
      pjDescription.textContent = description;

      // Handle video only when card has one
      const video = card.querySelector("video");
      pjMediaContainer.innerHTML = ""; // clear previous video
      if (video) {
        const cloneVideo           = video.cloneNode(true);
        cloneVideo.autoplay        = true;
        cloneVideo.controls        = true;
        cloneVideo.muted           = false;
        cloneVideo.style.width     = "100%";
        cloneVideo.style.maxHeight = "50vh";
        pjMediaContainer.appendChild(cloneVideo);
      }
    }
  });
});

function closePanel() {
  pjOverlay.classList.remove("show");
  pjPanel.classList.remove("show");
  pjCards.forEach(c => c.classList.remove("active"));
  // Remove video from panel
  pjMediaContainer.innerHTML = "";
}

/* ==============================================
   NEW ADDITIONS (do not touch originals above)
   ① Navbar background on scroll
   ② Typing effect
   ③ Scroll reveal (fade-in on scroll)
============================================== */

/* NEW ① — Navbar .scrolled class for frosted glass */
(function initNavScroll() {
  const nav = document.querySelector("nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* NEW ② — Typing effect for .home-sub */
(function initTyping() {
  // Inject a <span id="typingText"> into the first line of .home-sub if not present
  const sub = document.querySelector(".home-sub");
  if (!sub) return;

  // Create the typing span if it doesn't exist
  if (!document.getElementById("typingText")) {
    const span   = document.createElement("span");
    span.id      = "typingText";
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = "|";

    // Prepend to .home-sub before existing text
    sub.insertBefore(cursor,  sub.firstChild);
    sub.insertBefore(span,    sub.firstChild);
  }

  const el = document.getElementById("typingText");
  if (!el) return;

  const phrases = [
    "Computer Science Student",
    "Aspiring Developer",
    "Creative Problem Solver",
    "CS @ Surigao del Sur"
  ];

  let pIdx    = 0;
  let cIdx    = 0;
  let del     = false;
  const T     = 80;   // type speed ms
  const D     = 42;   // delete speed ms
  const PAUSE = 1800; // pause at end ms
  const WAIT  = 400;  // pause before next phrase

  function tick() {
    const phrase = phrases[pIdx];
    if (!del) {
      el.textContent = phrase.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === phrase.length) { del = true; setTimeout(tick, PAUSE); return; }
      setTimeout(tick, T);
    } else {
      el.textContent = phrase.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        del  = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(tick, WAIT);
        return;
      }
      setTimeout(tick, D);
    }
  }
  setTimeout(tick, 1000);
})();

/* NEW ③ — Scroll reveal: adds .reveal class to key elements
   then uses IntersectionObserver to add .reveal-visible */
(function initReveal() {
  // Elements to animate in
  const targets = [
    ".projects-headline",
    ".project-card",
    "#about h2",
    "#about p",
    "#about ul li",
    ".contacts-top",
    ".contact-links a"
  ];

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add("reveal");
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Slight stagger per element within a group
        entry.target.style.transitionDelay = (i * 0.05) + "s";
        entry.target.classList.add("reveal-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
})();


/* ═══════════════════════════════════════════════════════
   EMAIL MODAL — Contact section addition only
   Controls the popup contact form that sends messages
   directly to culpachristinejoy@gmail.com via FormSubmit.
   Handles: open, close, Escape key, backdrop click,
   and client-side validation before form submission.
   (All original code above is completely untouched)
═══════════════════════════════════════════════════════ */
(function initEmailModal() {

  // Listen for clicks on the Gmail link in the Contacts section.
  // Uses event delegation on document (instead of direct getElementById)
  // so the scroll-reveal opacity:0 state never blocks the click.
  document.addEventListener("click", function(e) {
    const trigger = e.target.closest("#email-trigger");
    if (trigger) {
      e.preventDefault(); // prevent page jump from javascript:void(0)
      openEmailModal();   // show the contact form modal
    }
  });

  // Listen for clicks inside the modal overlay area
  document.addEventListener("click", function(e) {
    const overlay = document.getElementById("emailModalOverlay");
    if (!overlay) return;
    // Clicking the dark backdrop (outside the modal box) closes it
    if (e.target === overlay) closeEmailModal();
    // Clicking the X button closes it
    if (e.target.closest("#emailModalClose")) closeEmailModal();
    // Clicking Send triggers the old handleSend (kept for fallback)
    if (e.target.closest("#emailSendBtn")) handleSend();
  });

  // Close the modal when the Escape key is pressed
  document.addEventListener("keydown", function(e) {
    const overlay = document.getElementById("emailModalOverlay");
    if (e.key === "Escape" && overlay && overlay.classList.contains("show")) {
      closeEmailModal();
    }
  });

  // Opens the modal: adds .show class (triggers CSS fade-in animation),
  // prevents background page from scrolling, and focuses the Name field
  function openEmailModal() {
    const overlay = document.getElementById("emailModalOverlay");
    if (!overlay) return;
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // lock scroll while modal is open
    setTimeout(function() {
      const first = document.getElementById("em-name");
      if (first) first.focus(); // auto-focus Name field for convenience
    }, 350);
  }

  // Closes the modal: removes .show class (triggers CSS fade-out),
  // re-enables page scroll, and clears any error messages
  function closeEmailModal() {
    const overlay = document.getElementById("emailModalOverlay");
    const note    = document.getElementById("emailNote");
    if (!overlay) return;
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // restore page scroll
    setTimeout(function() {
      if (note) { note.textContent = ""; note.classList.remove("error"); }
    }, 300);
  }

  // Fallback send handler (used if form submits via JS instead of natively)
  // Validates fields then builds a mailto link as a backup delivery method
  function handleSend() {
    const name    = document.getElementById("em-name").value.trim();
    const email   = document.getElementById("em-email").value.trim();
    const subject = document.getElementById("em-subject") ? document.getElementById("em-subject").value.trim() : "Portfolio Message";
    const message = document.getElementById("em-message").value.trim();
    const note    = document.getElementById("emailNote");

    // Stop if any required field is empty
    if (!name || !email || !message) {
      showNote("Please fill in all fields.", true); return;
    }
    // Stop if email format is invalid
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNote("Please enter a valid email address.", true); return;
    }

    // Build and open a mailto link as backup — sends via user's mail client
    const body   = "Name: " + name + "\nEmail: " + email + "\n\n" + message;
    const mailto = "mailto:culpachristinejoy@gmail.com"
                 + "?subject=" + encodeURIComponent(subject)
                 + "&body="    + encodeURIComponent(body);

    window.location.href = mailto;
    showNote("Opening your mail client…", false);
    setTimeout(closeEmailModal, 1800);
  }

  // Helper: displays a message in the note paragraph below the send button
  // isError=true shows red text, isError=false shows green accent text
  function showNote(msg, isError) {
    const note = document.getElementById("emailNote");
    if (!note) return;
    note.textContent = msg;
    note.classList.toggle("error", isError);
  }
})();