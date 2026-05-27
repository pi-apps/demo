const affiliateForm = document.getElementById('affiliateForm');
const affiliateResponse = document.getElementById('affiliateResponse');

if (affiliateForm && affiliateResponse) {
  affiliateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('affiliateName')?.value.trim();
    const email = document.getElementById('affiliateEmail')?.value.trim();
    const channel = document.getElementById('affiliateChannel')?.value.trim();

    if (!name || !email || !channel) {
      affiliateResponse.style.color = '#b00020';
      affiliateResponse.textContent = 'Please complete all fields.';
      return;
    }

    affiliateResponse.style.color = '#157347';
    affiliateResponse.textContent = 'Thanks! Your affiliate request has been submitted.';
    affiliateForm.reset();
  });
}
