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

    // 2. Select Offer Buttons
    const offerButtons = document.querySelectorAll('.select-offer');
    const radioInputs = document.querySelectorAll('input[name="offerSelect"]');
    const radioLabels = document.querySelectorAll('.radio-label');

    offerButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const offerId = e.target.getAttribute('data-offer');
            radioInputs.forEach(input => input.checked = false);
            radioLabels.forEach(label => label.classList.remove('highlight-radio'));
            const targetInput = document.querySelector(`input[value="offer${offerId}"]`);
            if (targetInput) {
                targetInput.checked = true;
                targetInput.closest('.radio-label').classList.add('highlight-radio');
            }
        });
    });

    // 3. FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });

    // 4. Form Submission (Google Sheets Connection)
    const orderForm = document.getElementById('orderForm');
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxrZfrsRsnOOJDe7r-uk3db3GpADdJXtQO6QQXr-lHz_QUM7myIH8beK5BkUK3oIl-mNA/exec';

    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = orderForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال الطلب...';
            submitBtn.disabled = true;

            // استخراج البيانات
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const city = document.getElementById('city').value;
            const address = document.getElementById('address').value;
            const offerElement = document.querySelector('input[name="offerSelect"]:checked');
            const offerText = offerElement ? offerElement.parentElement.innerText.trim() : "غير محدد";

            // بناء الرابط للإرسال عبر GET (أكثر استقراراً)
            const finalUrl = SCRIPT_URL +
                "?name=" + encodeURIComponent(name) +
                "&phone=" + encodeURIComponent(phone) +
                "&city=" + encodeURIComponent(city) +
                "&address=" + encodeURIComponent(address) +
                "&offer=" + encodeURIComponent(offerText);

            // الإرسال بطريقة fetch الصامتة
            fetch(finalUrl, { mode: 'no-cors' })
                .then(() => {
                    alert('تم استلام طلبك بنجاح! سيتم التواصل معك قريباً لتأكيد الشحن.');
                    orderForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                })
                .catch(error => {
                    console.error('Submission error:', error);
                    alert('حدث خطأ، يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
});
