// ---------- Terminal typing effect (hero) ----------
const lines = [
  { t: '<span class="prompt">$</span> <span class="cmd">curl -X GET https://ankitanand.dev/api/status</span>', pause: 500 },
  { t: '', pause: 200 },
  { t: '{', pause: 100 },
  { t: '&nbsp;&nbsp;<span class="key">"name"</span>: <span class="str">"Ankit Anand"</span>,', pause: 80 },
  { t: '&nbsp;&nbsp;<span class="key">"role"</span>: <span class="str">"Backend Engineer"</span>,', pause: 80 },
  { t: '&nbsp;&nbsp;<span class="key">"stack"</span>: [<span class="str">"Node.js"</span>, <span class="str">"Express"</span>, <span class="str">"MongoDB"</span>, <span class="str">"React"</span>],', pause: 80 },
  { t: '&nbsp;&nbsp;<span class="key">"available_for_hire"</span>: <span class="num">true</span>,', pause: 80 },
  { t: '&nbsp;&nbsp;<span class="key">"response_time"</span>: <span class="str">"< 24h"</span>', pause: 80 },
  { t: '}', pause: 100 },
  { t: '', pause: 300 },
  { t: '<span class="prompt">$</span> <span class="cursor"></span>', pause: 0 },
];

function typeTerminal() {
  const el = document.getElementById("termBody");
  if (!el) return;
  let i = 0;

  function next() {
    if (i >= lines.length) return;
    const div = document.createElement("div");
    div.style.minHeight = "19px";
    div.style.opacity = "0";
    div.style.transition = "opacity .15s";
    div.innerHTML = lines[i].t;
    el.appendChild(div);
    requestAnimationFrame(() => { div.style.opacity = "1"; });
    const pause = lines[i].pause;
    i++;
    setTimeout(next, pause + 120);
  }
  next();
}

// ---------- Visitor counter ----------
async function loadVisitorCount() {
  const el = document.getElementById("visitorCount");
  if (!el) return;
  try {
    const res = await fetch("/api/visitors");
    const data = await res.json();
    el.textContent = data.count ?? "—";
  } catch (err) {
    el.textContent = "—";
    console.error("Could not load visitor count:", err);
  }
}

// ---------- Contact form ----------
function setupContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("cStatus");
  const submitBtn = document.getElementById("cSubmit");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("cName").value.trim();
    const email = document.getElementById("cEmail").value.trim();
    const message = document.getElementById("cMessage").value.trim();

    if (!name || !email || !message) return;

    submitBtn.disabled = true;
    status.textContent = "Sending…";
    status.className = "form-status";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      status.textContent = "Message sent — I'll get back to you soon!";
      status.className = "form-status success";
      form.reset();

      // Clear the success message after 5 seconds
      setTimeout(() => {
        status.textContent = "";
        status.className = "form-status";
      }, 5000);
    } catch (err) {
      status.textContent = err.message;
      status.className = "form-status error";
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// ---------- Mobile nav toggle ----------
function setupNavToggle() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- Init ----------
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(typeTerminal, 400);
  loadVisitorCount();
  setupContactForm();
  setupNavToggle();
});
