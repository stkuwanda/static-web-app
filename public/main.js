console.log('Main JavaScript file loaded successfully.');
document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('booking-form');
	const demoDateInput = document.getElementById('demo-date');
	const messageBox = document.getElementById('message-box');
	const modal = document.getElementById('modal');
	const openModalBtn = document.getElementById('open-modal-btn');
	const closeButton = document.querySelector('.close-button');

	// Function to show the modal
	function showModal() {
		modal.classList.add('is-active');
	}

	// Function to hide the modal
	function hideModal() {
		modal.classList.remove('is-active');
	}

	// Set the minimum date to today to prevent past bookings
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	demoDateInput.min = `${year}-${month}-${day}`;

	// Event listeners to open and close the modal
	openModalBtn.addEventListener('click', showModal);
	closeButton.addEventListener('click', hideModal);

	// Close the modal if the user clicks outside of it
	window.addEventListener('click', (event) => {
		if (event.target === modal) {
			hideModal();
		}
	});

	form.addEventListener('submit', (event) => {
		event.preventDefault(); // Prevent default form submission

		// Simple validation check
		const inputs = form.querySelectorAll('input[required]');
		let isValid = true;
		inputs.forEach((input) => {
			if (!input.value) {
				isValid = false;
			}
		});

		if (!isValid) {
			messageBox.textContent = 'Please fill in all the required fields.';
			messageBox.classList.remove('bg-green', 'hidden');
			messageBox.classList.add('bg-red');
			messageBox.style.opacity = 1;

			setTimeout(() => {
				messageBox.style.opacity = 0;
				setTimeout(() => messageBox.classList.add('hidden'), 300);
			}, 3000);
			return;
		}

		// Collect form data
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		// Log the data to the console
		console.log('Demo Request Submitted:', data);

		// Simulate a successful submission
		messageBox.textContent =
			"Your demo request has been sent! We'll be in touch shortly.";
		messageBox.classList.remove('bg-red', 'hidden');
		messageBox.classList.add('bg-green');
		messageBox.style.opacity = 1;

		// Clear the form fields after submission
		form.reset();

		// Hide the modal after 3 seconds
		setTimeout(() => {
			hideModal();
		}, 3000);
	});
});
