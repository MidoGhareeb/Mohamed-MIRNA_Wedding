
/*
  Wedding Invitation - Mohamed & Mirna
  Firebase version
*/

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


// ======================================
// 1. INVITATION SETTINGS
// ======================================

const INVITATION = {
  groom: "المهندس محمد",
  bride: "الآنسة ميرنا",
  date: "2026-12-11T20:00:00",
  venue: "قاعة مريال ب",
  timeLabel: "الساعة ٨ مساءً",

  mapUrl: "https://maps.app.goo.gl/jgwEKQyV2vvRYcqF9",

  musicUrl: "./ayah.mp3",

  galleryImage1: "./7A2A46034368.JPG",
  galleryImage2: "./7A2A46064371.JPG"
};


// ======================================
// 2. FIREBASE CONFIG
// ضع بيانات مشروعك الحقيقية هنا
// ======================================

  const firebaseConfig = {
    apiKey: "AIzaSyDQSdenVQqwlEZh_gz_Soeimjd7_K76Cb4",
    authDomain: "mohamed-mirna.firebaseapp.com",
    projectId: "mohamed-mirna",
    storageBucket: "mohamed-mirna.firebasestorage.app",
    messagingSenderId: "474264936541",
    appId: "1:474264936541:web:64e3b4d6e42b3c6f48edb4",
    measurementId: "G-N74PT8W0HH"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ======================================
// 3. HELPERS
// ======================================

const $ = id => document.getElementById(id);

const eventDate = new Date(INVITATION.date);

const arabicDate = eventDate.toLocaleDateString("ar-EG", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});

const englishDate = eventDate.toLocaleDateString("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});


// ======================================
// 4. INVITATION INFORMATION
// ======================================

$("groomName").textContent = INVITATION.groom;
$("brideName").textContent = INVITATION.bride;

$("introNames").textContent =
  `${INVITATION.groom} و ${INVITATION.bride}`;

$("footerNames").textContent =
  `${INVITATION.groom} و ${INVITATION.bride}`;

$("venueName").textContent = INVITATION.venue;
$("eventTime").textContent = INVITATION.timeLabel;

$("mapLink").href = INVITATION.mapUrl;

$("heroDate").textContent = arabicDate;
$("detailDate").textContent = arabicDate;

$("galleryImage1").src = INVITATION.galleryImage1;
$("galleryImage2").src = INVITATION.galleryImage2;

const audio = $("backgroundMusic");
audio.src = INVITATION.musicUrl;


// ======================================
// 5. COUNTDOWN
// ======================================

function updateCountdown() {

  const diff = Math.max(
    0,
    eventDate.getTime() - Date.now()
  );

  const values = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff % 86400000 / 3600000),
    minutes: Math.floor(diff % 3600000 / 60000),
    seconds: Math.floor(diff % 60000 / 1000)
  };

  Object.entries(values).forEach(([id, value]) => {
    $(id).textContent = String(value).padStart(2, "0");
  });

}

updateCountdown();
setInterval(updateCountdown, 1000);


// ======================================
// 6. ENVELOPE OPENING + MUSIC
// ======================================

let invitationOpened = false;

function openInvite() {

  if (invitationOpened) return;

  invitationOpened = true;

  const intro = $("introScreen");
  const invitation = $("invitation");

  // محاولة تشغيل الموسيقى مباشرة من تفاعل المستخدم
  audio.play()
    .then(() => {
      $("musicToggle").classList.add("playing");
    })
    .catch(error => {
      console.warn("Music playback failed:", error);
    });

  intro.classList.add("opening");

  setTimeout(() => {

    intro.classList.add("closed");

    invitation.classList.remove("is-locked");

    document.body.style.overflow = "auto";

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }, 900);

}

$("openInvitation").addEventListener("click", openInvite);
$("introHint").addEventListener("click", openInvite);

document.body.style.overflow = "hidden";


// ======================================
// 7. REVEAL ANIMATIONS
// ======================================

const revealObserver = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.classList.add("visible");

      revealObserver.unobserve(entry.target);

    }

  });

}, {
  threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(el => {
  revealObserver.observe(el);
});


// ======================================
// 8. LANGUAGE SWITCHING
// ======================================

let language = "ar";

$("languageToggle").addEventListener("click", () => {

  language = language === "ar" ? "en" : "ar";

  document.documentElement.lang = language;

  document.documentElement.dir =
    language === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-ar][data-en]").forEach(el => {
    el.innerHTML = el.dataset[language];
  });

  $("languageToggle").textContent =
    language === "ar" ? "GB English" : "عربي";

  $("heroDate").textContent =
    language === "ar" ? arabicDate : englishDate;

  $("detailDate").textContent =
    language === "ar" ? arabicDate : englishDate;

  $("eventTime").textContent =
    language === "ar"
      ? INVITATION.timeLabel
      : eventDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit"
        });

  $("guestName").placeholder =
    language === "ar" ? "اسمك" : "Your name";

  $("guestMessage").placeholder =
    language === "ar"
      ? "اكتب تهنئتك هنا..."
      : "Write your wishes here...";

});


// ======================================
// 9. MUSIC BUTTON
// ======================================

$("musicToggle").addEventListener("click", async () => {

  try {

    if (audio.paused) {

      await audio.play();

      $("musicToggle").classList.add("playing");

    } else {

      audio.pause();

      $("musicToggle").classList.remove("playing");

    }

  } catch (error) {

    console.warn("Audio error:", error);

  }

});

audio.addEventListener("pause", () => {
  $("musicToggle").classList.remove("playing");
});

audio.addEventListener("play", () => {
  $("musicToggle").classList.add("playing");
});


// ======================================
// 10. ADD TO CALENDAR
// ======================================

$("calendarButton").addEventListener("click", () => {

  const end = new Date(
    eventDate.getTime() + 3 * 60 * 60 * 1000
  );

  const stamp = d =>
    d.toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "BEGIN:VEVENT",
    `DTSTART:${stamp(eventDate)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${INVITATION.groom} & ${INVITATION.bride} Wedding`,
    `LOCATION:${INVITATION.venue}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const url = URL.createObjectURL(
    new Blob([content], {
      type: "text/calendar;charset=utf-8"
    })
  );

  const a = document.createElement("a");

  a.href = url;
  a.download = "wedding-invitation.ics";

  a.click();

  URL.revokeObjectURL(url);

});


// ======================================
// 11. FLOATING PARTICLES
// ======================================

const canvas = $("particles");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;

  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  particles = Array.from(
    {
      length: Math.min(65, Math.floor(innerWidth / 18))
    },
    () => ({

      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,

      r: Math.random() * 1.35 + .45,
      a: Math.random() * .4 + .12,

      s: Math.random() * .22 + .06,

      phase: Math.random() * Math.PI * 2

    })
  );

}

function drawParticles(t) {

  ctx.clearRect(0, 0, innerWidth, innerHeight);

  particles.forEach(p => {

    p.y -= p.s;

    if (p.y < -5) {

      p.y = innerHeight + 5;
      p.x = Math.random() * innerWidth;

    }

    const alpha =
      p.a * (.65 + .35 * Math.sin(t * .001 + p.phase));

    ctx.beginPath();

    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

    ctx.fillStyle = `rgba(169, 133, 202, ${alpha})`;

    ctx.fill();

  });

  requestAnimationFrame(drawParticles);

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

requestAnimationFrame(drawParticles);


// ======================================
// 12. FIREBASE GUESTBOOK
// ======================================

$("messageForm").addEventListener("submit", async event => {

  event.preventDefault();

  const form = $("messageForm");
  const submitButton = form.querySelector('[type="submit"]');

  const name = $("guestName").value.trim();
  const message = $("guestMessage").value.trim();

  if (!name || !message) return;

  if (name.length > 80 || message.length > 1000) {
    alert(
      language === "ar"
        ? "الاسم أو التهنئة أطول من المسموح."
        : "Name or message is too long."
    );
    return;
  }

  const originalText = submitButton.textContent;

  submitButton.disabled = true;

  submitButton.textContent =
    language === "ar" ? "جاري الإرسال..." : "Sending...";

  try {

    await addDoc(collection(db, "weddingMessages"), {

      name: name,
      message: message,

      createdAt: serverTimestamp()

    });

    form.reset();

    $("successMessage").hidden = false;

  } catch (error) {

    console.error("Firebase error:", error);

    alert(
      language === "ar"
        ? "حصلت مشكلة أثناء إرسال التهنئة. حاول مرة أخرى."
        : "Could not send your wishes. Please try again."
    );

  } finally {

    submitButton.disabled = false;
    submitButton.textContent = originalText;

  }

});
