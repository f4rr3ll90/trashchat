const status = document.getElementById('status');
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
let name = 'Проходил мимо...';

const ws = new WebSocket('ws://localhost:3000');



function setStatus(value) {
    status.innerHTML = value;
}

function printMessage(value) {
    const li = document.createElement('li');

    li.innerHTML = `<strong>${value.name}:</strong>-${value.message}`;
    messages.appendChild(li);
}

form.addEventListener('submit', event => {
	event.preventDefault();
	console.log(input.value);
	// ws.send(input.value);
	let data = JSON.stringify ({
		name: name,
		message: input.value
	});




	ws.send(data);

	if (input.value === '/name') {
		name = input.value.replace('\/name', '');
		console.log(name);
	}


	input.value = '';
});

ws.onopen = () => setStatus('ONLINE');
ws.onclose = () => setStatus('DISCONNECTED');
ws.onmessage = response => {
	console.log(response);
	let msgdata = JSON.parse(response.data);
	console.log(msgdata);
	// let output = `<strong>${msgdata.name}:</strong>-${msgdata.message}`;
	printMessage(msgdata);
};