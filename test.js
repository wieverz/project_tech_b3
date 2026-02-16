fetch('package.json')
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