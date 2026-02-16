/* STAP 1 */ 
// Maak een .json bestand met daarin enkele gegevens (studenten, boeken, films, etc) 
// Zorg dat het een geldige JSON-structuur heeft (zie voorbeeld)


/* STAP 2 */ 
// Maak een javascript-bestand waarin je gebruik maakt van de functie fetch om het JSON-bestand in te lezen
// Log met behulp van een loop de gegevens in het bestand naar de console (tip: forEach)

// fetch('data.json')
//   .then(response => response.json()) 
//   .then(data => {
//     console.log('Alle data:', data);

//     // for (let student of data.studenten) {
//     //   console.log(student.naam);
//     // }
//     data.studenten.forEach((student => 
//       console.log(student)))
//   });
// werkt!

/* Stap 3 */
// Maak een boilerplate html-bestand die je een <h1> en een lege <ul> heeft // done
// Pas de iteratie met de loop in het script aan zodat er voor elk opgehaald gegeven een nieuwe li in een ul wordt aangemaakt met daarin de data
fetch('data.json')
  .then(response => response.json()) 
  .then(data => {
    console.log('Alle data:', data);
    const ul = document.querySelector('ul');
    // for (let student of data.studenten) {
    //   console.log(student.naam);
    // }
    data.studenten.forEach(student => {
      const li = document.createElement('li');
      li.textContent = student.naam;
      ul.appendChild(li);
      console.log(student);
    });
  });



// TIPS
// const ulElement = document.querySelector('ul')
// data.forEach( item => {} )
// const liElement = document.createElement('li')
// ulElement.appendChild(liElement)