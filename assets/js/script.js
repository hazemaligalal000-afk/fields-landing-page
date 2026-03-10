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

        hoursSpan.textContent = h.toString().padStart(2, '0');
        minutesSpan.textContent = m.toString().padStart(2, '0');
        secondsSpan.textContent = s.toString().padStart(2, '0');

        if (timeRemaining > 0) {
            timeRemaining--;
        } else {
            timeRemaining = 2 * 60 * 60;
        }
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

    radioInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            radioLabels.forEach(label => label.classList.remove('highlight-radio'));
            e.target.closest('.radio-label').classList.add('highlight-radio');
        });
    });


    // 3. FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });


    // 4. Form Submission (Google Sheets Integration)
    const orderForm = document.getElementById('orderForm');
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhSuNPYEThdRAW2B06EDCYyxuXcjSlIgQ_Ah5mF-LPTOU5Ng2V_h1IssdtfjGO8w0lbw/exec';

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (orderForm.checkValidity()) {
            const submitBtn = orderForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال الطلب...';
            submitBtn.disabled = true;

            // تجميع البيانات في FormData لإرسالها بشكل سليم
            const formData = new URLSearchParams();
            formData.append('name', document.getElementById('name').value);
            formData.append('phone', document.getElementById('phone').value);
            formData.append('city', document.getElementById('city').value);
            formData.append('address', document.getElementById('address').value);
            formData.append('offer', document.querySelector('input[name="offerSelect"]:checked').parentElement.innerText.trim());

            // إرسال البيانات (في App Script نستخدم no-cors)
            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            })
                .then(() => {
                    alert('تم استلام طلبك بنجاح! سيتم التواصل معك قريباً لتأكيد الشحن.');
                    orderForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                })
                .catch(error => {
                    console.error('Submission Error:', error);
                    alert('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        }
    });

});
