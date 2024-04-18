const $ = q => document.querySelector(q);
const $i = i => $('#s' + i);

const formatTime = (str) => {
	console.log(str)
	const s = str.padStart(4, '0').slice(0, 2) + ':' + str.padStart(4, '0').slice(2);
	
	return new Date('Jan 1, 1970 00:' + s).toLocaleTimeString('en-US', { timeStyle: 'medium', hour12: false }).slice(3).replace(':', '');
}

let isCleared = true;
let isRunning = false;

let newTimer;

$('input').addEventListener('focusout', () => {
	$('input').value = formatTime($('input').value);
	updateClockEditor();
});

const start = () => {
	isRunning = true;
	document.body.classList.add('running');
	
	currentInterval = setInterval(() => {
		$('#timer').innerHTML = ''
		if (newTimer) newTimer.innerHTML = ''
		
		const date = new Date(new Date('May 13, 2024 12:00:00 CST').getTime() - Date.now() + 5 * 60 * 60 * 1000);
		
		const timeString = date.toLocaleString('en-US', {
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		}).replace(', ', ':');
		
		for (let chunkPos in timeString.split(':')) {
			let chunk = timeString.split(':')[chunkPos];
			
			if (chunkPos == 1 && chunk == '24')
				chunk = '00'
			
			const without0 = chunk.replace(/^[0:]/g,'')
			
			for (let charPos in chunk) {
				const char = chunk[charPos];
				const isGrey = (chunk.length - without0.length) > charPos;
				
				const className = isGrey ? 'unsure' : '';
				
				$('#timer').innerHTML += `<span class="${className}"}>${char}</span>`
				if (newTimer) newTimer.innerHTML += `<span class="${className}"}>${char}</span>`
			}
			
			const char = ['d ', 'h ', 'm ', 's '][chunkPos]
			
			$('#timer').innerHTML += `<span class="unsure"}>${char}</span>`;
			if (newTimer) newTimer.innerHTML += `<span class="unsure" style="margin-right: 4vw">${char}</span>`;
		}
	}, 1000)
}

start();

$('#start').addEventListener('click', async () => {
	if (!window.documentPictureInPicture.window) {

		// Open a Picture-in-Picture window.
		const pipWindow = await window.documentPictureInPicture.requestWindow({
			width: 200,
			height: 150,
		});

		[...document.styleSheets].forEach((styleSheet) => {
			try {
				const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
				const style = document.createElement('style');

				style.textContent = cssRules;
				pipWindow.document.head.appendChild(style);
			} catch (e) {
				const link = document.createElement('link');

				link.rel = 'stylesheet';
				link.type = styleSheet.type;
				link.media = styleSheet.media;
				link.href = styleSheet.href;
				pipWindow.document.head.appendChild(link);
			}
		})

		const h1 = document.querySelector('h1').cloneNode(true)
		pipWindow.document.body.appendChild(h1)

		newTimer = document.querySelector('.timer').cloneNode(true);
		pipWindow.document.body.appendChild(newTimer);
	}
	
// 	if (!isRunning) {
// 		start();
// 	} else {
// 		if (isCleared) {
// 			clearInterval(currentInterval);
// 			document.body.classList.remove('running');
// 			isRunning = false;
			
// 	$('#start span').innerText = 'Start'
// 		} else {
// 			document.body.classList.remove('done');
// 			$('audio').load();
// 			isCleared = true;
// 			$('#start span').innerText = 'Start'
// 		}
// 	}
});

let mouseTimeout;
addEventListener('mousemove', () => {
	document.body.classList.add('hover');
	
	if (mouseTimeout)
		clearTimeout(mouseTimeout)
	
	mouseTimeout = setTimeout(() => {
		document.body.classList.remove('hover');
	}, 1000);
});
