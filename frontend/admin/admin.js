const ADMIN_API_BASE = "http://localhost:5000/api";
const ADMIN_CARS_URL = `${ADMIN_API_BASE}/cars`;
const ADMIN_UPLOAD_URL = `${ADMIN_API_BASE}/upload`;

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove("hidden");
  window.setTimeout(() => toast.classList.add("hidden"), 3600);
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  if (!email || !password) {
    showToast("Please enter both email and password.", "error");
    return;
  }

  try {
    await loginAdmin(email, password);
  } catch (err) {
    showToast(err.message || "Unable to sign in.", "error");
  }
}

async function uploadCarImage(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(ADMIN_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Image upload failed.");
  }
  return data.data.imageUrl;
}

async function handleAddCar(event) {
  event.preventDefault();
  const name = document.getElementById("carName").value.trim();
  const brand = document.getElementById("carBrand").value;
  const modelYear = Number(document.getElementById("carYear").value);
  const price = Number(document.getElementById("carPrice").value);
  const imageFile = document.getElementById("carImage").files[0];
  const description = document.getElementById("carDescription").value.trim();

  if (!name || !brand || !modelYear || !price || !imageFile || !description) {
    showToast("All fields are required.", "error");
    return;
  }

  try {
    const imageUrl = await uploadCarImage(imageFile);
    const res = await fetch(ADMIN_CARS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        name,
        brand,
        modelYear,
        price,
        image: imageUrl,
        description,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Car upload failed.");
    }

    showToast("Car added successfully.", "success");
    document.getElementById("carForm").reset();
    loadAdminCars();
  } catch (err) {
    showToast(err.message || "Upload failed.", "error");
  }
}

function buildAdminCard(car) {
  const price = car.price ? `₹${Number(car.price).toLocaleString("en-IN")}` : "Price on request";
  return `
    <article class="admin-car-card">
      <img src="${car.image}" alt="${car.name}" onerror="this.src='https://via.placeholder.com/400x240?text=No+Image'">
      <div class="admin-car-card-body">
        <span>${car.brand || ""}</span>
        <h3>${car.name}</h3>
        <span>Year: ${car.modelYear || "N/A"}</span>
        <span>Price: ${price}</span>
      </div>
    </article>`;
}

async function loadAdminCars() {
  const grid = document.getElementById("adminCarGrid");
  if (!grid) return;
  grid.innerHTML = `<p class="admin-copy">Loading inventory…</p>`;

  try {
    const res = await fetch(ADMIN_CARS_URL);
    const data = await res.json();
    const cars = (data && Array.isArray(data.data)) ? data.data : [];

    if (!cars.length) {
      grid.innerHTML = `<p class="admin-copy">No cars have been added yet.</p>`;
      return;
    }

    grid.innerHTML = cars.map(buildAdminCard).join("");
  } catch (err) {
    grid.innerHTML = `<p class="admin-copy">Unable to load cars.</p>`;
  }
}

function initAdminPage() {
  if (document.getElementById("adminLoginForm")) {
    document.getElementById("adminLoginForm").addEventListener("submit", handleAdminLogin);
  }

  if (document.getElementById("carForm")) {
    requireAdmin();
    document.getElementById("carForm").addEventListener("submit", handleAddCar);
    document.getElementById("logoutBtn").addEventListener("click", logout);
    loadAdminCars();
  }
}

window.addEventListener("DOMContentLoaded", initAdminPage);
