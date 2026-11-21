// ===== Konstanta penyimpanan =====
const PRODUCT_STORAGE_KEY = "webKasir.products";
const TRANSACTION_STORAGE_KEY = "webKasir.transactions";

// ===== Elemen utama =====
const productListElement = document.getElementById("product-list");
const productSearchElement = document.getElementById("product-search");
const categoryFilterElement = document.getElementById("category-filter");
const cartItemsElement = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const paymentInputElement = document.getElementById("payment-input");
const paymentMessageElement = document.getElementById("payment-message");
const historyListElement = document.getElementById("history-list");

const payButton = document.getElementById("pay-button");
const resetCartButton = document.getElementById("reset-cart");
const printReceiptButton = document.getElementById("print-receipt");
const clearHistoryButton = document.getElementById("clear-history");

const kasirTabButton = document.getElementById("tab-kasir");
const riwayatTabButton = document.getElementById("tab-riwayat");
const kasirPage = document.getElementById("kasir-page");
const historyPage = document.getElementById("history-page");

// ===== State aplikasi =====
let products = [];
let transactions = [];
let cart = [];

// ===== Utilitas =====
function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromStorage(key, fallbackValue) {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ===== Data awal =====
function createDefaultProducts() {
  return [
    { id: generateId(), name: "Kopi Susu", price: 18000, stock: 25, category: "Minuman" },
    { id: generateId(), name: "Teh Manis", price: 8000, stock: 40, category: "Minuman" },
    { id: generateId(), name: "Air Mineral", price: 5000, stock: 60, category: "Minuman" },
    { id: generateId(), name: "Nasi Goreng", price: 25000, stock: 15, category: "Makanan" },
    { id: generateId(), name: "Mie Goreng", price: 20000, stock: 20, category: "Makanan" },
    { id: generateId(), name: "Roti Bakar", price: 15000, stock: 10, category: "Makanan" },
  ];
}

function initializeData() {
  products = loadFromStorage(PRODUCT_STORAGE_KEY, null);

  if (!Array.isArray(products) || products.length === 0) {
    products = createDefaultProducts();
    saveToStorage(PRODUCT_STORAGE_KEY, products);
  }

  transactions = loadFromStorage(TRANSACTION_STORAGE_KEY, []);
}

// ===== Render produk =====
function getFilteredProducts() {
  const keyword = productSearchElement.value.trim().toLowerCase();
  const selectedCategory = categoryFilterElement.value;

  return products.filter((product) => {
    const matchesKeyword = product.name
      .toLowerCase()
      .includes(keyword);

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesKeyword && matchesCategory;
  });
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  productListElement.innerHTML = "";

  if (filteredProducts.length === 0) {
    productListElement.innerHTML =
      '<p class="empty-state">Produk tidak ditemukan.</p>';
    return;
  }

  filteredProducts.forEach((product) => {
    const isOutOfStock = product.stock <= 0;

    const productCard = document.createElement("article");
    productCard.className = "product-card";

    productCard.innerHTML = `
      <div>
        <p class="product-name">${product.name}</p>
        <p class="product-category">${product.category || "Tanpa kategori"}</p>
        <p class="product-stock ${isOutOfStock ? "empty" : ""}">
          Stok: ${product.stock}
        </p>
      </div>

      <p class="product-price">${formatRupiah(product.price)}</p>

      <button
        class="button primary"
        data-add-to-cart="${product.id}"
        ${isOutOfStock ? "disabled" : ""}
      >
        ${isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
      </button>
    `;

    productListElement.appendChild(productCard);
  });
}

  filteredProducts.forEach((product) => {
    const isOutOfStock = product.stock <= 0;

    const productCard = document.createElement("article");
    productCard.className = "product-card";

    productCard.innerHTML = `
      <div>
        <p class="product-name">${product.name}</p>
        <p class="product-stock ${isOutOfStock ? "empty" : ""}">
          Stok: ${product.stock}
        </p>
      </div>
      <p class="product-price">${formatRupiah(product.price)}</p>
      <button
        class="button primary"
        data-add-to-cart="${product.id}"
        ${isOutOfStock ? "disabled" : ""}
      >
        Tambah ke Keranjang
      </button>
    `;

    productListElement.appendChild(productCard);
  });


// ===== Keranjang =====
function findProductById(productId) {
  return products.find((product) => product.id === productId);
}

function findCartItem(productId) {
  return cart.find((cartItem) => cartItem.productId === productId);
}

function addToCart(productId) {
  const product = findProductById(productId);

  if (!product) return;

  const cartItem = findCartItem(productId);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  if (currentQuantity >= product.stock) {
    alert("Stok produk tidak mencukupi.");
    return;
  }

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  renderCart();
}

function changeCartItemQuantity(productId, change) {
  const cartItem = findCartItem(productId);
  const product = findProductById(productId);

  if (!cartItem || !product) return;

  const newQuantity = cartItem.quantity + change;

  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }

  if (newQuantity > product.stock) {
    alert("Jumlah melebihi stok yang tersedia.");
    return;
  }

  cartItem.quantity = newQuantity;
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((cartItem) => cartItem.productId !== productId);
  renderCart();
}

function calculateCartTotal() {
  return cart.reduce(
    (total, cartItem) => total + cartItem.price * cartItem.quantity,
    0
  );
}

function renderCart() {
  cartItemsElement.innerHTML = "";

  if (cart.length === 0) {
    cartItemsElement.innerHTML =
      '<p class="empty-state">Keranjang masih kosong.</p>';
  }

  cart.forEach((cartItem) => {
    const subtotal = cartItem.price * cartItem.quantity;

    const cartItemElement = document.createElement("div");
    cartItemElement.className = "cart-item";

    cartItemElement.innerHTML = `
      <div class="cart-item-top">
        <span class="cart-item-name">${cartItem.productName}</span>
        <span class="cart-item-subtotal">${formatRupiah(subtotal)}</span>
      </div>

      <div class="cart-item-controls">
        <button
          class="quantity-button"
          data-decrease-quantity="${cartItem.productId}"
          aria-label="Kurangi jumlah"
        >
          -
        </button>

        <span class="cart-item-quantity">${cartItem.quantity}</span>

        <button
          class="quantity-button"
          data-increase-quantity="${cartItem.productId}"
          aria-label="Tambah jumlah"
        >
          +
        </button>

        <span class="cart-item-price">
          ${formatRupiah(cartItem.price)} / item
        </span>

        <button
          class="remove-button"
          data-remove-cart-item="${cartItem.productId}"
        >
          Hapus
        </button>
      </div>
    `;

    cartItemsElement.appendChild(cartItemElement);
  });

  cartTotalElement.textContent = formatRupiah(calculateCartTotal());
}

function resetCart() {
  if (cart.length === 0) return;

  const isConfirmed = confirm("Yakin ingin mengosongkan keranjang?");

  if (!isConfirmed) return;

  cart = [];
  paymentInputElement.value = "";
  paymentMessageElement.textContent = "";
  paymentMessageElement.className = "payment-message";
  renderCart();
}

// ===== Pembayaran =====
function validatePayment(paymentAmount, totalAmount) {
  if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
    return "Masukkan jumlah uang yang diterima.";
  }

  if (paymentAmount < totalAmount) {
    return "Uang diterima kurang dari total belanja.";
  }

  return "";
}

function processPayment() {
  const totalAmount = calculateCartTotal();
  const paymentAmount = Number(paymentInputElement.value);

  if (cart.length === 0) {
    showPaymentMessage("Keranjang masih kosong.", "error");
    return;
  }

  const validationMessage = validatePayment(paymentAmount, totalAmount);

  if (validationMessage) {
    showPaymentMessage(validationMessage, "error");
    return;
  }

  const changeAmount = paymentAmount - totalAmount;

  const transaction = {
    id: generateId(),
    date: new Date().toISOString(),
    items: cart.map((cartItem) => ({ ...cartItem })),
    total: totalAmount,
    paymentAmount,
    changeAmount,
  };

  transactions.unshift(transaction);

  cart.forEach((cartItem) => {
    const product = findProductById(cartItem.productId);

    if (product) {
      product.stock = Math.max(0, product.stock - cartItem.quantity);
    }
  });

  saveToStorage(PRODUCT_STORAGE_KEY, products);
  saveToStorage(TRANSACTION_STORAGE_KEY, transactions);

  cart = [];
  paymentInputElement.value = "";

  showPaymentMessage(
    `Transaksi berhasil. Kembalian: ${formatRupiah(changeAmount)}`,
    "success"
  );

  function renderCategoryFilter() {
  const categories = [...new Set(products.map((product) => product.category))]
    .filter(Boolean)
    .sort();

  const currentValue = categoryFilterElement.value;

  categoryFilterElement.innerHTML =
    '<option value="all">Semua Kategori</option>';

  categories.forEach((category) => {
    const optionElement = document.createElement("option");
    optionElement.value = category;
    optionElement.textContent = category;
    categoryFilterElement.appendChild(optionElement);
  });

  categoryFilterElement.value = currentValue || "all";
}

  renderCategoryFilter();
  renderProducts();
  renderCart();
  renderHistory();
}

  const validationMessage = validatePayment(paymentAmount, totalAmount);

  if (validationMessage) {
    showPaymentMessage(validationMessage, "error");
    return;
  }

  
  const transaction = {
    id: generateId(),
    date: new Date().toISOString(),
    items: cart.map((cartItem) => ({ ...cartItem })),
    total: totalAmount,
    paymentAmount,
    changeAmount,
  };

  transactions.unshift(transaction);

  // Kurangi stok produk
  cart.forEach((cartItem) => {
    const product = findProductById(cartItem.productId);

    if (product) {
      product.stock = Math.max(0, product.stock - cartItem.quantity);
    }
  });

  saveToStorage(PRODUCT_STORAGE_KEY, products);
  saveToStorage(TRANSACTION_STORAGE_KEY, transactions);

  cart = [];
  paymentInputElement.value = "";
  showPaymentMessage(
    `Transaksi berhasil. Kembalian: ${formatRupiah(changeAmount)}`,
    "success"
  );

  renderProducts();
  renderCart();
  renderHistory();


function showPaymentMessage(message, type) {
  paymentMessageElement.textContent = message;
  paymentMessageElement.className = `payment-message ${type}`;
}

// ===== Struk =====
function printReceipt() {
  if (cart.length === 0) {
    alert("Keranjang masih kosong.");
    return;
  }

  const totalAmount = calculateCartTotal();
  const paymentAmount = Number(paymentInputElement.value) || 0;
  const changeAmount = paymentAmount - totalAmount;

  const receiptItems = cart
    .map(
      (item) =>
        `${item.productName}\n  ${item.quantity} x ${formatRupiah(
          item.price
        )} = ${formatRupiah(item.price * item.quantity)}`
    )
    .join("\n\n");

  const receiptContent = `
================================
         TOKO MAJU JAYA
================================
Tanggal: ${new Date().toLocaleString("id-ID")}

DAFTAR BELANJA
--------------------------------
${receiptItems}
--------------------------------
TOTAL BELANJA : ${formatRupiah(totalAmount)}
UANG DITERIMA : ${formatRupiah(paymentAmount)}
KEMBALIAN     : ${formatRupiah(changeAmount)}
================================

        Terima kasih!
  `.trim();

  const receiptWindow = window.open("", "_blank", "width=420,height=650");

  if (!receiptWindow) {
    alert("Popup diblokir. Izinkan popup untuk mencetak struk.");
    return;
  }

  receiptWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Struk Belanja</title>
        <style>
          body {
            font-family: "Courier New", monospace;
            padding: 20px;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>${receiptContent}</body>
    </html>
  `);

  receiptWindow.document.close();
  receiptWindow.focus();
  receiptWindow.print();
}

  const totalAmount = calculateCartTotal();
  const paymentAmount = Number(paymentInputElement.value) || 0;
  const changeAmount = paymentAmount - totalAmount;

  const receiptItems = cart
    .map(
      (item) =>
        `${item.productName} x${item.quantity} — ${formatRupiah(
          item.price * item.quantity
        )}`
    )
    .join("\n");

  const receiptContent = `
    === STRUK BELANJA ===
    ${new Date().toLocaleString("id-ID")}

    ${receiptItems}

    Total: ${formatRupiah(totalAmount)}
    Uang Diterima: ${formatRupiah(paymentAmount)}
    Kembalian: ${formatRupiah(changeAmount)}

    Terima kasih!
  `;

  const receiptWindow = window.open("", "_blank", "width=400,height=600");

  if (!receiptWindow) {
    alert("Popup diblokir. Izinkan popup untuk mencetak struk.");
    return;
  }

  receiptWindow.document.write(`
    <pre style="font-family: monospace; padding: 16px;">${receiptContent}</pre>
  `);

  receiptWindow.document.close();
  receiptWindow.focus();
  receiptWindow.print();


// ===== Riwayat =====
function renderHistory() {
  historyListElement.innerHTML = "";

  if (transactions.length === 0) {
    historyListElement.innerHTML =
      '<p class="empty-state">Belum ada transaksi.</p>';
    return;
  }

  transactions.forEach((transaction) => {
    const transactionItems = transaction.items
      .map(
        (item) =>
          `<li>
            <span>${item.productName} x${item.quantity}</span>
            <span>${formatRupiah(item.price * item.quantity)}</span>
          </li>`
      )
      .join("");

    const transactionCard = document.createElement("article");
    transactionCard.className = "transaction-card";

    transactionCard.innerHTML = `
      <div class="transaction-header">
        <span class="transaction-date">${formatDate(transaction.date)}</span>
        <span class="transaction-total">${formatRupiah(transaction.total)}</span>
      </div>

      <ul class="transaction-items">${transactionItems}</ul>

      <div class="transaction-payment">
        <span>Uang diterima: ${formatRupiah(transaction.paymentAmount)}</span>
        <span>Kembalian: ${formatRupiah(transaction.changeAmount)}</span>
      </div>
    `;

    historyListElement.appendChild(transactionCard);
  });
}

function clearHistory() {
  if (transactions.length === 0) return;

  const isConfirmed = confirm("Yakin ingin menghapus seluruh riwayat transaksi?");

  if (!isConfirmed) return;

  transactions = [];
  saveToStorage(TRANSACTION_STORAGE_KEY, transactions);
  renderHistory();
}

// ===== Navigasi =====
function showKasirPage() {
  kasirPage.classList.remove("hidden");
  historyPage.classList.add("hidden");

  kasirTabButton.classList.add("active");
  riwayatTabButton.classList.remove("active");
}

function showHistoryPage() {
  historyPage.classList.remove("hidden");
  kasirPage.classList.add("hidden");

  riwayatTabButton.classList.add("active");
  kasirTabButton.classList.remove("active");
}

// ===== Event listener =====
productSearchElement.addEventListener("input", renderProducts);

productListElement.addEventListener("click", (event) => {
  const productId = event.target.dataset.addToCart;

  if (productId) {
    addToCart(productId);
  }
});

cartItemsElement.addEventListener("click", (event) => {
  const increaseId = event.target.dataset.increaseQuantity;
  const decreaseId = event.target.dataset.decreaseQuantity;
  const removeId = event.target.dataset.removeCartItem;

  if (increaseId) {
    changeCartItemQuantity(increaseId, 1);
  }

  if (decreaseId) {
    changeCartItemQuantity(decreaseId, -1);
  }

  if (removeId) {
    removeFromCart(removeId);
  }
});

adminTabButton.addEventListener("click", showAdminPage);

backToKasirButton.addEventListener("click", showKasirPageFromAdmin);

productForm.addEventListener("submit", saveProduct);

cancelEditButton.addEventListener("click", resetProductForm);

adminProductList.addEventListener("click", (event) => {
  const editProductId = event.target.dataset.editProduct;
  const deleteProductId = event.target.dataset.deleteProduct;

  if (editProductId) {
    editProduct(editProductId);
  }

  if (deleteProductId) {
    deleteProduct(deleteProductId);
  }
});

payButton.addEventListener("click", processPayment);
resetCartButton.addEventListener("click", resetCart);
printReceiptButton.addEventListener("click", printReceipt);
clearHistoryButton.addEventListener("click", clearHistory);
productSearchElement.addEventListener("input", renderProducts);
categoryFilterElement.addEventListener("change", renderProducts);

kasirTabButton.addEventListener("click", showKasirPage);
riwayatTabButton.addEventListener("click", showHistoryPage);

// ===== Elemen Admin Produk =====
const adminTabButton = document.getElementById("tab-admin");
const adminPage = document.getElementById("admin-page");
const backToKasirButton = document.getElementById("back-to-kasir");

const productForm = document.getElementById("product-form");
const productIdInput = document.getElementById("product-id");
const productNameInput = document.getElementById("product-name");
const productPriceInput = document.getElementById("product-price");
const productStockInput = document.getElementById("product-stock");
const productCategoryInput = document.getElementById("product-category");

const adminFormTitle = document.getElementById("admin-form-title");
const adminFormMessage = document.getElementById("admin-form-message");
const cancelEditButton = document.getElementById("cancel-edit");
const adminProductList = document.getElementById("admin-product-list");

// ===== Render tabel admin =====
function renderAdminProducts() {
  adminProductList.innerHTML = "";

  if (products.length === 0) {
    adminProductList.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">Belum ada produk.</td>
      </tr>
    `;
    return;
  }

  products.forEach((product) => {
    const tableRow = document.createElement("tr");

    tableRow.innerHTML = `
      <td>${product.name}</td>
      <td>${formatRupiah(product.price)}</td>
      <td>${product.stock}</td>
      <td>${product.category || "-"}</td>
      <td>
        <div class="action-buttons">
          <button
            class="edit-button"
            data-edit-product="${product.id}"
          >
            Edit
          </button>

          <button
            class="delete-button"
            data-delete-product="${product.id}"
          >
            Hapus
          </button>
        </div>
      </td>
    `;

    adminProductList.appendChild(tableRow);
  });
}

// ===== Validasi produk =====
function validateProduct(name, price, stock, category) {
  if (!name.trim()) {
    return "Nama produk tidak boleh kosong.";
  }

  if (!Number.isFinite(price) || price <= 0) {
    return "Harga harus lebih dari 0.";
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return "Stok tidak boleh negatif.";
  }

  if (!category.trim()) {
    return "Kategori tidak boleh kosong.";
  }

  return "";
}

// ===== Reset form admin =====
function resetProductForm() {
  productForm.reset();
  productIdInput.value = "";
  adminFormTitle.textContent = "Tambah Produk";
  cancelEditButton.classList.add("hidden");
  adminFormMessage.textContent = "";
  adminFormMessage.className = "admin-form-message";
}

// ===== Tambah atau edit produk =====
function saveProduct(event) {
  event.preventDefault();

  const productId = productIdInput.value;
  const productName = productNameInput.value.trim();
  const productPrice = Number(productPriceInput.value);
  const productStock = Number(productStockInput.value);
  const productCategory = productCategoryInput.value.trim();

  const validationMessage = validateProduct(
    productName,
    productPrice,
    productStock,
    productCategory
  );

  if (validationMessage) {
    adminFormMessage.textContent = validationMessage;
    adminFormMessage.className = "admin-form-message error";
    return;
  }

  if (productId) {
    const existingProduct = findProductById(productId);

    if (existingProduct) {
      existingProduct.name = productName;
      existingProduct.price = productPrice;
      existingProduct.stock = productStock;
      existingProduct.category = productCategory;
    }

    adminFormMessage.textContent = "Produk berhasil diperbarui.";
  } else {
    products.push({
      id: generateId(),
      name: productName,
      price: productPrice,
      stock: productStock,
      category: productCategory,
    });

    adminFormMessage.textContent = "Produk berhasil ditambahkan.";
  }

  adminFormMessage.className = "admin-form-message success";

  saveToStorage(PRODUCT_STORAGE_KEY, products);

  resetProductForm();
  renderAdminProducts();
  renderCategoryFilter();
  renderProducts();
}

// ===== Edit produk =====
function editProduct(productId) {
  const product = findProductById(productId);

  if (!product) return;

  productIdInput.value = product.id;
  productNameInput.value = product.name;
  productPriceInput.value = product.price;
  productStockInput.value = product.stock;
  productCategoryInput.value = product.category || "";

  adminFormTitle.textContent = "Edit Produk";
  cancelEditButton.classList.remove("hidden");
  adminFormMessage.textContent = "";
  adminFormMessage.className = "admin-form-message";
}

// ===== Hapus produk =====
function deleteProduct(productId) {
  const product = findProductById(productId);

  if (!product) return;

  const isConfirmed = confirm(
    `Yakin ingin menghapus produk "${product.name}"?`
  );

  if (!isConfirmed) return;

  products = products.filter((item) => item.id !== productId);

  // Hapus juga produk dari keranjang jika ada
  cart = cart.filter((cartItem) => cartItem.productId !== productId);

  saveToStorage(PRODUCT_STORAGE_KEY, products);

  renderAdminProducts();
  renderCategoryFilter();
  renderProducts();
  renderCart();
}

// ===== Navigasi admin =====
function showAdminPage() {
  adminPage.classList.remove("hidden");
  kasirPage.classList.add("hidden");
  historyPage.classList.add("hidden");

  adminTabButton.classList.add("active");
  kasirTabButton.classList.remove("active");
  riwayatTabButton.classList.remove("active");

  renderAdminProducts();
}

function showKasirPageFromAdmin() {
  showKasirPage();
}

// ===== Inisialisasi =====
initializeData();
renderCategoryFilter();
renderProducts();
renderCart();
renderHistory();
renderAdminProducts();