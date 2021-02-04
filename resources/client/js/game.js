

function loadStart() {
    let url = "/locations/getFirst"
    console.log("Invoked firstLocation()");
    fetch(url, {
        method: "GET",
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            let locDiv = createLocation(response.locationName, response.locationID)
            let descDiv = createDescription(response.description)
            let urlDiv = createImage(response.url)
            let optDiv = createOptions(response.options)
            document.getElementById("container").appendChild(locDiv)
            document.getElementById("container").appendChild(descDiv)
            document.getElementById("container").appendChild(urlDiv)
            document.getElementById("container").appendChild(optDiv)
            Cookies.set("locationID",response.locationID)
        }
    });
}

function startAction() {
    let keyword = document.getElementById("instruction").value
    checkKeyWord(keyword)
    if(keyword){
        console.log(Cookies.get("locationID"))
        let url = "/items/find"
        fetch(url,{
            method: "GET",
        }).then(response => {
            return response.json()
        }).then(response => {
            if (response.hasOwnProperty("Error")) {
                console.log(JSON.stringify(response));
            } else {
                console.log(JSON.stringify(response))
                    let itemsHTML = `<table><tr><th>Items</th></tr>`
                for(let item of response.items){
                    itemsHTML += `<tr>`
                                + `<td><button id="${item.itemID}">${item.item}</button></td>`
                                +`</tr>`
                }
                itemsHTML += `</table>`
                document.getElementById("items").innerHTML = itemsHTML
            }
        });
    }
}

function checkKeyWord(keyword){
    let url = "/dictionary/check"
    let data = new FormData()
    data.append("keyword", keyword)
    fetch(url,{
        method: "POST",
        body: data,
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            console.log(JSON.stringify(response));
        } else {
            console.log(JSON.stringify(response))
        }
    });
}

function findLocation(id){

}

function createLocation(locationName, locationID){
    const locDiv = document.createElement("div")
    const loc = document.createTextNode(locationName)
    locDiv.appendChild(loc)
    locDiv.setAttribute("class", "location")
    locDiv.setAttribute("id","loc"+locationID)
    return locDiv
}

function createDescription(description){
    const descDiv = document.createElement("div")
    const desc = document.createTextNode(description)
    descDiv.appendChild(desc)
    descDiv.setAttribute("class", "description")
    return descDiv
}

function createImage(picUrl){
    const urlDiv = document.createElement("div")
    const url = document.createElement("img")
    urlDiv.appendChild(url)
    url.setAttribute("src","img/"+picUrl)
    urlDiv.setAttribute("class","url")
    return urlDiv
}

function createOptions(options){
    console.log(options)
    const optDiv = document.createElement("div")
    const table = document.createElement("table")
    const tableBody = document.createElement("tbody")
    const tableHeading = document.createElement("th")
    const headingRow = document.createElement("tr")
    const headingTitle = document.createTextNode("Available Directions")
    tableHeading.appendChild(headingTitle)
    tableHeading.setAttribute("colSpan","2")
    headingRow.appendChild(tableHeading)
    tableBody.appendChild(headingRow)
    optDiv.setAttribute("class","directions")
    table.setAttribute("class","table")
    for(let opt of options){
        let row = document.createElement("tr")
        let button = document.createElement("button")
        button.setAttribute("id",opt.destinationID)
        button.onclick=function() {
            findLocation(opt.destinationID); // or use a data-attribute
        }
        let td2 = document.createElement("td")
        let td2Text = document.createTextNode(opt.label)
        button.appendChild(td2Text)
        row.appendChild(button)
        tableBody.appendChild(row)
        table.appendChild(tableBody)
        optDiv.appendChild(table)
        table.appendChild(tableBody)
        optDiv.appendChild(table)

    }
    return optDiv
}

function createItems(){

}

