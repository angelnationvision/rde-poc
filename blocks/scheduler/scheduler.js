/* eslint-disable */

export default function decorate(block) {
  const schedulerDiv = block?.querySelector('div#scheduler-app');

  if (!schedulerDiv) {
    const storeIdInput = document.createElement('input');
    storeIdInput.className = 'js-scheduler-store-num';
    storeIdInput.type = 'hidden';
    storeIdInput.value = '5655';

    block?.appendChild(storeIdInput);

    const rebookIdInput = document.createElement('input');
    rebookIdInput.className = 'js-rebook-appt-id';
    rebookIdInput.type = 'hidden';
    rebookIdInput.value = '';

    block?.appendChild(rebookIdInput);

    const rebookIdHashedInput = document.createElement('input');
    rebookIdHashedInput.className = 'js-rebook-appt-id-hashed';
    rebookIdHashedInput.type = 'hidden';
    rebookIdHashedInput.value = '';

    block?.appendChild(rebookIdHashedInput);

    const rebookIdDataInput = document.createElement('input');
    rebookIdDataInput.className = 'js-rebook-appointment-data';
    rebookIdDataInput.type = 'hidden';
    rebookIdDataInput.value = '';

    block?.appendChild(rebookIdDataInput);

    const section = document.createElement('div');
    section.id = 'scheduler-app';
    block?.appendChild(section);

    window.ACC = {};
    window.ACC.config = JSON.parse(
      '{"contextPath":"","encodedContextPath":"","currentEnvironment":"production","nviWebServiceUrlBase":"https://api-az.nationalvision.com/nvicommercewebservices/v2/","commonResourcePath":"/_ui/responsive/common","themeResourcePath":"/_ui/responsive/theme-ambest","siteResourcePath":"/_ui/responsive/site-ambest","rootPath":"/_ui/responsive","siteName":"ambest","apptHashId":"","egwSiteUrl":"https://www.eyeglassworld.com","CSRFToken":"20d16636-cb21-4d7f-8256-9918eb53c21f","site":"ambest","currencyCode":"USD","sunglassesPurchasable":false,"isLoggedIn":false,"userId":null,"sessionUid":"s111983922410704","lastCustomerId":"0","isNewLensWizardEnabled":false,"zipCodeError":"Please enter a valid zip / postal code.","postalCode":"Please enter a valid postal code (A1A 1A1).","zipRegionError":"","free":"FREE","googleApiKey":"AIzaSyAf6y5HBwBCQoGOdmDQ-hi16ofHsrqnf9A","googleApiVersion":"3.7","missingImagePath":"/_ui/responsive/theme-nvi/images/missing_product_EN_300x300.jpg","viewAll":"View All Results","isMixAndMatchSite":false,"mixAndMatchPrice":"Add 2nd pair for {0}","secondPairDiscountMore":"more","favorites":{"title":{"plural":"You Have {0} Favorites","singular":"You Have {0} Favorite"}},"cloudflare":{"image":{"resize":true},"host":{"ambest":"https://www.americasbest.com","egw":"https://www.eyeglassworld.com","mo":"https://www.militaryoptical.com","walmart":"https://www.visioncenteronline.com"}},"payeezyExists":"false","visibleV2Enable":"true","pdpRequiredParams":true,"vtoEnabled":true,"loginUrl":"/login","authenticationStatusUrl":"/authentication/status","hasAutoSuggest":"true"}'
    );
    window.SCH = JSON.parse(
      `{"config":{"backToEgwLink":"Back to Eyeglass World","egwSite":"https://www.eyeglassworld.com","stepNumber":"1","cards":{"changeAddressSrTxt":"change button for store location","editExamDateTxt":"exam details edit","examTypeLabel":"Exam Type","egwSiteUrl":"https://www.eyeglassworld.com","dateLabel":"Date & Time","phoneTypeTxt":"Phone Type","storeDetailEyeExamTxt":"Eye exams provided by:","storeLocation":"Store Location"},"dob":{"dobDefaultText":"What's the patient's date of birth?","error":{"futureDateMsg":"Date of Birth cannot be a future date.","invalidDateMsg":"Please enter a valid date of birth","maxAgeMsg":"Age cannot be more than 120","minAgeMsg":"Age cannot be less than 5"},"showDob":true},"errorModal":{"cta":"Back to Exam","noApptsAvailableForSds":"We're sorry! Our system is experiencing a problem. Please try again later or contact Customer Care by calling 1-800-637-3597 to schedule an appointment.","title":"We’re Sorry!"},"form":{"contact":{"adultAgeConfirmationMsg":"Please confirm you are 18 or older","certifyAgeLabel":"I certify that I am 18 years or older.*","smsOptOutLabel":"Send me text messages about my appointment.<sup>†</sup>","title":"Contact Information","updateContactInfo":"Please verify your patient contact information. Updating the phone number will update the patient record."},"exam":{"everWornLensesTxt":"Has this patient worn contact lenses before?","examTypeTxt":"Exam Type","hadExamTxt":"Has this patient had an exam at an America’s Best store?","needsAssistanceTxt":"Do any of the following apply to this patient?","needsAssistanceDescriptionTxt":"Your answer helps us determine the appointment length.","specialApptLines":[],"standardApptLines":{"mobility":"Limited mobility","diabetes":"Diabetes","communication":"Needs assistance with communication"}},"validation":{"birthdayMsg":"Date of Birth","datePicker":"Please select an available day and time.","dayMsg":"Day","emailMsg":"Please enter a valid email","fourDigitMsg":"Four digit","monthMsg":"Month","nameMsg":"Please enter a valid name, with no numbers, between 2 and 255 characters.","patientSelectMsg":"Please select a patient","phoneMsg":"Please enter a valid phone number","radioMsg":"Please select an option","requiredMsg":"This field is required","twoDigitMsg":"Two digit","yearMsg":"Year"}},"futureDateWarning":"Please note: Exam is for a <strong>future date</strong>","loadingTimesMsg":"Loading Available Time Slots... Please Wait...","login":{"loginFormErrorMsg":"Your password or email was incorrect.","registerDescription":"All fields are required. ","loginEnabled":true},"nearbyLocation":{"nearbyAmbest":"America's Best ","nearbyBest":"Find an appointment at a nearby","nearbyEyeglassWorld":"Eyeglass World ","nearbyLocation":"location.","nearbyVisionCenter":"Vision Center ","nearbyVistaOptical":"Vista Optical ","showNearbyStores":false},"nearbyLocationMsg":"No convenient times at ","noAvailabilityApiDownErrorMsg":"Our appointment scheduler is currently experiencing technical difficulties. Please try again in a few minutes or call <a href=\\"tel:+18009994758\\">1-800-999-4758</a> to book an appointment.","noAvailabilityErrorMsg":"We are all booked for the next 30 days! Please select an alternate location or call Customer Service at <a href=\\"tel:+18009994758\\">1-800-999-4758</a>.","noSlotsByApptTypeErrorMsg":"This location does not have any appointments available online to accommodate the exam you are requesting. Please contact <a href=\\"tel:+18009994758\\">1-800-999-4758</a> to speak to an Associate for assistance, or you may select an alternate location to check availability.","noAvailableTimes":"We're all booked! Please find another time or day.","noStorePhone":"true","optometristEde":"With an Independent Doctor of Optometry","patientSelectLabel":"Choose a patient","pdpProductLoading":"Loading...","stepNav":{"addExamBtn":"Add Exam","bookNowBtn":"Book Now","continueBtn":"Continue","removeExamBtn":"Remove Exam","remoteCareDisclaimerSelectedTextBtn":"You’ve selected a <strong>In Store Remote Eye Exam</strong>.","remoteCareViewDetailsBtn":"View Details"},"storeName":"University Crossings","weekpicker":{"remoteCareTimeSlot":"remote care time slot","today":"Today"},"insurance":{"enabled":true,"selectEnabled":true,"carriers":"EyeMed,VSP,Spectera,Davis,Superior Vision,NVA - National Vision Administrators,Centene/Envolve,Premier Eye Care,Avesis,Vision Benefits of America,Other/Unsure"},"showSpecialNeeds":false}}`
    );

    (async () => {
      const { default: sheduler } = await import('/lib/scheduler-module.js');
      console.log('sheduler init', sheduler);
      shed.init(); // using global variable to load scheduler module
    })();
  }
}
