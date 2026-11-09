
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc
} from
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


// نفس إعدادات Firebase الموجودة في script.js

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

const auth = getAuth(app);
const db = getFirestore(app);

const $ = id => document.getElementById(id);


// Login

$("loginForm").addEventListener("submit", async event => {

  event.preventDefault();

  $("loginStatus").textContent = "جاري تسجيل الدخول...";

  try {

    await signInWithEmailAndPassword(
      auth,
      $("adminEmail").value.trim(),
      $("adminPassword").value
    );

  } catch (error) {

    console.error(error);

    $("loginStatus").textContent =
      "تعذر تسجيل الدخول. راجع البريد وكلمة المرور.";

  }

});


// Authentication state

onAuthStateChanged(auth, async user => {

  if (user) {

    $("loginSection").classList.add("admin-hidden");
    $("dashboard").classList.remove("admin-hidden");

    await loadMessages();

  } else {

    $("loginSection").classList.remove("admin-hidden");
    $("dashboard").classList.add("admin-hidden");

  }

});


// Load messages

async function loadMessages() {

  $("dashboardStatus").textContent = "جاري تحميل التهاني...";

  $("messagesList").replaceChildren();

  try {

    const messagesQuery = query(
      collection(db, "weddingMessages"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(messagesQuery);

    $("messageCount").textContent = snapshot.size;

    if (snapshot.empty) {

      $("messagesList").textContent =
        "لسه مفيش تهاني وصلت.";

      $("dashboardStatus").textContent = "";

      return;

    }

    snapshot.forEach(messageDoc => {

      const data = messageDoc.data();

      const card = document.createElement("article");
      card.className = "admin-message";

      const name = document.createElement("strong");
      name.textContent = data.name || "بدون اسم";

      const message = document.createElement("p");
      message.textContent = data.message || "";

      const date = document.createElement("small");

      date.textContent = data.createdAt
        ? data.createdAt.toDate().toLocaleString("ar-EG")
        : "وقت الإرسال غير متاح";

      const actions = document.createElement("div");
      actions.className = "admin-actions";

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.textContent = "حذف التهنئة";

      deleteButton.addEventListener("click", async () => {

        const confirmed = confirm(
          "هل أنت متأكد أنك تريد حذف هذه التهنئة؟"
        );

        if (!confirmed) return;

        deleteButton.disabled = true;

        try {

          await deleteDoc(
            doc(db, "weddingMessages", messageDoc.id)
          );

          await loadMessages();

        } catch (error) {

          console.error(error);

          alert("تعذر حذف التهنئة.");

          deleteButton.disabled = false;

        }

      });

      actions.appendChild(date);
      actions.appendChild(deleteButton);

      card.appendChild(name);
      card.appendChild(message);
      card.appendChild(actions);

      $("messagesList").appendChild(card);

    });

    $("dashboardStatus").textContent =
      "تم تحميل التهاني بنجاح.";

  } catch (error) {

    console.error(error);

    $("dashboardStatus").textContent =
      "تعذر تحميل التهاني. راجع صلاحيات Firebase.";

  }

}


// Refresh

$("refreshButton").addEventListener("click", loadMessages);


// Logout

$("logoutButton").addEventListener("click", async () => {

  await signOut(auth);

});
