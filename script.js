// ===============================
// DOM ready
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // Theme logic: Auto ↔ Dark ↔ Light
  // ===============================
  (function () {
    const STORAGE_KEY = "theme-preference";
    const btn = document.getElementById("theme-toggle");
    const root = document.documentElement;

    if (!btn || !root) {
      console.warn("[theme] Missing #theme-toggle or documentElement");
      return;
    }

    function getStored() {
      return localStorage.getItem(STORAGE_KEY) || "auto";
    }
    function setStored(val) {
      try {
        localStorage.setItem(STORAGE_KEY, val);
      } catch (e) {
        console.warn("[theme] localStorage unavailable", e);
      }
    }

    function isDarkNow(pref) {
      if (pref === "dark") return true;
      if (pref === "light") return false;
      return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    }

    function render(pref) {
      root.setAttribute("data-theme", pref);
      const dark = isDarkNow(pref);
      btn.setAttribute("aria-pressed", String(dark));
      btn.innerHTML =
        pref === "auto"
          ? '<i class="fa-solid fa-circle-half-stroke"></i>'
          : dark
          ? '<i class="fa-solid fa-sun"></i>'
          : '<i class="fa-solid fa-moon"></i>';
    }

    function next(pref) {
      if (pref === "auto") return "dark";
      if (pref === "dark") return "light";
      return "auto";
    }

    let current = getStored();
    render(current);

    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (mq?.addEventListener) {
      mq.addEventListener("change", () => {
        if (getStored() === "auto") render("auto");
      });
    } else if (mq?.addListener) {
      // Safari fallback
      mq.addListener(() => {
        if (getStored() === "auto") render("auto");
      });
    }

    btn.addEventListener("click", () => {
      current = next(getStored());
      setStored(current);
      render(current);
    });
  })();

  // ===============================
  // Mobile nav toggle
  // ===============================
  (function () {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("primary-menu");

    if (!toggle || !menu) {
      console.warn("[nav] Missing .nav-toggle or #primary-menu");
      return;
    }

    function setExpanded(expanded) {
      toggle.setAttribute("aria-expanded", String(expanded));
      menu.classList.toggle("open", expanded);
    }

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      setExpanded(!isOpen);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setExpanded(false);
    });

    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setExpanded(false);
    });
  })();

  // ===============================
  // Async form submit
  // ===============================
  (function () {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");
    const btnText = submitBtn?.querySelector(".btn-text");

    if (!form || !status || !submitBtn || !btnText) {
      console.warn("[form] Missing form/status/submitBtn/btnText elements");
      return;
    }

    function setLoading(loading) {
      submitBtn.disabled = loading;
      btnText.textContent = loading ? "Sending..." : "Send Message";
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "";

      if (!form.checkValidity()) {
        status.classList.add("error");
        status.textContent = "Please complete all required fields correctly.";
        return;
      }

      setLoading(true);
      try {
        const formData = new FormData(form);
        const res = await fetch(form.action, {
          method: form.method || "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          form.reset();
          status.classList.add("success");
          status.textContent =
            "Thanks! Your message has been sent. You will receive a confirmation shortly.";
        } else {
          status.classList.add("error");
          status.textContent =
            "Sorry, something went wrong. Please try again in a moment.";
        }
      } catch (err) {
        status.classList.add("error");
        status.textContent =
          "Network error. Please check your connection and try again.";
      } finally {
        setLoading(false);
      }
    });
  })();
});

// ===============================
// Typing effect for hero section
const texts = [
  'Full Stack Developer', 
  'Programmer', 
  'Problem Solver', 
  'Freelancer'
];

const typingEl = document.querySelector('.typing');
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
  const currentText = texts[textIndex];
  
  if (isDeleting) {
    // Backspace effect
    typingEl.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    
    if (charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(typeWriter, 500); // Pause before next phrase
      return;
    }
  } else {
    // Typing effect
    typingEl.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    
    if (charIndex === currentText.length) {
      setTimeout(() => {
        isDeleting = true;
        typeWriter();
      }, 2000); // Pause at full text
      return;
    }
  }
  
  const speed = isDeleting ? 50 : 100; // Faster backspace
  setTimeout(typeWriter, speed);
}

typeWriter(); // Start the magic

// ===============================