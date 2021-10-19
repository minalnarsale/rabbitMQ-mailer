const express = require('express');
const bodyParser = require('body-parser');
const sendMail = require('./utility/queues/sendMail');
const PORT = process.env.PORT || 5000;

const app = express();

//middleware: separation of incoming request into req.header, req.body
app.use(bodyParser.urlencoded({ extended: true }));

//middleware: req.body -> Json object conversion
app.use(bodyParser.json());

//middleware: adding logger for each request coming to server
app.use((req, res, next) => {
	console.log(new Date(), req.method, decodeURIComponent(req.url));
	next();
});

if ((process.env.NODE_ENV = 'production')) {
	app.use(express.static('client/build'));
	const path = require('path');
	app.get('*', (req, res) => {
		res.sentFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

// API calls
app.post('/api/sendEmail', (req, res) => sendMail(req, res));

app.listen(PORT, () => console.log(`Listening on port ${process.env.PORT}`));
