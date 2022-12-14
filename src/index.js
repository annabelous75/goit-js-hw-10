import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countrylist: document.querySelector('.country-list'),
  countryinfo: document.querySelector('.country-info'),
};
refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  e.preventDefault();
  const valueofInput = e.target.value.trim();
  if (valueofInput.length === 0) {
    Notiflix.Notify.warning('You do not enter anything, try one more time');
  }

  fetchCountries(valueofInput)
    .then(onRenderCountries)
    .catch(Notiflix.Notify.failure('Oops, there is no country with that name'));

  if (!valueofInput) {
    refs.countrylist.innerHTML = '';
    refs.countryinfo.innerHTML = '';
    return;
  }
  refs.input.removeEventListener('input', e);
}

function onRenderCountries(countries) {
  const numberofCountry = countries.length;
  const markupname = countries
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li class="country"><img src="${svg}" alt="Flag of ${official}"/><h1>${official}</h1></li>`
    )
    .join('');
  refs.countrylist.innerHTML = markupname;

  if (numberofCountry === 1) {
    const bigPhoto = document.querySelector('.country');
    bigPhoto.classList.add('big-img');
    const markupinfo = countries
      .map(
        ({
          capital,
          population,
          languages,
        }) => `<p><b>Capital: </b> ${capital}</p>
      <p><b>Population: </b> ${population}</p>
        <p><b>Languages: </b> ${Object.values(languages)} </p>`
      )
      .join('');
    refs.countryinfo.innerHTML = markupinfo;
    return;
  }

  if (numberofCountry > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  refs.countryinfo.innerHTML = '';
}
