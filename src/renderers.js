

export const inputRender = (stateIn) => {
  const input = document.querySelector('#rsslink');
  const button = document.querySelector('#button');
  const info = document.querySelector('#info');
  const mapping = {
    clean: () => {
      input.removeAttribute('disabled');
      input.classList.remove('is-valid', 'is-invalid');
      input.value = '';
      button.setAttribute('disabled', 'disabled');
      info.textContent = null;
    },
    valid: () => {
      input.removeAttribute('disabled');
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      button.removeAttribute('disabled');
      info.textContent = null;
    },
    invalid: () => {
      input.removeAttribute('disabled');
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      button.setAttribute('disabled', 'disabled');
      info.textContent = 'invalid address';
    },
    blocked: () => {
      input.setAttribute('disabled', 'disabled');
      button.setAttribute('disabled', 'disabled');
      info.textContent = 'waiting';
    },
  };
  mapping[stateIn.inputState]();
};


export const infoRender = (stateIn) => {
  const info = document.querySelector('#info');
  info.textContent = stateIn.info;
};


export const feedsRender = (stateIn) => {
  const feedsView = document.querySelector('#feeds');
  feedsView.innerHTML = '';
  const { feeds } = stateIn;
  feeds.forEach((el, index) => {
    const div = document.createElement('div');
    div.classList.add('lead');
    feedsView.appendChild(div);
    div.innerHTML = `<pre>${index + 1}. Title: ${el.title}\n     Description: ${el.description}</pre>`;
  });
};


export const articlesRender = (stateIn) => {
  const articlesView = document.querySelector('#articles');
  articlesView.innerHTML = '';
  const { articles } = stateIn;
  articles.forEach((el, index) => {
    const div = document.createElement('div');
    div.classList.add('lead');
    articlesView.appendChild(div);
    div.innerHTML = `${index + 1}. `;
    div.appendChild(el);
  });
};
