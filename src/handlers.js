

export const inputHandler = (el, stateIn) => {
  const state = stateIn;
  state.inputValue = el.target.value;
};


export const formHandler = (el, stateIn) => {
  el.preventDefault();
  const state = stateIn;
  state.enterLink = state.inputValue;
};
