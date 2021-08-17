const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const httpProxy = require("http-proxy");

yargs(hideBin(process.argv)).command(
	"proxy <sessionid>",
	"start the server",
	yargs => {
		yargs.positional("sessionid", {
			describe: "sessionid from an HSReplay.net cookie",
			type: "string"
		});
	},
	argv => {
		proxy({ sessionId: argv.sessionid });
	}
).argv;

function proxy(opts) {
	const { sessionId } = opts;
	const server = httpProxy
		.createProxyServer({
			target: {
				protocol: "https:",
				host: "hsreplay.net",
				port: 443
			},
			changeOrigin: true,
			headers: {
				Cookie: `sessionid=${sessionId}`,
				Referer: 'https://hsreplay.net/',
			}
		})
		.listen(8080);
	server.on("error", (e) => {
		console.error(e);
	});
}
