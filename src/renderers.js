import $ from 'jquery';


export const inputRender = (stateIn) => {
  const input = document.querySelector('#rsslink');
  const button = document.querySelector('#button');

  const mapping = {
    clean: () => {
      input.removeAttribute('disabled');
      input.classList.remove('is-valid', 'is-invalid');
      input.value = '';
      button.setAttribute('disabled', 'disabled');
    },
    valid: () => {
      input.removeAttribute('disabled');
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      button.removeAttribute('disabled');
    },
    invalid: () => {
      input.removeAttribute('disabled');
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      button.setAttribute('disabled', 'disabled');
    },
    blocked: () => {
      input.setAttribute('disabled', 'disabled');
      button.setAttribute('disabled', 'disabled');
    },
  };

  mapping[stateIn.inputState]();
};


export const infoRender = (stateIn) => {
  const info = document.querySelector('#info');
  info.innerHTML = stateIn.info;
};


export const modalRender = (stateIn) => {
  const mapping = {
    red: 'alert-danger',
    green: 'alert-success',
  };

  $('#exampleModal').modal('show');
  const title = document.querySelector('#exampleModalLabel');
  title.innerHTML = stateIn.modalMessage.title;
  const description = document.querySelector('#mymodal');
  description.innerHTML = '<div class="alert" id="message" role="alert">';
  const textDiv = document.querySelector('#message');
  textDiv.innerHTML = stateIn.modalMessage.description;
  textDiv.classList.add(mapping[stateIn.modalMessage.color]);
};


export const feedsRender = (stateIn) => {
  const feedsView = document.querySelector('#feeds');
  feedsView.innerHTML = '';
  const { feeds } = stateIn;

  feeds.forEach((el, index) => {
    const div = document.createElement('div');
    div.classList.add('lead');
    div.innerHTML = `<pre>${index + 1}. Title: ${el.title}\n     Description: ${el.description}</pre>`;
    feedsView.appendChild(div);
  });
};


export const articlesRender = (stateIn) => {
  const articlesView = document.querySelector('#articles');
  articlesView.innerHTML = '';
  const { articles } = stateIn;

  articles.forEach((el, index) => {
    const div = document.createElement('div');
    articlesView.appendChild(div);
    div.classList.add('lead');
    div.innerHTML = `${index + 1}. `;

    const article = document.createElement('a');
    article.setAttribute('href', el.link);
    article.textContent = `${el.title} `;
    div.appendChild(article);

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('type', 'button');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#exampleModal');
    button.setAttribute('data-whatever', el.description);
    button.textContent = 'Description';
    div.appendChild(button);

    const br = document.createElement('br');
    articlesView.appendChild(br);
  });
};
