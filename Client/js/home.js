document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".sidebar nav ul li a");
    const contentArea = document.getElementById("content-area");

    const contentData = {
        sales: "<h2>Sales</h2><p>Manage all sales activities and reports.</p>",
        purchases: "<h2>Purchases</h2><p>Track and manage purchases efficiently.</p>",
        inventory: "<h2>Inventory</h2><p>Monitor stock levels and inventory details.</p>",
        treasury: "<h2>Treasury</h2><p>Handle financial transactions and treasury management.</p>",
        booking: "<h2>Booking & Inquiries</h2><p>Manage customer bookings and inquiries.</p>",
        workshop: "<h2>Workshop Management</h2><p>Oversee workshop operations and schedules.</p>",
        settings: "<h2>Main Settings</h2><p>Configure system settings and preferences.</p>"
    };

    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const section = this.getAttribute("data-section");
            contentArea.innerHTML = contentData[section] || "<h2>Not Found</h2><p>Content unavailable.</p>";
        });
    });
});
