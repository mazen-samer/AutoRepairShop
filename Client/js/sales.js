document.addEventListener("DOMContentLoaded", function() {
    const subtotalInput = document.querySelector("input[placeholder='Subtotal']");
    const discountInput = document.querySelector("input[placeholder='% or fixed']");
    const taxInput = document.querySelector("input[placeholder='VAT %']");
    const shippingInput = document.querySelector("input[placeholder='Optional']");
    const totalInput = document.querySelector("input[value=''][readonly]");

    function calculateTotal() {
        let subtotal = parseFloat(subtotalInput.value) || 0;
        let discount = parseFloat(discountInput.value) || 0;
        let tax = parseFloat(taxInput.value) || 0;
        let shipping = parseFloat(shippingInput.value) || 0;
        
        let discountAmount = (discount > 0 && discount <= 100) ? (subtotal * (discount / 100)) : discount;
        let taxedAmount = (subtotal - discountAmount) * (tax / 100);
        let total = subtotal - discountAmount + taxedAmount + shipping;
        
        totalInput.value = total.toFixed(2);
    }

    [subtotalInput, discountInput, taxInput, shippingInput].forEach(input => {
        input.addEventListener("input", calculateTotal);
    });
});
