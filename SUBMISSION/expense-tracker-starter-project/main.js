/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []
// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()


/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM

/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
 */

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array

/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
 */

/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
 */


/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */

/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */

/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */


/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */


const STORAGE_KEY = 'EXPENSE_TRACKER_DATA';
const RENDER_EVENT = 'render-transaction';
let transactions = [];
let editingId = null; 

function generateId() {
  return +new Date();
}

function generateTransactionObject(id, title, amount, date, type) {
  return { id, title, amount: Number(amount), date, type };
}

function isStorageExist() {
  if (typeof (Storage) === 'undefined') {
    alert('Browser kamu tidak mendukung Web Storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(transactions);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const transaction of data) {
      transactions.push(transaction);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addTransaction() {
  const title = document.getElementById('transactionFormTitleInput').value;
  const amount = Number(document.getElementById('transactionFormAmountInput').value);
  const date = document.getElementById('transactionFormDateInput').value;
  const type = document.getElementById('transactionFormTypeSelect').value;

  if (!title || amount < 1) {
    alert('Judul tidak boleh kosong dan nominal uang harus minimal 1 Rupiah!');
    return;
  }

  const id = generateId();
  const transactionObject = generateTransactionObject(id, title, amount, date, type);
  transactions.push(transactionObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  document.getElementById('transactionForm').reset();
}

function deleteTransaction(id) {
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions.splice(index, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function changeType(id) {
  const target = transactions.find(t => t.id === id);
  if (target) {
    target.type = target.type === 'income' ? 'expense' : 'income';
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function editTransaction(id) {
  const target = transactions.find(t => t.id === id);
  if (target) {
    document.getElementById('transactionFormTitleInput').value = target.title;
    document.getElementById('transactionFormAmountInput').value = target.amount;
    document.getElementById('transactionFormDateInput').value = target.date;
    document.getElementById('transactionFormTypeSelect').value = target.type;

    editingId = id;
    
    const submitBtn = document.querySelector('#transactionForm button[type="submit"]');
    if(submitBtn) submitBtn.textContent = 'Simpan Perubahan';
  }
}

function saveEditedTransaction() {
  const target = transactions.find(t => t.id === editingId);
  if (target) {
    const title = document.getElementById('transactionFormTitleInput').value;
    const amount = Number(document.getElementById('transactionFormAmountInput').value);
    
    // Validasi saat edit
    if (!title || amount < 1) {
      alert('Judul tidak boleh kosong dan nominal uang harus minimal 1 Rupiah!');
      return;
    }

    target.title = title;
    target.amount = amount;
    target.date = document.getElementById('transactionFormDateInput').value;
    target.type = document.getElementById('transactionFormTypeSelect').value;

    editingId = null;
    
    const submitBtn = document.querySelector('#transactionForm button[type="submit"]');
    if(submitBtn) submitBtn.textContent = 'Simpan';

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    document.getElementById('transactionForm').reset();
  }
}

function makeTransactionItem(transaction) {
  const container = document.createElement('div');
  container.setAttribute('data-testid', 'transactionItem');
  container.classList.add('transaction-card'); 

  const titleObj = document.createElement('h3');
  titleObj.setAttribute('data-testid', 'transactionItemTitle');
  titleObj.textContent = transaction.title;

  const amountObj = document.createElement('p');
  amountObj.setAttribute('data-testid', 'transactionItemAmount');
  amountObj.textContent = `Nominal: Rp${transaction.amount}`;

  const dateObj = document.createElement('p');
  dateObj.setAttribute('data-testid', 'transactionItemDate');
  dateObj.textContent = `Tanggal: ${transaction.date}`;

  const typeObj = document.createElement('p');
  typeObj.setAttribute('data-testid', 'transactionItemType');
  typeObj.textContent = `Tipe: ${transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`;

  const actionContainer = document.createElement('div');

  const changeTypeBtn = document.createElement('button');
  changeTypeBtn.setAttribute('data-testid', 'transactionItemEditTypeButton');
  changeTypeBtn.textContent = 'Ubah Tipe';
  changeTypeBtn.addEventListener('click', () => changeType(transaction.id));

  // Tombol edit (Tidak wajib data-testid di soal, opsional)
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => editTransaction(transaction.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('data-testid', 'transactionItemDeleteButton');
  deleteBtn.textContent = 'Hapus';
  deleteBtn.addEventListener('click', () => deleteTransaction(transaction.id));

  actionContainer.append(changeTypeBtn, editBtn, deleteBtn);
  container.append(titleObj, amountObj, dateObj, typeObj, actionContainer);

  return container;
}

document.addEventListener(RENDER_EVENT, () => {
  const incomeList = document.getElementById('incomeList');
  const expenseList = document.getElementById('expenseList');
  
  incomeList.innerHTML = '';
  expenseList.innerHTML = '';

  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  const searchInput = document.getElementById('searchTransactionFormTitleInput');
  const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';

  for (const transaction of transactions) {
    if (transaction.title.toLowerCase().includes(searchQuery)) {
      const transactionElement = makeTransactionItem(transaction);
      
      if (transaction.type === 'income') {
        incomeList.append(transactionElement);
      } else {
        expenseList.append(transactionElement);
      }
    }
    
    if (transaction.type === 'income') {
      totalPemasukan += transaction.amount;
    } else {
      totalPengeluaran += transaction.amount;
    }
  }

  const totalSaldo = totalPemasukan - totalPengeluaran;
  const saldoDisplay = document.querySelector('.tracker-summary__balance-amount');
  const pemasukanDisplay = document.querySelector('.tracker-summary__stat-amount--income');
  const pengeluaranDisplay = document.querySelector('.tracker-summary__stat-amount--expense');

  if (saldoDisplay) saldoDisplay.innerText = `Rp ${totalSaldo}`;
  if (pemasukanDisplay) pemasukanDisplay.innerText = `Rp ${totalPemasukan}`;
  if (pengeluaranDisplay) pengeluaranDisplay.innerText = `Rp ${totalPengeluaran}`;
});

document.addEventListener('DOMContentLoaded', () => {

  const greetingElement = document.querySelector('.tracker-header__greeting');
  if (greetingElement) {
    greetingElement.innerHTML = 'Halo, <strong>Radithya Aydin Aryasatya (radarya)</strong>';
  }

  const submitForm = document.getElementById('transactionForm');
  submitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (editingId !== null) {
      saveEditedTransaction();
    } else {
      addTransaction();
    }
  });

  const searchInput = document.getElementById('searchTransactionFormTitleInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      document.dispatchEvent(new Event(RENDER_EVENT));
    });
  }
  
  const searchForm = document.getElementById('searchTransactionForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      document.dispatchEvent(new Event(RENDER_EVENT));
    });
  }

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});