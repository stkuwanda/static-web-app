// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', function () {
	const hamburger = document.getElementById('hamburger-menu');
	const mobileMenu = document.getElementById('mobile-menu');
	if (hamburger && mobileMenu) {
		hamburger.addEventListener('click', function () {
			const expanded = hamburger.getAttribute('aria-expanded') === 'true';
			hamburger.setAttribute('aria-expanded', !expanded);
			mobileMenu.classList.toggle('is-active');
			hamburger.classList.toggle('is-active');
		});
	}
});
console.log('Main JavaScript file loaded successfully.');

// Initialize Supabase client
const supabase = window.supabase.createClient(
	window.supabaseConfig.url,
	window.supabaseConfig.anonKey
);

document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('booking-form');
	const demoDateInput = document.getElementById('demo-date');
	const messageBox = document.getElementById('message-box');
	const modal = document.getElementById('modal');
	const openModalBtn = document.getElementById('open-modal-btn');
	const openModalBtn1 = document.getElementById('open-modal-btn-1');
  const openModalBtn2 = document.getElementById('open-modal-btn-2');
  const openModalBtn3 = document.getElementById('open-modal-btn-3');
  const openModalBtn4 = document.getElementById('open-modal-btn-4');
	const closeButton = document.querySelector('.close-button');

	// Function to show the modal
	function showModal() {
		// Hide and reset the message box every time modal is opened
		messageBox.classList.add('hidden');
		messageBox.classList.remove('bg-green', 'bg-red');
		messageBox.textContent = '';
		messageBox.style.opacity = 1;
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
	openModalBtn1.addEventListener('click', showModal);
  openModalBtn2.addEventListener('click', showModal);
  openModalBtn3.addEventListener('click', showModal);
  openModalBtn4.addEventListener('click', showModal);
	closeButton.addEventListener('click', hideModal);

	// Close the modal if the user clicks outside of it
	window.addEventListener('click', (event) => {
		if (event.target === modal) {
			hideModal();
		}
	});

	form.addEventListener('submit', (event) => {
		event.preventDefault(); // Prevent default form submission

		// Get input values
		const demoDate = form.elements['demo-date'].value.trim();
		const organization = form.elements['organization'].value.trim();
		const fullName = form.elements['full-name'].value.trim();
		const cellNumber = form.elements['cell-number'].value.trim();
		const email = form.elements['email'].value.trim();

		// Validation regexes
		const orgRegex = /^[\w\s.,'&()\-]{2,100}$/;
		const nameRegex = /^[A-Za-z\s\-']{2,100}$/;
		const cellRegex = /^[\d\s()+-]{7,20}$/;
		const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;

		// Date validation: must be today or in the future
		const today = new Date();
		const selectedDate = new Date(demoDate);
		today.setHours(0, 0, 0, 0);
		selectedDate.setHours(0, 0, 0, 0);
		if (!demoDate || selectedDate < today) {
			showError('Please select a valid date (today or later).');
			return;
		}
		if (!organization || !orgRegex.test(organization)) {
			showError('Organization name contains invalid characters.');
			return;
		}
		if (!fullName || !nameRegex.test(fullName)) {
			showError(
				'Full name should only contain letters, spaces, hyphens, or apostrophes.'
			);
			return;
		}
		if (!cellNumber || !cellRegex.test(cellNumber)) {
			showError('Cell number format is invalid.');
			return;
		}
		if (!email || !emailRegex.test(email)) {
			showError('Please enter a valid email address.');
			return;
		}

		// Collect form data
		const formData = {
			demo_date: demoDate,
			organization: organization,
			full_name: fullName,
			cell_number: cellNumber,
			email: email,
		};

		// Save to Supabase
		saveToSupabase(formData);
	});

	function showError(msg) {
		messageBox.textContent = msg;
		messageBox.classList.remove('bg-green', 'hidden');
		messageBox.classList.add('bg-red');
		messageBox.style.opacity = 1;
		setTimeout(() => {
			messageBox.style.opacity = 0;
			setTimeout(() => messageBox.classList.add('hidden'), 300);
		}, 3000);
	}

	// Function to save form data to Supabase
	async function saveToSupabase(formData) {
		try {
			const { data, error } = await supabase
				.from('demo_requests')
				.insert([formData]);

			if (error) {
				console.error('Error saving to Supabase:', error);
				showError('Failed to save your request. Please try again.');
				return;
			}

			console.log('Data saved successfully:', data);

			// Show success message
			messageBox.textContent =
				"Your demo request has been saved! We'll be in touch shortly.";
			messageBox.classList.remove('bg-red', 'hidden');
			messageBox.classList.add('bg-green');
			messageBox.style.opacity = 1;

			// Clear the form fields after submission
			form.reset();

			// Hide the modal after 3 seconds
			setTimeout(() => {
				hideModal();
			}, 3000);
		} catch (error) {
			console.error('Network error:', error);
			showError('Network error occurred. Please check your connection.');
		}
	}
});
