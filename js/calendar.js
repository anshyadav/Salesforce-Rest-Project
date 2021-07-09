window.onload = function () {
    getContactCampaign();

}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getCurrentDate() {
    let currentDate = new Date();
    var dd = String(currentDate.getDate()).padStart(2, '0');
    var mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    var yyyy = currentDate.getFullYear();
    currentDate = yyyy + '-' + mm + '-' + dd;
    return currentDate;
}

async function getToken() {
    let response = await fetch("https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9fTLmJ60pJ5LcM88X.T4cnlgFI6sTtiU0_tQwwMuyjIocVl289zYxysWrm45Y9JSHF0f55z.1SJoYFpkQ&client_secret=E2D30FFD226F098FDC26D1A0FA58581717B97678E30559C77F55C092B7899361&username=project2@eilireland.org&password=Secureit123AYfrE3tYJC7OVZtTEg0hgDkI", {
        method: "POST",
        mode: 'cors',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        },
    });

    let data = await response.json();
    return await data["access_token"];
}
async function getContactCampaign() {

    let vArray = [];
    let vArray2 = [];
    let userEmail = getCookie("Id");

    let campaignIdList = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=select+campaignId+from+CampaignMember+where+contact.email='" + userEmail + "'", {
        method: "GET",
        mode: 'cors',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + await getToken()
        }
    });

    campaignIdListResponse = await campaignIdList.json();
    campaignIDArray = "";

    for (let i = 0; i < campaignIdListResponse["totalSize"]; i++) {
        campaignIDArray = campaignIDArray + "'" + campaignIdListResponse["records"][i]["CampaignId"] + "',";
    }
    campaignIDArray = campaignIDArray.substring(-1, campaignIDArray.length - 1);

    let campaignNameList = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=select+name,StartDate+from+campaign+where+id+in+(" + campaignIDArray + ")", {
        method: "GET",
        mode: 'cors',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + await getToken()
        }
    });

    campaignNameListResponse = await campaignNameList.json();
    console.log(campaignNameListResponse);

    campaignNameArray = [];

    for (let j = 0; j < campaignNameListResponse["totalSize"]; j++) {
        campaignNameArray.push([campaignNameListResponse["records"][j]["Name"], campaignNameListResponse["records"][j]["StartDate"]]);

    }
    console.log(campaignNameArray);
    var demo = [];
    var temp = {};
    for (let i = 0; i < campaignNameArray.length; i++) {
        console.log(campaignNameArray[i][1]);
        let campDate = campaignNameArray[i][1];
        var dd = String(campDate.substring(8, 10));

        var mm = String(campDate.substring(5, 7));
        var yyyy = campDate.substring(0, 4);
        campDate = yyyy + '/' + mm + '/' + dd;
        console.log(campDate);


        demo.push({

            "id": i,
            "date": campDate,
            content: campaignNameArray[0][i],
            source: "http://salesforce.com"

        });

    }
    console.log(demo);
    initCalender(demo);
}