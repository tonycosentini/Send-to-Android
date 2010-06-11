safari.self.addEventListener("message", handleMessage, false);

function handleMessage(msgEvent) {
	if (msgEvent.name == "send") {
		send();
	} else if (msgEvent.name == "completed") {
		showcompleted();
	} else if (msgEvent.name == "error") {
		showerror();
	}
};

function send() {
	var newdiv = document.createElement('div');
	newdiv.setAttribute("id", "send-to-android-box");
	newdiv.setAttribute("style", "width: 200px; background: #FFFFFF; color: #000000; position: fixed; top: 10px; left: 10px; font-size: 14px; border: 3px solid #000000; font-weight: bold; padding: 6px; -webkit-border-radius: 5px;");
	newdiv.innerText = 'Sending to phone...';
	var body = document.getElementsByTagName('body')[0];
	body.appendChild(newdiv);
};

function showcompleted() {
	var div = document.getElementById("send-to-android-box");
	div.innerText= "Sent!";
	// Probably a better way to do this timer stuff... but it's open source! 
	setTimeout("var div = document.getElementById('send-to-android-box'); var body = document.getElementsByTagName('body')[0]; body.removeChild(div);", 2500);
};

function showerror() {
	var div = document.getElementById("send-to-android-box");
	div.innerText= "Error :(";
	setTimeout("var div = document.getElementById('send-to-android-box'); var body = document.getElementsByTagName('body')[0]; body.removeChild(div);", 2500);
};