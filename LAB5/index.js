const express = require('express')
const fs = require('fs')
const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')
const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    const header  = fs.readFileSync('public/header.html', 'utf-8')
    const wrapper = fs.readFileSync('public/wrapper.html', 'utf-8')
    const footer  = fs.readFileSync('public/footer.html', 'utf-8')
    let result = header + wrapper

    let query = ''

    if (req.query.keyword) 
        query = `SELECT * FROM products WHERE product_title LIKE "%${req.query.keyword}%"`
    else if (req.query.category) 
        query = `SELECT * FROM products WHERE product_category = "${req.query.category}"`
    else
        query = `SELECT * FROM products`

    let db = await getDBConn()
    let rows = await db.all(query, req.params.product_id)

    for (let product of rows) {
        let figure =    `<a href="/product/${product.product_id}">
                            <figure>
                                <img src="images/${product.product_image}" alt="${product.product_title}" class="cover">
                                <span class="book_title">
                                    <span>${product.product_title}<br><br>$${product.product_price.toFixed(2)}</span>
                                </span>
                            </figure>
                        </a>`

        result += figure
    }

    result += footer

    res.send(result)
})

app.get('/product/:product_id', async (req, res) => {
    const header  = fs.readFileSync('public/header.html', 'utf-8')
    const wrapper = '<body><h1>Welcome to Yonsei Bookstore!</h1><nav><a href="/">메인</a><a href="login.html">로그인</a><a href="signup.html">회원가입</a></nav><hr><main><section>'
    const footer  = '</section></main></body></html>'
    const comment = JSON.parse(fs.readFileSync('comment.json', 'utf-8'))
    console.log(comment)

    let result = header + wrapper

    let query = `SELECT * FROM products WHERE product_id = ?`
    let db = await getDBConn()
    let rows = await db.all(query, req.params.product_id)
    let product = rows[0]
    
    result +=   `<img src="/images/${product.product_image}" alt="${product.product_title}" class="product_view">`
    result +=   `<div>
                    <p>ID: ${product.product_id}</p>
                    <p>제목: ${product.product_title}</p>
                    <p>가격: $${product.product_price.toFixed(2)}</p>
                    <p>카테고리: ${product.product_category}</p>
                </div><hr>
                <div>
                    <h3>Comments</h3>
                    <ul>`

    let order = 1

    for (let row of comment) {
        if (row.productId == req.params.product_id) {
            if (req.query.n == 1 && order == 1)
                result += `<li>${row.comment} <span class="new_comment">New comment</span></li>`
            else
                result += `<li>${row.comment}</li>`
        }

        order++
    }

    result +=   `   </ul>
                </div>`
                
    result +=   `<div>
                    <form action="/comment" method="post">
                        <input type="text" name="comment" placeholder="Comment" required>
                        <input type="hidden" name="productId" value="${product.product_id}">
                        <input type="submit" value="Submit">
                    </form>
                </div>`


    result += footer

    res.send(result)
})

app.post('/comment', (req, res) => {
    let data = JSON.parse(fs.readFileSync('comment.json', 'utf-8'))
    data.unshift({ productId: req.body.productId, comment: req.body.comment })

    fs.writeFileSync('comment.json', JSON.stringify(data))

    res.redirect('/product/' + req.body.productId + '?n=1')
})

const PORT = 3000

app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT)
})

async function getDBConn() {
    const db = await sqlite.open({
        filename: 'product.db',
        driver:   sqlite3.Database
    })

    return db
}