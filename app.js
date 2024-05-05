// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 2303;                 // Set a port number at the top so it's easy to change in the future
// Database
const fetch = require('isomorphic-fetch')
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs",
    helpers: {
        stripHTML: function (html) {
            return html.replace(/<[^>]*>/g, '');
        }
    }
}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
const LISTEN_NOTES_API_KEY = '9cc85c7197be4ca596f9bfc2ec054c2e'
const FREESOUND_API_KEY = 'EJS8ZFp8e2YqCzL1BszzoqF3SwrkFRaUVOgKIjN2'
/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        res.render('signup');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });

app.get('/login', function(req, res)
{
    res.render('login');                    // Note the call to render() and not send(). Using render() ensures the templating engine
}); 

app.get('/homepage', function(req, res)
{
    res.render('homepage');                    // Note the call to render() and not send(). Using render() ensures the templating engine
});

app.get('/podcasts', async function(req, res) {
    try {
        const response = await fetch(`https://listen-api.listennotes.com/api/v2/search?q=child%20development&sort_by_date=0&scope=podcast&offset=0&date_filter=any&language=Any%20language&country=Any%20region&len_min=0&len_max=0&genre_ids=132&age_filter=any&freq_filter=any&ecount_min=0&ecount_max=0`, {
        method: 'GET',    
        headers: {
                'X-ListenAPI-Key': LISTEN_NOTES_API_KEY,
            },
        });
        const data = await response.json();
        res.render('podcasts', { podcasts: data.results });
    } catch (error) {
        console.error('Error fetching podcasts:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/soothing', async function(req, res) {
    try {
        const response = await fetch(`https://freesound.org/apiv2/search/text/?query=soothing&token=${FREESOUND_API_KEY}`, {
        method: 'GET',    
        });
        const data = await response.json();
        const soothingSounds = data.results.map(sound => ({
            id: sound.id,
            name: sound.name,
            license: sound.license,
            username: sound.username,
            soundUrl: `https://freesound.org/apiv2/sounds/${sound.id}/download/`
        }));

        console.log(data);
        res.render('soothing', { soothing: soothingSounds });
    } catch (error) {
        console.error('Error fetching soothing sounds:', error);
        res.status(500).send('Internal server error');
    }
});

app.post('/signup-form', async function (req, res) {
    let data = req.body;

    const userData = {
        username: data['username'],
        password: data['password'],
        fname: data['fname'],
        lname: data['lname'],
        email: data['email'] || null,
        phone: data['phone'] || null
    };

    console.log('Sending user data:', userData);

    try {
        const response = await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const responseData = await response.json();
        console.log(responseData)
        if (responseData.status === 'ok') {
            // Send the success response
            res.send(`
            <script>
                alert('Success! User Created');
                window.location.href = 'login';
            </script>
            `);
        } else {
            // Handle the error response
            console.log(responseData.error);
            res.status(400).send(`
            <script>
                alert('Error creating user. Please try again.');
                window.location.href = '/';
            </script>
            `);
        }
    } catch (error) {
        // Handle fetch or other errors
        console.log(error);
        res.status(500).send(`
            <script>
                alert('Internal server error. Please try again later.');
                window.location.href = '/';
            </script>
        `);
    }
});

app.post('/login', async function (req, res) {
    let data = req.body

    const userData = {
        username: data['username'],
        password: data['password']
    };

    try {
        const response = await fetch('http://localhost:3001/user_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const responseData = await response.json();
        console.log(responseData)
        if (responseData.status === 'ok') {
            // Send the success response
            res.send(`
            <script>
                window.location.href = 'homepage';
            </script>
            `);
        } else {
            // Handle the error response
            console.log(responseData.error);
            res.status(400).send(`
            <script>
                alert('Login incorrect. Please try again.');
                window.location.href = 'login';
            </script>
            `);
        }
    } catch (error) {
        // Handle fetch or other errors
        console.log(error);
        res.status(500).send(`
            <script>
                alert('Internal server error. Please try again later.');
                window.location.href = 'login';
            </script>
        `);
    }
})

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});