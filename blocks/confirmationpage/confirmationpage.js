export default async function decorate(block) {
  const leftContainer = document.createElement('div');
  leftContainer.className = 'left-button-container lg-col-4 col-12';
  const mapContainer = document.createElement('div');
  mapContainer.className = 'map-container lg-col-4 col-12';
  const emailBlock = document.createElement('div');
  emailBlock.innerHTML = `<div class="cp_email_wrap">
  <p>An email confirmation has been sent to:</p>
  <span class="cp_emailid">Jhonedoe@nationalvision.com</span><div>
`;
  const confirmationTopRigh = document.createElement('div');
  confirmationTopRigh.innerHTML = `<div class="confirmation-header">
  <div class="confirmation-user-left">
    <div class="confirmation-user-icon">
      <span aria-hidden="true" class="confirmation-user-icon_topleft"><img src="../../icons/cp_profile.svg"</span>
    </div>
    <div class="confirmation-user-info">
      <div class="confirmation-user-name">Syed Arif</div>
      <div class="confirmation-user-dob">4/02/2025</div>
    </div>
  </div>
  <div class="confirmation-user-right">
    <div class="confirmation-user-email">test@domain.com</div>
    <div class="patient-phone">
      <p class="patient-phone-text">
        <span class="mobile-hide"></span> (470) 322-7601*
      </p>
    </div>
  </div>
</div>
`;
  // Add HTML content
  mapContainer.innerHTML = `
    <div class="map-container-wrapper">
    <div class="date-type-container">
        <div class="time-container">
            <p>Scheduled:</p>
            <p>12:00 PM Thu, Jul 24</p>
        </div>
        <div class="exam-type-container">
            <p>Exam Type:</p>
            <p>Eyeglasses Only</p>
        </div>
    </div>
    <div class="center-details-container-wrapper">
            <div class="location-details">
                <p><img src="./icons/breadcrumb-icon.svg" alt="">Location</p>
                <p>2.8 mi</p>
            </div>
            <div class="center-details">
                <p class="get-directions"> Get Directions</p>
                <p class="center-info">
                    <span>Open Now:</span>
                    <span>Close at 7:00 PM</span>
                </p>
                <p class="address">
                    <span>2525 West Anderson</span>
                    <span>Lane</span>
                    <span>Austin, TX 78757</span>
                </p>
                <p class="contact-details">(786) 123-1234</p>
                <p class="center-message">Eye exams provided by: South Florida Regional Eye Associates, LLC</p>

            </div>
        
    </div>
    <div class="map-details-container">
        <img src="./images/map-image.png" alt="">
    </div>
</div>
  `;
  const addtocalendarlist = document.createElement('div');
  addtocalendarlist.classList.add('calendar_dropdown');
  addtocalendarlist.innerHTML = `<div class="dropdown-menu dropdown-menu-right show" aria-labelledby="add-to-calendar" x-placement="bottom-end">
    <a class="dropdown-item js_apple_email_download" js-ics-download="" download="eye_exam.ics" href="apple"><span aria-hidden="true" class="icon-apple a-icon_icon"></span> Apple</a>
    <a class="dropdown-item js_google_download" js-gcal="" target="_blank" href="https://www.google.com/calendar/render?action=TEMPLATE&amp;text=Eye+Exam+at+America's+Best&amp;dates=20250902T113000/20250902T123000&amp;details=Northcourt+Commons+%20|%20680+County+Highway+10+NE+%20|%20Blaine+MN,+55434+%20|%20(763)+785-2200&amp;location=680+County+Highway+10+NE+Blaine+MN,+55434&amp;sf=true&amp;output=xml"><span aria-hidden="true" class="icon-google a-icon_icon"></span> Google (Online)</a>
    <a class="dropdown-item js_outlook_download" js-ics-download="" download="eye_exam.ics" href="outlook"><span aria-hidden="true" class="icon-microsoft a-icon_icon "></span> Outlook</a>
    <a class="dropdown-item js_outlook_download" js-outlook="" target="_blank" href="https://outlook.office.com/calendar/deeplink/compose?&amp;subject=Eye+Exam+at+America's+Best&amp;location=680+County+Highway+10+NE+Blaine+MN,+55434&amp;startdt=2025-09-02T06:00:00.000Z&amp;enddt=2025-09-02T07:00:00.000Z&amp;body=Northcourt+Commons+%20|%20680+County+Highway+10+NE+%20|%20Blaine+MN,+55434+%20|%20(763)+785-2200"><span aria-hidden="true" class="icon-microsoft a-icon_icon"></span> Outlook (Online) </a>
</div>
`;
  const rightContainer = document.createElement('div');
  rightContainer.className = 'right-text-container lg-col-4 col-12';
  const leftContainerA = document.createElement('div');
  leftContainerA.classList.add('leftContainer-1');

  const leftContainerB = document.createElement('div');
  leftContainerB.classList.add('leftContainer-2');

  leftContainer.appendChild(leftContainerA);
  leftContainer.appendChild(leftContainerB);
  const confirmationPageClasses = [
    'examConfirmationMessage',
    'changeAppointmentButton',
    'cancelAppointmentButton',
    'saveTimeReminder',
    'completePaperworkButton',
    'addToCalendarButton',
    'bookAnotherExamButton',
    'locationandmap',
    'appointmentPreparationInfo',
    'notificationDisclaimer',
  ];
  // Loop through children and distribute them
  Array.from(block.children).forEach((child, index) => {
    child.classList.add(confirmationPageClasses[index]);
    if (index < 3) {
      leftContainerA.appendChild(child);
    } else if (index < 7) {
      leftContainerB.appendChild(child);
    } else if (index === 7) {
      mapContainer.appendChild(child);
    } else if (index > 7) {
      rightContainer.appendChild(child);
    }
  });
  const containerClass = document.querySelector('.section.confirmationpage-container');
  const containerRow = document.querySelector('.confirmationpage.block');
  containerClass?.classList.add('container');
  containerRow?.classList.add('row');
  // Clear the block and append the new containers
  block.innerHTML = '';
  block.appendChild(leftContainer);
  block.appendChild(mapContainer);
  block.appendChild(rightContainer);
  const examConfirmationMessageDiv = document.querySelector('.examConfirmationMessage');
  examConfirmationMessageDiv?.after(emailBlock);
  const addtocalendarlistDiv = document.querySelector('.addToCalendarButton');
  addtocalendarlistDiv?.after(addtocalendarlist);
  const confirmationContent = document.querySelector('.appointmentPreparationInfo');
  confirmationContent?.before(confirmationTopRigh);

  addtocalendarlistDiv.addEventListener('click', function () {
    const parentDiv = this.closest('.leftContainer-2');
    if (parentDiv) {
      parentDiv.classList.toggle('active-calendar');
    }
  });
  document.addEventListener('click', (event) => {
    const isClickInsideDropdown = event.target.closest('.dropdown-menu-right');
    const isClickInsideCalendar = event.target.closest('.leftContainer-2');

    if (!isClickInsideDropdown && !isClickInsideCalendar) {
      document.querySelectorAll('.leftContainer-2.active-calendar').forEach((el) => {
        el?.classList.remove('active-calendar');
      });
    }
  });
  function downloadICS() {
    const event = {
      title: 'Team Meeting',
      description: 'Monthly sync-up',
      location: 'Zoom',
      start: '20250901T100000Z', // Format: YYYYMMDDTHHMMSSZ
      end: '20250901T110000Z',
    };

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:eye-exam
DTSTART:${event.start}
DTEND:${event.end}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR
  `.trim();

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'eye_exam.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const icon_apple = document.querySelector('.js_apple_email_download');
  const icon_outlook = document.querySelector('.js_outlook_download');
  icon_apple?.addEventListener('click', () => {
    downloadICS();
  });
  icon_outlook?.addEventListener('click', () => {
    downloadICS();
  });
}
