let products

(async () => {
    products = await getProducts()

    render(products)
    search()
})()

async function getProducts() {
    let response = await fetch('./product.json')

    return response.json()
}

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
        title.innerText = product.name

        figure.appendChild(img)
        figure.appendChild(book).appendChild(title)
        list.appendChild(figure)
    }
}

function search() {
    let element = document.querySelector('input#search')

    element.addEventListener('input', (event) => {
        result = products.filter(product => {
            return product.name.toUpperCase().includes(element.value.toUpperCase())
        })

        console.log(result)
        render(result)
    })
}