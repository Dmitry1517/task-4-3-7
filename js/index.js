
class GitHubRepositories {
  constructor() {
    this.formElement = document.createElement('form');
    this.formElement.classList.add("form")

    this.searchInput = document.createElement('input');
    this.searchInput.classList.add("form__input")
    this.searchInput.type = 'text';

    this.formElement.appendChild(this.searchInput);
    
    this.dropdown = document.createElement('ul');
    this.dropdown.classList.add('dropdown');

    this.repositoriesList = document.createElement('ul');
    this.repositoriesList.classList.add('repositories');

    this.searchInput.addEventListener('keyup', this.debounce(this.searchRepositories.bind(this), 600));

    const content = document.querySelector(".content");
    content.appendChild(this.formElement);
    content.appendChild(this.dropdown);
    content.appendChild(this.repositoriesList);
  }

  debounce(fn, debounceTime) {
    let timeout;
    return function () {
      const fnCall = () => fn.apply(this, arguments);
      clearTimeout(timeout)
      timeout = setTimeout(fnCall, debounceTime)
    }
  };

  searchRepositories() {
    if (this.searchInput.value.length > 0) {
      fetch(`https://api.github.com/search/repositories?q=${this.searchInput.value}`)  
        .then(response => response.json())
        .then(data => this.renderDropdown(data.items))
        .catch(error => console.log(error))

    } else this.clearDropdown();
  }

  renderDropdown(items) {
    this.clearDropdown();

    items.slice(0, 5).forEach(item => {
      const li = document.createElement('li');
      li.classList.add("dropdown__item")
      li.textContent = item.full_name;
      li.addEventListener('click', () => {
        this.addRepository(item);
        this.clearDropdown();
        this.searchInput.value = '';
      });
      this.dropdown.appendChild(li);
    });
  }

  clearDropdown() {
    this.dropdown.innerHTML = '';
  }

  addRepository(repository) {
    const li = document.createElement('li');
    li.classList.add("repositories__item");

    const left = document.createElement('div');
    left.classList.add("repositories__left");

    const name = document.createElement('span');
    name.textContent = "Name: " + repository.name;

    const owner = document.createElement('span');
    owner.textContent = "Owner: " + repository.owner.login;

    const stars = document.createElement('span');
    stars.textContent = "Stars: " + repository.stargazers_count;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add("button");

    const image = document.createElement("img");
    deleteButton.appendChild(image)
    image.src = "./img/close-42x42.png";

    deleteButton.addEventListener('click', () => {
      this.repositoriesList.removeChild(li);
    });


    li.appendChild(left);
    left.appendChild(name);
    left.appendChild(owner);
    left.appendChild(stars);
    li.appendChild(deleteButton);
    this.repositoriesList.appendChild(li);
  }
}

const app = new GitHubRepositories();

