/*! Bukube Application
 * @author      Bukube Development Team
 * @copyright   Bukube Development Team, 2018
 */

const getPage = name => {
  const elm = document.getElementsByClassName(name +'-page');

  return !!elm ? elm[0] : null;
};

const pages = {
  home: getPage('home'),
  login: getPage('login'),
  register: getPage('register'),
};

const getJSON = url => {
  const req = new XMLHttpRequest();
  req.open('GET', url, false);
  req.send(null);

  const ret = req.responseText;
  let json = null;

  try {
    json = JSON.parse(ret);
  } catch (e) {
    console.error(e);
  }

  return json;
};

const loginActions = () => {
  if (!!pages.login) {
    const show = (elm, msg, form) => {
      elm.style.display = 'block';
      elm.innerText = msg;

      const inputs = form.querySelectorAll('input');
      Array.from(inputs).map(elm => elm.disabled = false);
      form.querySelector('input[type=submit]').value = 'Masuk';
    };

    const form = pages.login.querySelector('form');

    form.addEventListener('submit', e => {
      e.preventDefault();

      const inputs = form.querySelectorAll('input');
      Array.from(inputs).map(elm => elm.disabled = true);
      form.querySelector('input[type=submit]').value = 'Mencoba Masuk...';

      const msg = pages.login.querySelector('.alert');
      msg.innerText = '';

      const users = getJSON('/json/users.json');
      if (!!users) {
        const identifier = form.querySelector('input[name=identifier]').value;
        const password = form.querySelector('input[name=password]').value;

        if (identifier.length < 1 || password.length < 1) {
          show(msg, 'Ada masukan form yang masih kosong.', form);
        } else {
          const user = users
            .filter(user =>
              user.username === identifier || user.email === identifier
            );

          if (user.length > 0 && user[0].password === password) {
            show(msg, 'Mengalihkan ke halaman utama...', form);
          } else {
            show(msg, 'Informasi login salah.', form);
          }
        }
      } else {
        show(msg, 'Terjadi kesalahan saat mengambil data dari server.', form);
      }

      return false;
    });
  }
};

const registerActions = () => {
  if (!!pages.register) {
    const show = (elm, msg, form) => {
      elm.style.display = 'block';
      elm.innerText = msg;

      const inputs = form.querySelectorAll('input');
      Array.from(inputs).map(elm => elm.disabled = false);
      form.querySelector('input[type=submit]').value = 'Masuk';
    };

    const form = pages.register.querySelector('form');

    form.addEventListener('submit', e => {
      e.preventDefault();

      const inputs = form.querySelectorAll('input');
      Array.from(inputs).map(elm => elm.disabled = true);
      form.querySelector('input[type=submit]').value = 'Mencoba Registrasi...';

      const msg = pages.login.querySelector('.alert');
      msg.innerText = '';

      // const users = getJSON('/json/users.json');
      /*if (!!users) {
        const identifier = form.querySelector('input[name=identifier]').value;
        const password = form.querySelector('input[name=password]').value;

        if (identifier.length < 1 || password.length < 1) {
          show(msg, 'Ada masukan form yang masih kosong.', form);
        } else {
          const user = users
            .filter(user =>
              user.username === identifier || user.email === identifier
            );

          if (user.length > 0 && user[0].password === password) {
            show(msg, 'Mengalihkan ke halaman utama...', form);
          } else {
            show(msg, 'Informasi login salah.', form);
          }
        }
      } else {
        show(msg, 'Terjadi kesalahan saat mengambil data dari server.', form);
      }*/

      return false;
    });
  }
};

const actions = {
  loginActions,
  registerActions,
};

Object.keys(actions).forEach(fn => actions[fn]());
