// Dependencies =================================
	var Hapi 		= require('hapi'),
		Handlebars	= require('handlebars'),
		config 		= require('./server/config/'),
		db			= require('./server/database'),
		admin_path	= __dirname + '/admin',
		public_path	= __dirname + '/public';

// Initialization code for the App ==============
	var server = new Hapi.Server({
			app: config,
			cache: {
				engine: require('catbox-mongodb'),
				host: '127.0.0.1',
				partition: 'catbox'
			}
		});

	// Template Engines
		server.views({
			engines: {
				html: Handlebars.create()
			},
			allowAbsolutePaths: true,
			relativeTo: './server/views',
			partialsPath: 'partials'
		});

	// TODO: Separate servers by port
		var web = server.connection({
				host: config.env.host,
				port: 8000, // config.port
				labels: ['web','api']
			});

		var admin = server.connection({
				host: config.env.host,
				port: 8001, // config.port
				labels: ['admin']
			});

	// Static file paths
		web.path(public_path + '/assets');
		admin.path(admin_path + '/assets');

	// Bootstrap Hapi Server Plugins, passes the server object to the plugins
		require('./server/plugins')(server);

	// Require the routes and pass the server object.
		require('./server/config/routes')(server);

// Start the server =============================
	server.start(function() {
		//Log to the console the host and port info
		server.log('info', 'Server started at: ' + server.info.uri);
	});
