const express = require('express');
const fs = require('fs');
const app = express();
const port = 4000;

const session = require('express-session');

app.use(session({
  secret: 'redbullgeeftjevleugels', // willekeurige lange zin
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Zet op true als je https gebruikt, maar op localhost is false prima
    maxAge: 3600000 // Hoe lang de cookie geldig is (1 uur)
  }
}));

app.use(express.urlencoded({ extended: true })); // deze moet ook blijkbaar

app.use(express.static("static"));

app.set('view engine', 'ejs');
app.set('views', './views');


/////// green vanwege mongo db test:
const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config();

// 1. Maak de variabele hier globaal aan
let usersCollection;
let moviesCollection;

// 2. Je client configuratie (die moet blijven staan!)
const uri = process.env.URI; 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("sample_mflix");
    
    // 3. CRUCIAAL: Haal hier 'const' of 'let' weg!
    // We vullen nu de variabelen die we bij stap 1 hebben gemaakt.
    moviesCollection = db.collection("movies");
    usersCollection = db.collection("users"); 

    console.log("Database verbinding succesvol!");
  } catch (error) {
    console.error("Verbindingsfout:", error);
  }
}

run().catch(console.dir);

// async function listAllMovies(req, res) { // oude versie, de nieuwe stopt na 200 films om de pagina sneller te laden.
//     try {
//         // Gebruik de globale moviesCollection
//         const data = await moviesCollection.find().toArray();
//         res.render('list.ejs', { data: data });
//     } catch (error) {
//         console.error("Fout bij ophalen movies:", error);
//         res.status(500).send("Fout bij ophalen data uit database.");
//     }
// }
async function listAllMovies(req, res) {
  try {
      // standaar pagina is 0
      const perPage = 100;
      const page = parseInt(req.query.page) || 0; 

      // Haal de data op met limit en skip
      // skip(100) slaat de eerste 100 over, limit(100) pakt de volgende 100
      const data = await moviesCollection.find()
          .skip(page * perPage)
          .limit(perPage)
          .toArray();
      
      // Geef de huidige pagina mee aan ejs om het "zie meer" linkje te maken
      res.render('list.ejs', { 
          data: data, 
          nextPage: page + 1 
      });
  } catch (error) {
      console.error("Fout bij ophalen movies:", error);
      res.status(500).send("Fout bij laden films");
  }
}

app.get('/movies', listAllMovies);

// // ////////////////// STATIC // ////////////////// 
app.get('/', (req, res) => {
  res.render('index')
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

// De "Voordeur": Hier kan de gebruiker naartoe surfen
app.get('/add', (req, res) => {
  res.render('add-movie.ejs'); // Zorg dat dit bestand in je /views map staat
});

app.post('/add-movie', async (req, res) => {
  try {
      // De data uit het formulier zit in req.body
      const newMovie = {
          title: req.body.title,
          runtime: Number(req.body.runtime), // Zet om naar een getal
          addedAt: new Date()
      };

      // Voeg toe aan de collectie (we gebruiken de variabele van de vorige stap)
      await moviesCollection.insertOne(newMovie);

      console.log("Film toegevoegd!");
      res.redirect('/movies'); // Stuur de gebruiker terug naar de lijst
  } catch (err) {
      console.error("Fout bij opslaan:", err);
      res.status(500).send("Kon de film niet opslaan.");
  }
});

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

// Deze functie checkt of ik ingelogd ben
function checkInlog(req, res, next) {
  if (req.session.username) {
    next(); // ga maar door naar de volgende stap
  } else {
    res.redirect('/login'); // Terug naar de login pagina
  }
}

// nu kan je alleen hierheen door eerst in te loggen
app.get('/studenten', checkInlog, (req, res) => {
    const studentenLijst = [
    { naam: 'Alice', specialisatie: 'Frontend' },
    { naam: 'Bob', specialisatie: 'Backend' }
  ];  
    res.render('studenten', { 
      user: req.session.username,
      studenten: studentenLijst
       });
    
});

// app.get('/studenten', (req, res) => { // zo was die toegangkelijk zonder in te loggen
//   const studentenLijst = [
//       { naam: 'Alice', specialisatie: 'Frontend' },
//       { naam: 'Bob', specialisatie: 'Backend' }
//   ];
//   // om de ejs pagina te laten zien right?
//   res.render('studenten', { studenten: studentenLijst });
// });

// /////// INLOGGEN: // //////// 
app.get('/login', (req, res) => {
  res.render('inloggen')});

  // app.post('/login', async (req, res) => { // oude versie, niet secure
  //   try {
  //     const { username, password } = req.body;
  
  //     // Zoek een document waar zowel de naam ALS het wachtwoord kloppen
  //     const user = await usersCollection.findOne({ 
  //       name: username, 
  //       password: password 
  //     });
  
  //     if (user) {
  //       console.log('Inloggen gelukt voor:', username);
  //       res.redirect('/studenten');
  //     } else {
  //       res.send('Oeps! Onjuiste gegevens. <a href="/login">Nog een keer?</a>');
  //     }
  //   } catch (err) {
  //     res.status(500).send("Database fout tijdens inloggen.");
  //   }
  // });
  
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await usersCollection.findOne({ name: username, password: password });
  
      if (user) {
        // sessie-cookie aanmaken
        req.session.userId = user._id; 
        req.session.username = user.name;

        console.log('Sessie aangemaakt voor:', req.session.username);
        res.redirect('/studenten');
      } else {
        res.send('Onjuist wachtwoord of naam.');
      }
    } catch (err) {
      res.status(500).send("Fout tijdens inloggen.");
    }
  });
// /////// REGISTREREN: // //////// 
app.get('/register', (req, res) => {
  res.render('register'); 
});

// app.post('/register', (req, res) => { // toegegeven dit is met hulp van chat, maar het werkt!
//   const { username, password } = req.body;
//   const data = JSON.parse(fs.readFileSync('users.json'));
//   const bestaatAl = data.users.find(u => u.name === username);
//   if (bestaatAl) {
//       return res.send('Deze gebruikersnaam bestaat al! <a href="/register">Probeer opnieuw</a>');
//   }
//   data.users.push({ name: username, password: password });
//   fs.writeFileSync('users.json', JSON.stringify(data, null, 2));
//   console.log('Nieuw account aangemaakt:', username);
//   res.redirect('/login');
// });

app.post('/register', async (req, res) => {
  try {
    // Haal email en age ook uit het formulier
    const { username, email, age, password } = req.body;

    const userExists = await usersCollection.findOne({ name: username });
    if (userExists) {
      return res.send('Deze naam is al bezet.');
    }

    const newUser = {
      name: username,
      email: email,             // Wordt opgeslagen als tekst
      age: Number(age),         // Zet het om naar een getal voor berekeningen later
      password: password, 
      createdAt: new Date()
    };

    await usersCollection.insertOne(newUser);
    
    console.log('Nieuwe user incl. email en leeftijd opgeslagen:', username);
    res.redirect('/login');

  } catch (err) {
    console.error("Fout bij registreren:", err);
    res.status(500).send("Er ging iets mis.");
  }
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

////////////////// PORT LISTEN // ////////////////// 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});