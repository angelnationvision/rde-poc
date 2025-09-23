export default async function decoratemyaccount() {
  const myaccounticon = document.querySelector('.nav-tools .icon-account-icon');
  const myaccounticonActive = document.querySelector('.icon-account-icon-active');
  const baseUrldomain = window.location.origin;
  const redirectToLoginPage = `${baseUrldomain}/customer/account/entry/`;
  const redirectToDashboradboard = `${baseUrldomain}/customer/account`;
  function redirectToAccountPage() {
    window.open(redirectToLoginPage, '_self');
  }
  function redirectToAccountPageDashborad() {
    window.open(redirectToDashboradboard, '_self');
  }
  myaccounticonActive.addEventListener('click', (e) => {
    e.stopPropagation();
    redirectToAccountPageDashborad();
  });
  myaccounticon.addEventListener('click', (e) => {
    e.stopPropagation();
    redirectToAccountPage();
  });
}
