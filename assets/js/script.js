// script.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Countdown Timer
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');

    let timeRemaining = (4 * 60 * 60) + (45 * 60) + 30;

    function updateCountdown() {
        const h = Math.floor(timeRemaining / 3600);
        const m = Math.floor((timeRemaining % 3600) / 60);
        const s = timeRemaining % 60;
        if (hoursSpan) hoursSpan.textContent = h.toString().padStart(2, '0');
        if (minutesSpan) minutesSpan.textContent = m.toString().padStart(2, '0');
        if (secondsSpan) secondsSpan.textContent = s.toString().padStart(2, '0');
        if (timeRemaining > 0) timeRemaining--;
    }
    setInterval(updateCountdown, 1000);

    // 2. FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('active');
        });
    });

    // 3. Form Submission
    const orderForm = document.getElementById('orderForm');
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyr-4PftBgz1iMM0saYMlGT4HrQnX8NfX7ybn8RAblA1S7bk1nhuFAMdF2WA2GHvhze2g/exec';

    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = orderForm.querySelector('.btn-submit');
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال الطلب...';
            submitBtn.disabled = true;

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const city = document.getElementById('city').value;
            const address = document.getElementById('address').value;
            const offerElement = document.querySelector('input[name="offerSelect"]:checked');
            const offerText = offerElement ? offerElement.parentElement.innerText.trim() : "غير محدد";

            // طريقة إرسال بديلة وأكثر استقراراً (Image Beacon)
            const params = new URLSearchParams({
                name: name,
                phone: phone,
                city: city,
                address: address,
                offer: offerText
            });

            // محاولة الإرسال وتجاهل رد المتصفح لضمان العمل مع Google Apps Script
            fetch(SCRIPT_URL + "?" + params.toString(), {
                method: 'GET',
                mode: 'no-cors'
            })
                .then(() => {
                    // نظراً لاستخدام no-cors، سنعتبر العملية ناجحة دائماً في حال وصول الـ Fetch للمرحلة هذه
                    alert('تم استلام طلبك بنجاح! سيتم التواصل معك قريباً لتأكيد الشحن.');
                    orderForm.reset();
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> تأكيد الطلب والدفع عند الاستلام';
                    submitBtn.disabled = false;
                })
                .catch(err => {
                    console.error('Error!', err);
                    alert('حدث خطأ بسيط، سنتواصل معك هاتفياً لإكمال الطلب.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> تأكيد الطلب والدفع عند الاستلام';
                });
        });
    }
});
