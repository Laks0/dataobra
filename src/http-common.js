import axios from "axios";

export default axios.create({
	baseURL: process.env.VUE_APP_API,
	headers: {
		"Content-type": "application/json",
	},
	withCredentials: true,
});
