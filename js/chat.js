let chatEnabled = false;

function chatToggle() {
    if (chatEnabled) {
        document.getElementById("chat-toggle").style.cssText = "display:none";
        chatEnabled = !chatEnabled;
    } else {
        document.getElementById("chat-toggle").style.cssText = "display:block";
        chatEnabled = !chatEnabled;
    }
}

async function loadChats() {
    let currentDate = getCurrentDate();
    let noOfEmails = 0;
    document.getElementById("currentDateTag").innerHTML = "&nbsp;&nbsp;" + currentDate;
    let email = getCookie("Id");

    let responseViewContact = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=select+Id+from+Contact+where+Email+=+'" + email + "'", {
        method: "GET",
        mode: 'cors',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + await getToken()
        }
    });

    let secretData = await responseViewContact.json();
    let Id = secretData["records"]["0"]["Id"];

    let taskData = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=SELECT+Description,Subject,ActivityDate+FROM+TASK+WHERE+WhoId='" + Id + "'", {
        method: "GET",
        mode: 'cors',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + await getToken()
        }
    });

    taskObject = await taskData.json();
    console.log(taskObject);
    Object.entries(taskObject["records"]).forEach(
        ([key1, value1]) => {
            noOfEmails = noOfEmails + 1;
        }
    );
    document.getElementById("ntfc").innerHTML = "";
    if (noOfEmails > 0) {
        document.getElementById("notification-header").innerHTML = "Notifications";
        for (let i = 0; i < noOfEmails; i++) {
            document.getElementById("ntfc").innerHTML += '<div class="notification-li"><div class="notification-image"><img src="img/emailnt.svg" ></div><div class="notification-text">' + taskObject["records"][i]["Subject"].substring(7) + '<br><span class="notification-date">Received on ' + taskObject["records"][i]["ActivityDate"] + '</span></div></div>';
        }
    } else {
        console.log("panda");
        document.getElementById("notification-header").innerHTML = "No notifications yet!";
        document.getElementById("ntfc").innerHTML = '<div class="notification-li"><div class="notification-text" style="text-align:center"><img style="width:260px;" src="img/pandajpg.jpg" ><br><br>We will notify you when something arrives.</div></div>';
    }
}