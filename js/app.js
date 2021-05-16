const select = document.getElementById('breeds');
const card = document.querySelector('.card'); 
const form = document.querySelector('form');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

// Used to parse.json avoids repetition in the code
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => console.log('Looks like there was a problem', error))
}

// Waits for all the promises to complete then do something
Promise.all([
    fetchData(`https://dog.ceo/api/breeds/list`),
    fetchData(`https://dog.ceo/api/breeds/image/random`)
])
    .then(data => {
      const breedList = data[0].message;
      const randomImage = data[1].message;

      generateOptions(breedList);
      generateImage(randomImage);
    }); // Returns both fetch objects

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

// data.map is used to return an array for the <option> elements
function generateOptions(data) {
    const options = data.map(item => `
        <option value='${item}'>${item}</option>
    `).join('');
    select.innerHTML = options;
}

function generateImage(data) {
     const html = `
     <img src="${data}" alt>
     <p>Click to view images of ${select.value}s</p>
     `;
     card.innerHTML = html;
}

function fetchBreedImage() {
    const breed = select.value;
    const img = card.querySelector('img');
    const p = card.querySelector('p');

    fetchData(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(data => {
            img.src = data.message;
            img.alt = breed;
            p.textContent = `Click to view more ${breed}s`;
    });
}


// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
select.addEventListener('change', fetchBreedImage);
card.addEventListener('click', fetchBreedImage);
form.addEventListener('submit', postData);


// ------------------------------------------
//  POST DATA
// ------------------------------------------

function postData(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, comment}) // convert js object or value to json string
    }

    // 2nd fetch param = http method
    fetch('https://jsonplaceholder.typicode.com/comments', config)
        .then(checkStatus)// Response ok?
        .then(res => res.json())
        .then(data => console.log(data))
}
