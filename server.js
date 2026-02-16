const express = require('express');
const fs = require('fs');
const app = express();
const port = 4000;
app.use(express.urlencoded({ extended: true })); // deze moet ook blijkbaar

app.use(express.static("static"));

app.set('view engine', 'ejs');


/////// green vanwege mongo db test:
const { MongoClient, ServerApiVersion } = require("mongodb");

// Replace the placeholder with your Atlas connection string
const uri = "URI";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

async function run() {
  try {
    
    // Get the database and collection on which to run the operation
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");
    // Query for movies that have a runtime less than 15 minutes
    const query = { runtime: { $lt: 15 } };
    const sortFields = { title: 1 };
    const projectFields = { _id: 0, title: 1, imdb: 1 };
    // Execute query 
    const cursor = movies.find(query).sort(sortFields).project(projectFields);
    // Print a message if no documents were found
    if ((await movies.countDocuments(query)) === 0) {
      console.log("No documents found!");
    }
    // Print returned documents
    for await (const doc of cursor) {
      console.dir(doc);
    }
  } finally {
    await client.close();
  }
}
run().catch(console.dir);





// // ////////////////// STATIC // ////////////////// 
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

// // app.post('/hallo', (req, res) => {
// //   console.log(filmdata);
// //   res.send('Hier moet je de filmdata te zien krijgen.')
// // })
// // app.get('/hallo', (req, res) => {
// //   res.render('filmform');
// //   console.log('werkt dit?')
// // });

// // ////////////////// PAGINA'S // ////////////////// 

// app.get('/film', (req, res) => {
//   console.log('GET route wordt aangeroepen - we gaan de pagina renderen');
//   res.render('filmform', { // Je moet blijkbaar de data meegeven, anders crasht ejs of doet hij niets..
//     films: filmdata 
//   });
// });

// app.post('/film', (req, res) => {
//   const nieuweFilm = {
//     ftitel: req.body.ftitel,
//     fcontext: req.body.fcontext
//   };
//   filmdata.push(nieuweFilm);
//   console.log('Data ontvangen:', nieuweFilm);
//   res.redirect('/film'); 
// });

// app.get('/about', (req, res) => {
//   res.send('Dit is de over ons pagina van de matching-app.')
// });

// // app.get('/login', (req, res) => {
// //   res.send('Hier kun je straks inloggen.')
// // });

// app.get('/data', (req, res) => {
//   res.send('Hier kan je straks data api zien')
// });

// app.get('/studenten', (req, res) => {
//   const studentenLijst = [
//       { naam: 'Alice', specialisatie: 'Frontend' },
//       { naam: 'Bob', specialisatie: 'Backend' }
//   ];
//   // om de ejs pagina te laten zien right?
//   res.render('studenten', { studenten: studentenLijst });
// });

// // /////// INLOGGEN: // //////// 
// app.get('/login', (req, res) => {
//   console.log('we gaan de pagina renderen');
//   res.render('inloggen')});

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
  
//   const data = JSON.parse(fs.readFileSync('users.json', 'utf8'));
//   const users = data.users;

//   // Zoek de gebruiker, 3x = want alles moet gelijk zijn
//   const myUser = users.find(u => u.name === username && u.password === password);

//   if (myUser) {
//     console.log('Succesvol ingelogd:', username);
//     res.redirect('/studenten');
//   } else {
//     console.log('Inloggen mislukt');
//     res.send('Ongeldige gebruikersnaam of wachtwoord. <a href="/login">Probeer opnieuw</a>');
//   }
// });

// // /////// REGISTREREN: // //////// 
// app.get('/register', (req, res) => {
//   res.render('register'); 
// });

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


// // ////////////////// DATA SETS // ////////////////// 
// const filmdata = [
//   { ftitel: 'avatar', fcontext: 'blauwe guys in een bos' },
//   { ftitel: 'cars2', fcontext: 'een ingewikkelde spy thriller over de olie industrie en hoe giganten en rijke mensen meer invloed en macht hebben dan je denkt.. + plus een f1 auto' }
// ];
// // de tijdelijke data set

// // user data set?
// // const userdata = [
// //   { name: "daddynoah", password: "wachtwoord" },
// //   { name: "wariowietse", password: "wachtwoord01"}
// // ];

// ////////////////// PORT LISTEN // ////////////////// 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});