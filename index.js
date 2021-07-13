const express = require('express')
const app = express()
const PORT = 50007

const keygen = require('keygenerator')
const fs = require('fs')

const items = JSON.parse(fs.readFileSync(__dirname + '/files/products.json'))

app.set('view engine', 'ejs')
app.set('views', 'files/pages')

app.use("/public", express.static("public"));
app.use('/favicon.ico', express.static('public/favicon.ico'))

app.get('/download/:id', async (req, res) => {

    // store all downloads in a json file and call it if needed
    const uploads = JSON.parse(await fs.readFileSync(__dirname + '/files/uploads/uploads.json'))

    // filter for all things
    if(!uploads[req.params.id]) {
        res.status(404).end()
        return
    }

    // download the file which is probably existing now
    res.status(200).download(__dirname + '/files/uploads/' + uploads[req.params.id])
})

app.get('/preise', (req, res) => {

    let total = 0
    items.forEach((item) => total += item.prize)
    const cost = total / 26

    res.render('prize-list', {
        product: req.query.product,
        prize: req.query.prize,
        items: items,
        cost: cost.toFixed(2),
        total: total.toFixed(2),
        error: req.query.error
    })
})

app.get('/addItem', (req, res) => {
    if(!(req.query.prize * 1)) {
        res.redirect('/preise?error=' + 1)
        return
    }
    items.splice(0, 0, { product: req.query.product,  prize: req.query.prize * 1})
    fs.writeFileSync(__dirname + '/files/products.json', JSON.stringify(items))
    res.redirect('/preise?product=' + req.query.product + '&prize=' + req.query.prize)
})

app.get('/:id', async (req, res) => {

    const uploads = JSON.parse(await fs.readFileSync(__dirname + '/files/uploads/uploads.json'))
    if(!uploads[req.params.id]) {
        res.status(404).end()
        return
    }
    const stats = fs.statSync(__dirname + '/files/uploads/' + uploads[req.params.id])

    res.render('landing', {
        info: uploads[req.params.id] + ' - ' + (stats.size / 1000000).toFixed(2) + ' mb',
        id: req.params.id
    })
})

app.listen(PORT, () => {
    console.log(`Server now running on Port ${PORT}... `)
})
