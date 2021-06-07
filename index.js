const express = require('express')
const app = express()
const PORT = 500007

const keygen = require('keygenerator')
const fs = require('fs')

app.set('view engine', 'ejs')
app.set('views', 'files/pages')

app.use("/public", express.static("public"));

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
