

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
            let itemDiv = createItemList()
            let searhDiv = createSearchBar()
            document.getElementById("container").appendChild(locDiv)
            document.getElementById("container").appendChild(descDiv)
            document.getElementById("container").appendChild(urlDiv)
            document.getElementById("container").appendChild(optDiv)
            document.getElementById("container").appendChild(itemDiv)
            document.getElementById("container").appendChild(searhDiv)
            Cookies.set("locationID",response.locationID)
        }
    });
}

function startAction() {
    let keyword = document.getElementById("instruction").value
    let found = checkKeyWord(keyword)
    if(found){
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
    }else{
        alert("Keyword not recognised")
    }
    document.getElementById("instruction").innerText=""
}

function checkKeyWord(keyword){
    console.log("Invoked checkWord()")
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
            return false
        } else {
            console.log(JSON.stringify(response))
            return true
        }
    });
}

function findLocation(id){
    let url = "/locations/getLocation"
    Cookies.set("locationID",id)
    console.log("Invoked findLocation()");
    fetch(url, {
        method: "GET",
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            console.log(response)
            let node = document.getElementById("container")
            while(node.firstChild){
                node.removeChild(node.firstChild)
            }
            let locDiv = createLocation(response.locationName, response.locationID)
            let descDiv = createDescription(response.description)
            let urlDiv = createImage(response.url)
            let optDiv = createOptions(response.options)
            let searchDiv = createSearchBar()
            document.getElementById("container").appendChild(locDiv)
            document.getElementById("container").appendChild(descDiv)
            document.getElementById("container").appendChild(urlDiv)
            document.getElementById("container").appendChild(optDiv)
            document.getElementById("container").appendChild(searchDiv)
            Cookies.set("locationID",response.locationID)
        }
    });

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
    descDiv.setAttribute("id", "description")
    return descDiv
}

function createImage(picUrl){
    const urlDiv = document.createElement("div")
    const url = document.createElement("img")
    urlDiv.appendChild(url)
    url.setAttribute("src","img/"+picUrl)
    urlDiv.setAttribute("class","url")
    urlDiv.setAttribute("id","url")
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
    optDiv.setAttribute("id","directions")
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

function createSearchBar(){
    let searchDiv = document.createElement("div")
    searchDiv.setAttribute("class", "input")
    searchDiv.setAttribute("id","userInput")
    const form = document.createElement("form")
    const button = document.createElement("button")
    button.setAttribute("onclick","startAction()")
    let buttonText = document.createTextNode("Enter")
    button.appendChild(buttonText)
    const text = document.createElement("input")
    text.setAttribute("class","textInput")
    text.setAttribute("id","instruction")
    text.setAttribute("autocomplete", "off")
    text.setAttribute("placeholder","Type help for available keywords")
    const label = document.createElement("label")
    let labelText = document.createTextNode("Enter instruction:")
    label.setAttribute("for","userInput")
    label.appendChild(labelText)
    form.appendChild(label)
    form.appendChild(text)
    searchDiv.appendChild(form)
    searchDiv.appendChild(button)
    return searchDiv
}

function createItemList(){
    const searchDiv = document.createElement("div")
    searchDiv.setAttribute("id","items")
    searchDiv.setAttribute("class","items")
    return searchDiv
}

