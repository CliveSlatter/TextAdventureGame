let keywords = new Map()

function loadStart() {
    resetItems()
    Cookies.set("message","")
    let url = "/locations/getFirst"
    createWordMap()
    console.log("Invoked firstLocation()");
    fetch(url, {
        method: "GET",
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            createPage(response)
        }
    });
}

function startAction(word) {
    if(word==="Search"){

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
                        + `<td><button id="${item.itemID}" onclick="collectItem(${item.itemID})">${item.item}</button></td>`
                        +`</tr>`
                }
                itemsHTML += `</table>`
                document.getElementById("items").innerHTML = itemsHTML
                document.getElementById("instruction").innerText=""
            }
        });
    }else if(word==="Help"){

        createHelpList()

    }else if(word==="Inventory"){

        createInventoryList()

    }

}

function checkKeyWord(){
    console.log("Invoked checkWord()")
    let url = "/dictionary/check"
    let data = new FormData()
    let keyword = document.getElementById("instruction").value
    data.append("keyword", keyword)
    fetch(url,{
        method: "POST",
        body: data,
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")){
            console.log(JSON.stringify(response));
        } else{
            startAction(response.word)
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
            createPage(response)
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
            Cookies.set("destinationID",opt.destinationID)
            Cookies.set("message","")
            validateDestination(); // or use a data-attribute
        }
        let td2 = document.createElement("td")
        let td2Text = document.createTextNode(opt.label)
        button.appendChild(td2Text)
        row.appendChild(button)
        tableBody.appendChild(row)
    }
    table.appendChild(tableBody)
    optDiv.appendChild(table)
    table.appendChild(tableBody)
    optDiv.appendChild(table)
    return optDiv
}

function validateDestination(){
    let url = "/directions/validate"
    fetch(url,{
        method: "GET",
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")){
            console.log(JSON.stringify(response));
        } else{
            if(response.collected==true || response.collected==null){
                findLocation(Cookies.get("destinationID"))
            }else if(response.collected==false){
                findLocation(Cookies.get("locationID"))
                Cookies.set("message","You do not have the required item to proceed this way!!")
            }
        }
    });
}

function createSearchBar(){
    let searchDiv = document.createElement("div")
    searchDiv.setAttribute("class", "input")
    searchDiv.setAttribute("id","userInput")
    const form = document.createElement("form")
    const button = document.createElement("button")
    button.setAttribute("onclick","checkKeyWord()")
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

function createMessageBar(){
    let messageDiv = document.createElement("div")
    messageDiv.setAttribute("id","message")
    messageDiv.setAttribute("class","message")
    let message = document.createTextNode(Cookies.get("message"))
    messageDiv.appendChild(message)
    return messageDiv
}

function createItemList(){
    const searchDiv = document.createElement("div")
    searchDiv.setAttribute("id","items")
    searchDiv.setAttribute("class","items")
    return searchDiv
}

function createTitle(){
    const titleDiv = document.createElement(("div"))
    titleDiv.setAttribute("class","title")
    const titleText = document.createTextNode("The Cheesily Titled Adventure Starts Here")
    titleDiv.appendChild(titleText)
    return titleDiv
}

function createHelpList(){
    let url = "/dictionary/help"
    fetch(url,{
        method: "GET",
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")){
            console.log(JSON.stringify(response));
        } else{
            const dictDiv = document.createElement("div")
            const table = document.createElement("table")
            const tableBody = document.createElement("tbody")
            const tableHeading = document.createElement("th")
            const headingRow = document.createElement("tr")
            const headingTitle = document.createTextNode("Available Words")
            tableHeading.appendChild(headingTitle)
            tableHeading.setAttribute("colSpan","2")
            headingRow.appendChild(tableHeading)
            tableBody.appendChild(headingRow)
            dictDiv.setAttribute("class","dictionary")
            dictDiv.setAttribute("id","dictionary")
            table.setAttribute("class","table")
            for(let word of response.wordlist){
                let row = document.createElement("tr")
                let td1 = document.createElement("td")
                let td1Text = document.createTextNode(word.word)
                let td2 = document.createElement("td")
                let td2Text = document.createTextNode(word.description)
                td1.appendChild(td1Text)
                td2.appendChild(td2Text)
                row.appendChild(td1)
                row.appendChild(td2)
                tableBody.appendChild(row)

            }
            table.appendChild(tableBody)
            dictDiv.appendChild(table)
            document.getElementById("container").appendChild(dictDiv)
            //return table
            //startAction(response.word)
        }
    });

}

function createWordMap(){

    console.log("Invoked createWordMap()")
    let url = "/dictionary/getKeywords"
    fetch(url,{
        method: "GET",
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")){
            console.log(JSON.stringify(response));
        } else{
            const tableBody = document.createElement("tbody")
            const tableHeading = document.createElement("th")
            const headingRow = document.createElement("tr")
            const headingTitle = document.createTextNode("Available Words")
            tableHeading.appendChild(headingTitle)
            tableHeading.setAttribute("colSpan","2")
            headingRow.appendChild(tableHeading)
            tableBody.appendChild(headingRow)
            for (let word of response.wordlist){
                keywords.set(word.word,word.url)
            }
            console.log(keywords)
        }
    });
}

function collectItem(itemID){
    console.log("Item ID: "+ itemID)
    let url = "/items/collect"
    Cookies.set("itemID", itemID)
    fetch(url,{
        method: "GET",
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")){
            console.log(JSON.stringify(response));
        } else{
            console.log(JSON.stringify(response))
            startAction("Search")
        }
    });
}

function createPage(response){
    let titleDiv = createTitle()
    let locDiv = createLocation(response.locationName, response.locationID)
    let descDiv = createDescription(response.description)
    let urlDiv = createImage(response.url)
    let optDiv = createOptions(response.options)
    let itemDiv = createItemList()
    let searchDiv = createSearchBar()
    let messageDiv = createMessageBar()
    document.getElementById("container").appendChild(titleDiv)
    document.getElementById("container").appendChild(locDiv)
    document.getElementById("container").appendChild(descDiv)
    document.getElementById("container").appendChild(urlDiv)
    document.getElementById("container").appendChild(optDiv)
    document.getElementById("container").appendChild(itemDiv)
    document.getElementById("container").appendChild(searchDiv)
    document.getElementById("container").appendChild(messageDiv)
    Cookies.set("locationID",response.locationID)
}

function createInventoryList(){
    console.log("Invoked createInventoryList()")
    let url = "/items/inventory"
    fetch(url,{
        method: "GET",
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")){
            console.log(JSON.stringify(response));
        } else{
            console.log(JSON.stringify(response))
            const invDiv = document.createElement("div")
            const table = document.createElement("table")
            const tableBody = document.createElement("tbody")
            const tableHeading = document.createElement("th")
            const headingRow = document.createElement("tr")
            const headingTitle = document.createTextNode("Currently Held Items")
            tableHeading.appendChild(headingTitle)
            headingRow.appendChild(tableHeading)
            tableBody.appendChild(headingRow)
            invDiv.setAttribute("class","inventory")
            invDiv.setAttribute("id","inventory")
            table.setAttribute("class","table")
            for(let item of response.inventory){
                let row = document.createElement("tr")
                let td2 = document.createElement("td")
                let td2Text = document.createTextNode(item)
                td2.appendChild(td2Text)
                row.appendChild(td2)
                tableBody.appendChild(row)
            }
            table.appendChild(tableBody)
            invDiv.appendChild(table)
            table.appendChild(tableBody)
            invDiv.appendChild(table)
            document.getElementById("container").appendChild(invDiv)
            //return table
            
        }
    });
}

function resetItems(){
    let url = "/items/reset"
    fetch(url,{
        method: "GET",
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")){
            console.log(JSON.stringify(response));
        } else{
            console.log(JSON.stringify(response))
        }
    });
}