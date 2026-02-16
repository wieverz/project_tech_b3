const express = require('express');
const fs = require('fs');
const app = express();
const port = 4000;
app.use(express.urlencoded({ extended: true })); // deze moet ook blijkbaar

app.use(express.static("static"));

app.set('view engine', 'ejs');

// ////////////////// STATIC // ////////////////// 
app.get('/', (req, res) => {
  res.send('Hello World!')
});

// app.post('/hallo', (req, res) => {
//   console.log(filmdata);
//   res.send('Hier moet je de filmdata te zien krijgen.')
// })
// app.get('/hallo', (req, res) => {
//   res.render('filmform');
//   console.log('werkt dit?')
// });

// ////////////////// PAGINA'S // ////////////////// 

app.get('/film', (req, res) => {
  console.log('GET route wordt aangeroepen - we gaan de pagina renderen');
  res.render('filmform', { // Je moet blijkbaar de data meegeven, anders crasht ejs of doet hij niets..
    films: filmdata 
  });
});

app.post('/film', (req, res) => {
  const nieuweFilm = {
    ftitel: req.body.ftitel,
    fcontext: req.body.fcontext
  };
  filmdata.push(nieuweFilm);
  console.log('Data ontvangen:', nieuweFilm);
  res.redirect('/film'); 
});

app.get('/about', (req, res) => {
  res.send('Dit is de over ons pagina van de matching-app.')
});

// app.get('/login', (req, res) => {
//   res.send('Hier kun je straks inloggen.')
// });

app.get('/data', (req, res) => {
  res.send('Hier kan je straks data api zien')
});

app.get('/studenten', (req, res) => {
  const studentenLijst = [
      { naam: 'Alice', specialisatie: 'Frontend' },
      { naam: 'Bob', specialisatie: 'Backend' }
  ];
  // om de ejs pagina te laten zien right?
  res.render('studenten', { studenten: studentenLijst });
});

// /////// INLOGGEN: // //////// 
app.get('/login', (req, res) => {
  console.log('we gaan de pagina renderen');
  res.render('inloggen')});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const data = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  const users = data.users;

  // Zoek de gebruiker, 3x = want alles moet gelijk zijn
  const myUser = users.find(u => u.name === username && u.password === password);

  if (myUser) {
    console.log('Succesvol ingelogd:', username);
    res.redirect('/studenten');
  } else {
    console.log('Inloggen mislukt');
    res.send('Ongeldige gebruikersnaam of wachtwoord. <a href="/login">Probeer opnieuw</a>');
  }
});

// /////// REGISTREREN: // //////// 
app.get('/register', (req, res) => {
  res.render('register'); 
});

app.post('/register', (req, res) => { // toegegeven dit is met hulp van chat, maar het werkt!
  const { username, password } = req.body;
  const data = JSON.parse(fs.readFileSync('users.json'));
  const bestaatAl = data.users.find(u => u.name === username);
  if (bestaatAl) {
      return res.send('Deze gebruikersnaam bestaat al! <a href="/register">Probeer opnieuw</a>');
  }
  data.users.push({ name: username, password: password });
  fs.writeFileSync('users.json', JSON.stringify(data, null, 2));
  console.log('Nieuw account aangemaakt:', username);
  res.redirect('/login');
});


// ////////////////// DATA SETS // ////////////////// 
const filmdata = [
  { ftitel: 'avatar', fcontext: 'blauwe guys in een bos' },
  { ftitel: 'cars2', fcontext: 'een ingewikkelde spy thriller over de olie industrie en hoe giganten en rijke mensen meer invloed en macht hebben dan je denkt.. + plus een f1 auto' }
];
// de tijdelijke data set

// user data set?
// const userdata = [
//   { name: "daddynoah", password: "wachtwoord" },
//   { name: "wariowietse", password: "wachtwoord01"}
// ];

// ////////////////// PORT LISTEN // ////////////////// 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});