const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const httpProxy = require("http-proxy");

yargs(hideBin(process.argv)).command(
	"proxy <sessionid>",
	"start the server",
	yargs => {
		yargs.positional("sessionid", {
			describe: "sessionid from an Untapped.gg cookie",
			type: "string"
		});
		yargs.option("port", {
			describe: "port to listen on",
			type: "number",
			default: 8080,
		});
		yargs.option("service", {
			alias: "s",
			describe: "Untapped.gg service to proxy",
			default: "mtga",
		});
	},
	argv => {
		proxy({ sessionId: argv.sessionid, port: argv.port, service: argv.service });
	}
).argv;

function proxy(opts) {
	const { sessionId, service, port } = opts;
	const protocol = "https:";
	const target = `api.${service}.untapped.gg`;
	const server = httpProxy
		.createProxyServer({
			target: {
				protocol: protocol,
				host: target,
				port: 443
			},
			changeOrigin: true,
			headers: {
				Cookie: `sessionid=${sessionId}`,
				Referer: `https://${service}.untapped.gg/`,
			}
		})
		.listen(port);
	console.log(`[\u2713] Proxying http://localhost:${port}/ to ${protocol}//${target}/`);
	server.on("error", (e) => {
		console.error(e);
	});
}
