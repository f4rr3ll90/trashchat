const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3000 });

const sendMsg = (data) => {

	server.clients.forEach( client => {

		if(client.readyState === WebSocket.OPEN) {
			client.send(data);
		}

	});
};

server.on('connection', ws => {
	console.log('connection');

	ws.on('message', data => {
		let msgdata = JSON.parse(data);
		console.log(msgdata.message);
		if (msgdata.message === '/exit') {

			ws.close();

		} else if (msgdata.message === '/sayhi') {

			let sayhi = JSON.stringify ({
				name: 'Бот Валера',
				message: 'Привет всем!!!'
			});
			ws.send(sayhi);

		} else {

			sendMsg(data);

		}
	});
	let wellcome = JSON.stringify ({
		name: 'Бот Валера',
		message: 'Добро пожаловать! Команды чтобы напрячь Валеру => "/sayhi" - Сказать Привет; "/exit" - Покинуть чат;'
	});
	ws.send(wellcome);
});