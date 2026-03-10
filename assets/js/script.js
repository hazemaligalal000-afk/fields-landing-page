// script.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Countdown Timer
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');

    // Set countdown for 4 hours, 45 mins, 30 secs from now
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
            // Reset to 2 hours when it reaches zero (Simulated scarcity)
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
            
            // Uncheck all
            radioInputs.forEach(input => input.checked = false);
            radioLabels.forEach(label => label.classList.remove('highlight-radio'));

            // Check selected
            const targetInput = document.querySelector(`input[value="offer${offerId}"]`);
            if(targetInput) {
                targetInput.checked = true;
                targetInput.closest('.radio-label').classList.add('highlight-radio');
            }
        });
    });

    // Handle manual radio selection
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
            
            // Close all others
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if(otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current
            item.classList.toggle('active');
        });
    });


    // 4. Form Submission (Simulated)
    const orderForm = document.getElementById('orderForm');
    
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation check
        if(orderForm.checkValidity()) {
            const submitBtn = orderForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال الطلب...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Success Message
                alert('تم استلام طلبك بنجاح! سيتم التواصل معك قريباً لتأكيد الشحن.');
                orderForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });

});
