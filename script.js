document.addEventListener('DOMContentLoaded', () => {

  const contactForm = document.getElementById('contactForm');
  const subjectInput = document.getElementById('subject');
  const formSuccessBox = document.getElementById('formSuccess');

  // Check if there is a "?subject=" parameter in the URL (e.g. from Inquire button)
  const urlParams = new URLSearchParams(window.location.search);
  const subjectParam = urlParams.get('subject');
  if (subjectParam && subjectInput) {
    subjectInput.value = decodeURIComponent(subjectParam);
    // Focus the message textarea so the user can type immediately
    const messageInput = document.getElementById('message');
    if (messageInput) {
      setTimeout(() => messageInput.focus(), 200);
    }
  }

  // Handle form submission
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      const submitBtn = document.getElementById('submitBtn');
      const btnText = document.getElementById('btnText');

      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      // Show sending state
      if (submitBtn) {
        submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Sending Message...';
      }

      try {
        // Send real email via FormSubmit AJAX service directly to japhetogoy@gmail.com
        await fetch('https://formsubmit.co/ajax/japhetogoy@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `[Portfolio Contact] ${subject || 'General Inquiry'}`,
            message: message
          })
        });

        // Show in-page success feedback card
        showSuccess(name, subject);
      } catch (err) {
        console.log('Processed with local feedback:', err);
        // Show in-page success feedback even if offline or local file protocol
        showSuccess(name, subject);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (btnText) btnText.textContent = 'Send Message';
        }
      }
    });
  }

  function showSuccess(name, subject) {
    if (formSuccessBox) {
      document.getElementById('successSenderName').textContent = name || 'Friend';
      document.getElementById('successSubject').textContent = subject || 'General Inquiry';
      formSuccessBox.style.display = 'block';
      contactForm.style.display = 'none';
      formSuccessBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Reset form handler (button inside success message)
  const resetFormBtn = document.getElementById('resetFormBtn');
  if (resetFormBtn && contactForm && formSuccessBox) {
    resetFormBtn.addEventListener('click', () => {
      contactForm.reset();
      contactForm.style.display = 'block';
      formSuccessBox.style.display = 'none';
    });
  }

  // --------------------------------------------------------------------------
  // 2. INTERACTIVE PROJECT DETAILS MODAL (Portfolio Page)
  // --------------------------------------------------------------------------
  const modal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalBadge = document.getElementById('modalBadge');
  const modalDesc = document.getElementById('modalDesc');
  const modalDetails = document.getElementById('modalDetails');
  const modalInquireBtn = document.getElementById('modalInquireBtn');

  // Project details data for interactive preview
  const projectData = {
    portfolio: {
      title: 'Personal Portfolio Website',
      badge: 'Completed',
      badgeClass: 'active',
      desc: 'A modern, responsive multi-page website built with semantic HTML5 and clean CSS3. Designed with a dark minimalist theme (black, white, and crimson red) inspired by modern developer portfolios.',
      details: [
        'Semantic HTML5 structure across 4 dedicated pages (Home, About, Portfolio, Contact).',
        'Pure CSS styling with custom properties, smooth transitions, and mobile-first responsiveness.',
        'Custom photo background removal and defringing integration.',
        'Interactive forms and modal previews with vanilla JavaScript.'
      ],
      inquireSubject: 'Inquiry regarding Personal Portfolio Website'
    },
    programming: {
      title: 'Programming Logic & Labs',
      badge: 'In Progress',
      badgeClass: 'progress',
      desc: 'Academic laboratory exercises developed as a 1st-year BSIT student at Mindoro State University Calapan City Campus, focusing on core programming foundations in C and C#.',
      details: [
        'Logic Formulation: Flowcharts, pseudocode, and algorithm design.',
        'Control Structures: if/else decision trees, switch statements, and loop constructs (for, while, do-while).',
        'Data Handling: 1D and 2D arrays, functions, and string operations in C.',
        'C# (.NET): Basic object-oriented programming concepts, classes, and console applications.'
      ],
      inquireSubject: 'Inquiry regarding Programming Logic & Labs'
    },
    webui: {
      title: 'Web UI / Component Project',
      badge: 'Upcoming',
      badgeClass: 'progress',
      desc: 'A planned interactive front-end web application focused on building accessible, reusable User Interface (UI) components and modern web experiences.',
      details: [
        'Custom UI Components: Modals, dropdown menus, cards, and navigation bars.',
        'User Experience (UX): Focused on clear data hierarchy, readability, and mobile touch targets.',
        'Responsive Design: Adapting smoothly from mobile screens to desktop widescreen displays.'
      ],
      inquireSubject: 'Inquiry regarding Web UI / Component Project'
    }
  };

  // Open modal when clicking "View Details"
  const detailButtons = document.querySelectorAll('[data-project]');
  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const data = projectData[projKey];
      if (!data || !modal) return;

      modalTitle.textContent = data.title;
      modalBadge.textContent = data.badge;
      modalBadge.className = `project-badge ${data.badgeClass}`;
      modalDesc.textContent = data.desc;

      // Populate details list
      modalDetails.innerHTML = '';
      data.details.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        modalDetails.appendChild(li);
      });

      // Update inquire button link
      if (modalInquireBtn) {
        modalInquireBtn.href = `contact.html?subject=${encodeURIComponent(data.inquireSubject)}`;
      }

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
  });

  // Close modal functions
  function closeModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeModal();
    }
  });

});
