/*! Bukube Application
 * @author      Bukube Development Team
 * @copyright   Bukube Development Team, 2018
 */

const eq = (p, q) => p === q;

const or = (...conds) =>
  conds.length < 1
    ? false
    : !!conds[0]
      ? true
      : or(...conds.slice(1));

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

const defaultActions = () => {
  const carts = document.querySelector('.carts');
  const toggle = document.querySelector('.fa-shopping-cart');

  toggle.addEventListener('click', e => {
    e.preventDefault()

    carts.style.display = carts.style.display === 'block' ? 'none' : 'block';

    return false;
  });
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

        if (or(identifier.length < 1, password.length < 1)) {
          show(msg, 'Ada masukan form yang masih kosong.', form);
        } else {
          const user = users
            .filter(user =>
              or(user.username === identifier, user.email === identifier)
            );

          if (user.length > 0 && user[0].password === password) {
            show(msg, 'Mengalihkan ke halaman utama...', form);

            Array.from(inputs).map(elm => elm.disabled = true);
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

      const msg = pages.register.querySelector('.alert');
      msg.innerText = '';

      const users = getJSON('/json/users.json');
      if (!!users) {
        const email = form.querySelector('input[name=email]').value;
        const username = form.querySelector('input[name=username]').value;
        const fullname = form.querySelector('input[name=fullname]').value;
        const password = form.querySelector('input[name=password]').value;

        const conds = [
          email.length < 1,
          username.length < 1,
          fullname.length < 1,
          password.length < 1,
        ];

        if (or(...conds)) {
          show(msg, 'Ada masukan form yang masih kosong.', form);
        } else {
          const user = users
            .filter(user =>
              user.username === username || user.email === email
            );

            if (user.filter(x => x.username === username).length > 0) {
              show(msg, 'Nama Pengguna tidak tersedia.', form);
            } else if (user.filter(x => x.email === email).length > 0) {
              show(msg, 'Alamat Email sudah digunakan.', form);
            } else {
              if (fullname.length < 3) {
                show(msg, 'Panjang Nama Lengkap minimal tiga huruf.', form);
              } else if (password.length < 5) {
                show(msg, 'Panjang Kata Kunci minimal lima karakter.', form);
              } else {
                show(
                  msg,
                  'Akun didaftarkan. Mengalihkan ke halaman akun...',
                  form,
                );

                Array.from(inputs).map(elm => elm.disabled = true);
              }
            }
        }
      } else {
        show(msg, 'Terjadi kesalahan saat mengambil data dari server.', form);
      }

      return false;
    });
  }
};

const actions = {
  defaultActions,
  loginActions,
  registerActions,
};

Object.keys(actions).forEach(fn => actions[fn]());
