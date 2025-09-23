export default async function decoratemyaccount() {
  const myaccounticon = document.querySelector('.nav-tools .icon-account-icon');
  const myaccounticonActive = document.querySelector('.icon-account-icon-active');
  function redirectToAccountPage() {
    window.open('https://mcstaging2.americasbest.com/customer/account/entry/', '_self');
  }
  function redirectToAccountPageDashborad() {
    window.open('https://mcstaging2.americasbest.com/customer/account', '_self');
  }
  myaccounticonActive.addEventListener('click', e => {
    e.stopPropagation();
    redirectToAccountPageDashborad();
  });
  myaccounticon.addEventListener('click', e => {
    e.stopPropagation();
    redirectToAccountPage();
  });
}