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
  sellBook: getPage('sell-book'),
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
  const toggle = document.querySelector('.fa-shopping-cart').parentNode;

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

const sellBookActions = () => {
  if(!!pages.sellBook) {
    const show = (elm, msg, form) => {
      elm.style.display = 'block';
      elm.innerText = msg;

      const inputs = form.querySelectorAll('input');
      Array.from(inputs).map(elm => elm.disabled = false);
      form.querySelector('input[type=submit]').value = 'Jual';
    };

    const forms = pages.sellBook.querySelectorAll('form[name=sell-book]');
    const form1 = forms[0];
    const form2 = forms[1];
    const file = form1.querySelector('input[type=file]');

    file.addEventListener('change', () => {
      const img = file.files[0];

      if (!!img) {
        const elm = document.querySelector('img.cover');
        elm.src = window.URL.createObjectURL(img);
      }
    });

    form2.addEventListener('submit', e => {
      e.preventDefault();

      const inputs = form2.querySelectorAll('input');
      Array.from(inputs).map(elm => elm.disabled = true);
      form2.querySelector('input[type=submit]').value = 'Mencoba Jual...';

      const msg = pages.sellBook.querySelector('.alert');
      msg.innerText = '';

      const title = form2.querySelector('input[name=title]').value;
      const price = form2.querySelector('input[name=price]').value;
      const author = form2.querySelector('input[name=author]').value;

      if (or(title.length < 1, price.length < 1, author.length < 1)) {
        show(msg, 'Ada masukan form yang masih kosong.', form2);
      } else {
        if (isNaN(Number(price))) {
          show(msg, 'Masukan Harga bukan angka.', form2);
        } else {
          show(msg, 'Mengalihkan ke proses selanjutnya...', form2);

          Array.from(inputs).map(elm => elm.disabled = true);
          file.disabled = true;

          const label = form1.querySelector('label');
          label.disabled = true;
          label.style.color = '#ababab';
          label.style.cursor = 'default';
          label.style.border = '2px solid #ababab';
        }
      }

      return false;
    })
  }
}

const actions = {
  defaultActions,
  loginActions,
  registerActions,
  sellBookActions,
};

Object.keys(actions).forEach(fn => actions[fn]());
