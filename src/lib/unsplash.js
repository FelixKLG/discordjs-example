const axios = require("axios");

const unsplash = axios.create({
	baseURL: "https://api.unsplash.com/",
	headers: {
		Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
	}
});

module.exports = unsplash;
