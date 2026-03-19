document.addEventListener("DOMContentLoaded", () => {
    // Get elements from the document
    const itemsTbody = document.getElementById("items-tbody");
    const addItemBtn = document.getElementById("add-item-btn");
    const printBtn = document.getElementById("print-btn");
    const saveJpgBtn = document.getElementById("save-jpg-btn");
    const sizer = document.getElementById("input-sizer");

    // Set current date and time
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear().toString().slice(-2)} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    document.getElementById("bill-date").textContent = formattedDate;

    let itemSerial = 1;

    // --- UPDATED: function to resize inputs ---
    function resizeInput(input) {
        // Use the placeholder as a minimum, or the value
        sizer.textContent = input.value || input.placeholder || '0';
        
        // --- THIS IS THE CHANGE: ---
        // Set width to sizer's width + 3px for the cursor
        input.style.width = (sizer.offsetWidth + 3) + 'px';
    }

    // --- New handler for input events ---
    function onInput(event) {
        resizeInput(event.target); // Resize first
        updateLineAndTotal(event); // Then calculate
    }

    // --- Function to add a new item row ---
    function addNewRow() {
        const row = document.createElement("tr");
        row.classList.add("item-row");
        
        row.innerHTML = `
            <td>${itemSerial}.</td>
            <td><input type="number" class="qty" value="1" min="0" placeholder="0"></td>
            <td><input type="number" class="rate" value="0," min="0" placeholder="0"></td>
            <td class="amount">0</td>
        `;
        
        itemsTbody.appendChild(row);
        itemSerial++;
        
        const qtyInput = row.querySelector(".qty");
        const rateInput = row.querySelector(".rate");

        // Set initial size for the new inputs
        resizeInput(qtyInput);
        resizeInput(rateInput);

        // Add event listeners to the new inputs
        qtyInput.addEventListener("input", onInput);
        rateInput.addEventListener("input", onInput);
        
        updateTotal();
    }

    // --- Function to update a single line's amount and then the total ---
    function updateLineAndTotal(event) {
        const row = event.target.closest(".item-row");
        const qty = parseFloat(row.querySelector(".qty").value) || 0;
        const rate = parseFloat(row.querySelector(".rate").value) || 0;
        const amount = qty * rate;
        
        row.querySelector(".amount").textContent = amount.toFixed(2);
        updateTotal();
    }

    // --- Function to update the grand total ---
    function updateTotal() {
        const rows = document.querySelectorAll(".item-row");
        let totalItems = 0;
        let totalQty = 0;
        let totalAmount =.0;

        rows.forEach(row => {
            totalItems++;
            totalQty += parseFloat(row.querySelector(".qty").value) || 0;
            totalAmount += parseFloat(row.querySelector(".amount").textContent) || 0;
        });

        document.getElementById("total-items").textContent = totalItems;
        document.getElementById("total-qty").textContent = totalQty;
        document.getElementById("total-amount").textContent = totalAmount.toFixed(2);
    }

    // --- Function to print the bill (Save as PDF) ---
    function printBill() {
        window.print();
    }

    // --- Function to save the bill as a JPG ---
    function saveBillAsJpg() {
        const billElement = document.getElementById("bill-to-save");
        billElement.style.backgroundColor = '#ffffff';

        html2canvas(billElement, {
            scale: 4,
            useCORS: true
        }).then(canvas => {
            const imgData = canvas.toDataURL("image/jpeg", 1.0);
            const link = document.createElement('a');
            const now = new Date();
            const filename = `KG-Bill-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.jpg`;
            link.download = filename;
            link.href = imgData;
            link.click();
            billElement.style.backgroundColor = '';
        });
    }

    // --- Event Listeners ---
    addItemBtn.addEventListener("click", addNewRow);
    printBtn.addEventListener("click", printBill);
    saveJpgBtn.addEventListener("click", saveBillAsJpg);

    // Add one row to start
    addNewRow();
});
