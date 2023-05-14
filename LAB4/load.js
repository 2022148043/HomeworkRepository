let products
let result
let sort = 'none'
let categories
let categoryFiltered

(async () => {
    products = await getProducts()
    categoryFiltered = products
    categories = []

    preload(products)
    render(products)

    categoryFilter()
    search()
    sortByPriceEvent()
})()

async function getProducts() {
    let response = await fetch('./product.json')

    return response.json()
}

function preload(products) {
    result = products
    let category_search = document.getElementById('category_search')

    for (let product of products) {
        if (!categories.includes(product.category)) {
            let checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.name = 'category'
            checkbox.class = 'category'
            checkbox.id = 'category_' + product.category
            checkbox.checked = true
            checkbox.value = product.category
            
            let label = document.createElement('label')
            label.setAttribute('for', checkbox.id)
            label.innerText = ' ' + product.category

            category_search.appendChild(checkbox)
            category_search.appendChild(label)
            category_search.appendChild(document.createElement('br'))

            categories.push(product.category)
        }
    }
}

/*
function render(products) {
    let categories = []

    let section = document.querySelector('section')
    section.innerHTML = ''

    for (let product of products) {
        let row, list

        if (categories.includes(product.category)) {
            list = document.querySelector(`div.products_row#${product.category}`)
        } else {
            row = document.createElement('div')
            
            list = document.createElement('div')
            list.classList.add('products_row')
            list.id = product.category
            
            let heading = document.createElement('h2')
            heading.innerText = product.category

            row.appendChild(heading)
            row.appendChild(list)
            section.appendChild(row)

            categories.push(product.category)
        }

        let figure = document.createElement('figure')
        let img = document.createElement('img')
        img.src = 'images/' + product.image
        img.alt = product.name
        img.classList.add('cover')

        let book = document.createElement('span')
        book.classList.add('book_title')

        let title = document.createElement('span')
        title.innerText = product.name + '\n\n' + '$' + product.price.toFixed(2)

        figure.appendChild(img)
        figure.appendChild(book)
        book.appendChild(title)
        list.appendChild(figure)
    }
}
*/

function render(products) {
    let section = document.querySelector('section')
    section.innerHTML = ''

    let list = document.createElement('div')
    list.classList.add('products_row')
    section.appendChild(list)

    for (let product of products) {
        let figure = document.createElement('figure')
        let img = document.createElement('img')
        img.src = 'images/' + product.image
        img.alt = product.name
        img.classList.add('cover')

        let book = document.createElement('span')
        book.classList.add('book_title')

        let title = document.createElement('span')
        title.innerText = product.name + '\n\n' + '$' + product.price.toFixed(2)

        figure.appendChild(img)
        figure.appendChild(book)
        book.appendChild(title)
        list.appendChild(figure)
    }
}

function categoryFilter() {
    let checkboxes = document.getElementsByName('category')
    console.log(products)
    
    for (let category of checkboxes) {
        
        category.addEventListener('change', (event) => {
            let input = document.querySelector('input#search')
            input.value = ''

            if (event.target.checked) {
                let filtered = products.filter(product => product.category == event.target.value)
                
                categoryFiltered.push(...filtered)
            } else {
                categoryFiltered = categoryFiltered.filter(product => product.category != event.target.value)
            }

            console.log(result)

            // categoryFiltered = result
            sortByPrice()
            render(categoryFiltered)
        })
    }
}

function search() {
    let element = document.querySelector('input#search')

    element.addEventListener('input', (event) => {
        filtered = categoryFiltered.filter(product => {
            return product.name.toUpperCase().includes(element.value.toUpperCase())
        })

        render(filtered)
    })
}

function sortByPriceEvent() {
    let elements = document.querySelectorAll('input[type="radio"]')

    for (let element of elements) {
        element.addEventListener('click', (event) => {
            sort = element.value
            sortByPrice()
        })
    }
}

function sortByPrice() {
    if (sort == 'asc') {
        categoryFiltered = categoryFiltered.sort((a, b) => a.price - b.price)
    } else if (sort == 'desc') {
        categoryFiltered = categoryFiltered.sort((a, b) => b.price - a.price)
    } else {
        categoryFiltered = categoryFiltered.sort((a, b) => a.id  - b.id)
    }

    render(categoryFiltered)
}