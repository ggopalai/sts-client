const endpoint = 'https://kastner.1921682.xyz/api';
const preregDiv = document.getElementById('prereg');
const postregDiv = document.getElementById('postreg');
const lockBtn = document.getElementById('lock-btn');
const unlockBtn = document.getElementById('unlock-btn');
const regBtn = document.getElementById('reg-btn');
const displayStatus = document.getElementById('display-status');

var state;
// State is 0 if unlocked, 1 if locked
if ('state' in localStorage) {
    state = JSON.parse(localStorage.getItem('state'));
    console.log('State:', state);
} else {
    localStorage.setItem('state', 0);
    state = 0;
}

// chose what to display based on whether email exists in local storage
if ('email' in localStorage) {
    console.log('Email found in local storage')
    
    let email = localStorage.getItem('email');
    console.log('Email:', email);
    preregDiv.style.display = 'none';
    postregDiv.style.display = 'block';

    // chose button display
    if (state === 0) {
        lockBtn.style.display = 'inline-block';
        unlockBtn.style.display = 'none';
    } else {
        lockBtn.style.display = 'none';
        unlockBtn.style.display = 'inline-block';
    }
} else {
    // Email doesn't exist in local storage
    console.log('Email not found in local storage');
    preregDiv.style.display = 'block';
    postregDiv.style.display = 'none';
}

// event listener for register button
regBtn.addEventListener('click', function() {
    let emailInput = document.getElementById('email-input');
    let email = emailInput.value;
    console.log('Email:', email);
    localStorage.setItem('email', email);

    // make post call to node server
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email" : email })
    }).then(response => {
        console.log('Response:', response);
        return response.json();
    }).then(data => {
        console.log('Data:', data);
    }).catch(error => {
        console.log('Error:', error);
    });


    preregDiv.style.display = 'none';
    postregDiv.style.display = 'block';
    if (state === 0) {
        lockBtn.style.display = 'inline-block';
        unlockBtn.style.display = 'none';
    } else {
        lockBtn.style.display = 'none';
        unlockBtn.style.display = 'inline-block';
    }
});


// event listener for lock button
lockBtn.addEventListener('click', () => {
    console.log('Locking...');
    localStorage.setItem('state', 1);
    lockBtn.style.display = 'none';
    unlockBtn.style.display = 'inline-block';

    // make put call to node server using fetch
    fetch(endpoint + '/' + localStorage.getItem('email'), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state : true })
    }).then(response => {
        console.log('Response:', response);
        return response.json();
    }).then(data => {
        console.log('Data:', data);
    }).catch(error => {
        console.log('Error:', error);
    });
});

// event listener for unlock button
unlockBtn.addEventListener('click', () => {
    console.log('Unlocking...');
    localStorage.setItem('state', 0);
    lockBtn.style.display = 'inline-block';
    unlockBtn.style.display = 'none';

    // change state to unlocked on the server
    fetch(endpoint + '/' + localStorage.getItem('email'), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: false })
    }).then(response => {
        console.log('Response:', response);
        return response.json();
    }).then(data => {
        console.log('Data:', data);
    }).catch(error => {
        console.log('Error:', error);
    });
})

// utility, remove after testing
cls = document.getElementById('cls');
cls.addEventListener('click', () => {
    localStorage.clear();
    window.location.reload();
});