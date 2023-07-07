const express = require('express');
const hbs = require('hbs');
const fetch = require('node-fetch');

const app = express();
app.set("view engine", "hbs")

const port = 3000;

app.get('/home', (req, res) => {
    // Створити папку views і в ній створити файл main.hbs
    res.render('main')
})

app.get('/weather(/:city?)', async (req, res) => {
    let city = req.params.city;
    let key = 'b5018676b6c9e7d01aa7056fd2b9186d';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
    let response = await fetch(url);
    let weather = await response.json();
    if (city)
    {
        res.render(`weather`, {city, weather});
    }
    else
    {
        res.redirect("/weather/Zhytomyr");
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})