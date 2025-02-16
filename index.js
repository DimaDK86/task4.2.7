let output = document.querySelector('.output')

let inputItems = document.querySelector('.input-items')

let value
async function request() {

    fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
    .then(response => {
        console.log(response)
        return response.json()
    })
    .then(posts => {
        inputItems.innerHTML = ''
        console.log(posts.items)
        if (posts.items.length === 0) {
            console.log('НИ ЧЕГО НЕ НАЙДЕНО');
            let itemSearch = document.createElement('div')
            itemSearch.classList.add('item')
            itemSearch.textContent = 'НИ ЧЕГО НЕ НАЙДЕНО'
            inputItems.appendChild(itemSearch)
            loader()
            input.value = ''
        }
        
        
        posts.items.forEach((item, index) => {
            console.log(index + 1, item.name, item.owner.login, item.stargazers_count);
            
            let itemSearch = document.createElement('div')
            itemSearch.classList.add('item', item.name)
            itemSearch.textContent = item.name
            inputItems.appendChild(itemSearch)
            loader()

            
        });
        
        inputItems.addEventListener('click', (event) => {
            // Проверяем, что клик был на элементе с классом 'item'
            if (event.target.classList.contains('item')) {
                const repoName = event.target.textContent;
                const item = posts.items.find(item => item.name === repoName);
                if (item) {
                    console.log('Вы кликнули на:', item.name);
                    
                    let fragment = document.createDocumentFragment();

                    let outputItems = document.createElement('div');
                    outputItems.classList.add('output-items')

                    let items = document.createElement('div');
                    items.classList.add('items')

                    let itemName = document.createElement('div');
                    itemName.classList.add('item-name')
                    itemName.textContent = `Name: ${item.name}`

                    let itemOwner = document.createElement('div');
                    itemOwner.classList.add('item-owner')
                    itemOwner.textContent = `Owner: ${item.owner.login}`

                    let itemStars = document.createElement('div');
                    itemStars.classList.add('item-stars')
                    itemStars.textContent = `Stars: ${item.stargazers_count}`


                    let img = document.createElement('div');
                    img.classList.add('img')

                    output.appendChild(outputItems)
                    outputItems.appendChild(items)
                    items.appendChild(itemName)
                    items.appendChild(itemOwner)
                    items.appendChild(itemStars)

                    outputItems.appendChild(img)

                }

                inputItems.innerHTML = ''
                input.value = ''

            }
        });

    })

    .catch(err => console.log(err))
}

let overlay = document.querySelector('.overlay')
let body = document.querySelector('body')

function loader() {
    overlay.classList.toggle('flex');
    body.classList.toggle('disabled');
}



let debounce = (fn, ms) => {
    let timeout;
    return function () {
        let fnCall = () => {
            loader()
            fn.apply(this, arguments)
            request()
        }
        
        clearTimeout(timeout);
        
        timeout = setTimeout(fnCall, ms)
    }
}

function onChange(e) {
    console.log(e.target.value);
    value = e.target.value;
}

let input = document.querySelector('input');
onChange = debounce(onChange, 3000);
input.addEventListener('keyup', onChange)



output.addEventListener('click', (event) => {

    // Проверяем, что клик был на кнопке с классом 'delete-btn'
    if (event.target.classList.contains('img')) {

      // Находим родительский div, который нужно удалить
        const itemDiv = event.target.closest('.output-items');
      // Если такой div найден, удаляем его
        if (itemDiv) {
        itemDiv.remove(); // Удаляем div из DOM
        console.log('Элемент удален');
    }
    }
});
