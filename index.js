const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const httpProxy = require("http-proxy");

yargs(hideBin(process.argv)).command(
	"proxy [sessionid]",
	"start the server",
	(yargs) => {
		yargs.positional("sessionid", {
			describe: "sessionid from an Untapped.gg cookie",
			type: "string",
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
		yargs.option("csrftoken", {
			alias: "csrf",
			describe: "CSRF token from an Untapped.gg cookie",
			default: undefined,
		});
	},
	(argv) => {
		proxy({
			sessionId: argv.sessionid,
			port: argv.port,
			service: argv.service,
			csrf: argv.csrftoken,
		});
	}
).argv;

function proxy(opts) {
	const { sessionId, service, port, csrf } = opts;
	const protocol = "https:";
	const target = `api.${service}.untapped.gg`;
	const headers = {
		Cookie: sessionId ? `sessionid=${sessionId}` : "",
		Referer: `https://${service}.untapped.gg/`,
	};
	if (csrf) {
		headers["X-CsrfToken"] = csrf;
		headers.Cookie += `; csrftoken=${csrf}`;
	}
	const server = httpProxy
		.createProxyServer({
			target: {
				protocol: protocol,
				host: target,
				port: 443,
			},
			changeOrigin: true,
			headers,
		})
		.listen(port);

	var enableCors = function (req, res) {
		if (req.headers["access-control-request-method"]) {
			res.setHeader(
				"access-control-allow-methods",
				req.headers["access-control-request-method"]
			);
		}

		if (req.headers["access-control-request-headers"]) {
			res.setHeader(
				"access-control-allow-headers",
				req.headers["access-control-request-headers"]
			);
		}

		if (req.headers.origin) {
			res.setHeader("access-control-allow-origin", req.headers.origin);
			res.setHeader("access-control-allow-credentials", "true");
		}
	};

	// set header for CORS
	server.on("proxyRes", function (proxyRes, req, res) {
		enableCors(req, res);
	});
	console.log(
		`[\u2713] Proxying http://localhost:${port}/ to ${protocol}//${target}/`
	);
	server.on("error", (e) => {
		console.error(e);
	});
}
