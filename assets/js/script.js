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

    /**
     * META TRACKING ENGINE (Gold Standard Implementation)
     * Author: Senior Tracking Engineer
     */

    // 1. Data Sanitization & Normalization Helpers
    const sanitize = (str) => str ? str.trim().toLowerCase() : '';
    const normalizePhone = (phone) => {
        let clean = phone.replace(/\D/g, '');
        if (clean.startsWith('0')) clean = '962' + clean.substring(1);
        else if (!clean.startsWith('962') && clean.length >= 9) clean = '962' + clean;
        return clean;
    };

    // 2. Reliable Event ID Generator (For Server-Side Deduplication)
    const getEventId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 3. Track InitiateCheckout with Value Mapping
    const trackInitiateCheckout = (offerId) => {
        if (typeof fbq === 'undefined') return;
        
        const value = offerId === '2' ? 40 : (offerId === '1' ? 25 : 0);
        const eventId = getEventId('ic');

        fbq('track', 'InitiateCheckout', {
            value: value > 0 ? value : undefined,
            currency: 'JOD',
            content_category: 'Weight Loss',
            content_ids: ['fields_lean_set'],
            num_items: offerId === '2' ? 4 : 2
        }, { eventID: eventId });
    };

    // Global Listeners for Micro-Interactions
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function() {
            const offerId = this.getAttribute('data-offer');
            if (offerId || this.href.includes('offer-section')) {
                trackInitiateCheckout(offerId);
            }
        });
    });

    // 4. Form Submission & Conversion API (CAPI) Bridge
    const orderForm = document.getElementById('orderForm');
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyrxR-TGa3677foz7Ory2shRj0dshXQzdOsdskvzo6JAp5VnE3X5-vaOtLXamDDKUie3g/exec';

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
            // Prepared Meta-Ready Payload for immediate algorithm training
            const eventID = getEventId('pur');
            const customerPhone = normalizePhone(phone);
            const names = name.trim().split(/\s+/);
            const fn = sanitize(names[0]);
            const ln = names.length > 1 ? sanitize(names.slice(1).join(' ')) : '';

            // Meta Pixel: Aggressive Event Enrichment
            if (typeof fbq !== 'undefined' && window.FB_PIXEL_ID) {
                // Re-init with identity for immediate event-to-user binding
                fbq('init', window.FB_PIXEL_ID, {
                    ph: customerPhone,
                    fn: fn,
                    ln: ln,
                    ct: sanitize(city),
                    country: 'jo'
                });

                // High-Fidelity Purchase Signal (Day 1 Optimization)
                fbq('track', 'Purchase', {
                    content_name: offerText,
                    content_type: 'product',
                    content_ids: [offerElement ? offerElement.value : 'standard_set'],
                    value: offerValue,
                    currency: 'JOD',
                    num_items: offerElement && offerElement.value === 'offer2' ? 4 : 2,
                    predicted_ltv: offerValue * 1.5, // Signals high-value customer to Meta
                    status: 'completed'
                }, { eventID: eventID });

                // Multi-step micro-conversion for better lookalike seed
                fbq('trackCustom', 'OrderFormSubmitted', {
                    city: city,
                    offer: offerText,
                    timestamp: new Date().toISOString()
                }, { eventID: 'sub_' + eventID });
            }

            // Prepare Payload for CAPI Bridge
            const params = new URLSearchParams({
                name: name,
                phone: phone,
                phone_normalized: customerPhone,
                city: city,
                address: address,
                offer: offerText,
                event_id: eventID,
                fbc: document.cookie.split('; ').find(row => row.startsWith('_fbc='))?.split('=')[1] || '',
                fbp: document.cookie.split('; ').find(row => row.startsWith('_fbp='))?.split('=')[1] || '',
                user_agent: navigator.userAgent,
                extern_id: eventID // Syncing all IDs for 100% matched CAPI
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
