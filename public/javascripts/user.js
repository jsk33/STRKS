const newTargetForm = document.querySelector(".newTargetForm-js")
const newTargetNameTextField = newTargetForm.querySelector("#targetName")
const newTargetDescriptionTextField = newTargetForm.querySelector("#targetDescription")
const targetList = document.querySelector(".targetList-js")

let targets = []

async function handleSubmit(event) {
    event.preventDefault()

    const newTargetName = newTargetNameTextField.value
    const newTargetDescription = newTargetDescriptionTextField.value
    const dataToPost = { name: newTargetName, description: newTargetDescription, due: new Date(new Date().setHours(24, 0, 0, 0)) }
    const endpoint = "http://localhost:8000/api/targets"

    try {
        await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dataToPost) // body data type must match "Content-Type" header
        }).then(res => res.json())
            .then(res => console.log(`The following has been posted: ${res.name}`))      
        
        // get the list of targets including the newly posted one
        await fetchTargets()

        // render the new list of targets
        targetList.innerHTML = ''
        renderTargets(targets)

        // clear the text input forms
        newTargetNameTextField.value = ''
        newTargetDescriptionTextField.value = ''
    } catch (err) {
        console.log(err.message)
    }
}

async function handleComplete(event) {
    // update the completed target item using its id and count
    const targetListElement = event.target.parentElement.parentElement.parentElement
    const targetID = targetListElement.id
    const endpointID = `http://localhost:8000/api/targets/${targetID}`
    const newCount = parseInt(targetListElement.className) + 1

    const dataToUpdate = { count: newCount, due: new Date(new Date().setHours(48, 0, 0, 0)), status: true }
        
    try {
        await fetch(endpointID, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToUpdate)
        })
    } catch (err) {
        console.log(err.message)
    }

    // get the updated list of targets
    await fetchTargets()

    // render the updated list of targets
    targetList.innerHTML = ''
    renderTargets(targets)
}

async function handleDelete(event) {
    // delete the target item using its id
    const targetListElement = event.target.parentElement.parentElement.parentElement
    const targetID = targetListElement.id
    const endpointID = `http://localhost:8000/api/targets/${targetID}`

    try {
        await fetch(endpointID, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            headers: {
                  'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => console.log(`The following has been deleted: ${ res.name }`))
        
        // remove the target item from the rendered list of targets
        targetListElement.remove()
    } catch (err) {
        console.log(err.message)
    }
}

function renderTargets(targets) {
    // create a new list item for each target and append to the list
    targets.forEach(target => {
        const listItem = document.createElement("li")
        listItem.id = target._id
        listItem.className = target.count

        // create a card containing name, description, count
        const cardDiv = document.createElement("div")
        cardDiv.className = "card"
        const cardHeader = document.createElement("header")
        cardHeader.className = "card-header"
        const targetName = document.createElement("p")
        targetName.className = "card-header-title"
        targetName.innerText = `${target.name}`

        cardDiv.appendChild(cardHeader)
        cardHeader.appendChild(targetName)

        const cardContent = document.createElement("div")
        cardContent.className = "card-content"
        const targetDescription = document.createElement("div")
        targetDescription.className = "content"
        targetDescription.innerText = `description: ${target.description}`

        cardContent.appendChild(targetDescription)
        cardDiv.appendChild(cardContent)

        const cardFooter = document.createElement("footer")
        cardFooter.className = "card-footer"
        
        const targetCount = document.createElement("p")
        targetCount.innerText = `${target.count}`
        targetCount.className = "card-footer-item"
        const completeBtn = document.createElement("a")
        completeBtn.innerText = "✅"
        completeBtn.addEventListener("click", handleComplete)
        completeBtn.className = "button is-success is-light card-footer-item"
        if (target.status == true) {
            completeBtn.setAttribute("disabled", true)
        }
        const deleteBtn = document.createElement("a")
        deleteBtn.innerText = "❌"
        deleteBtn.addEventListener("click", handleDelete)
        deleteBtn.className = "button is-danger is-light card-footer-item"

        cardDiv.appendChild(cardFooter)
        cardFooter.appendChild(targetCount)
        cardFooter.appendChild(completeBtn)
        cardFooter.appendChild(deleteBtn)

        listItem.appendChild(cardDiv)

        targetList.appendChild(listItem)
    })
}

async function fetchTargets() {
    const response = await fetch('http://localhost:8000/api/targets')
    const fetchedData = await response.json()

    targets = fetchedData
    console.log(targets)
}

async function checkTargets(targets) {
    

    // for each target, check if due date has passed
    targets.forEach(async target => {
        const targetID = target._id
        const endpointID = `http://localhost:8000/api/targets/${targetID}`
        
        const currDate = new Date()
        const dueDate = new Date(target.due)
        const dayBeforeDue = new Date(target.due).setDate(dueDate.getDate() - 1)

        if (dueDate < currDate) {
            // due date has passed -> set its count to zero and its due date to midnight tonight
            const dataToUpdate = { count: 0, due: new Date(new Date().setHours(24, 0, 0, 0)), status: false }

            try {
                await fetch(endpointID, {
                    method: 'PATCH',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToUpdate)
                }).then(res => res.json()).then(console.log)
            } catch (err) {
                console.log(err.message)
            }
        } else if (target.status && currDate < dueDate && currDate > dayBeforeDue) {
            // right now: somewhere in the 24 hour window immediately before the due date
            // status should be false so that the activity may be completed
            const dataToUpdate = { status: false, count: target.count, due: target.due }
            
            try {
                await fetch(endpointID, {
                    method: 'PATCH',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToUpdate)
                }).then(res => res.json()).then(console.log)
            } catch (err) {
                console.log(err.message)
            }
        }
    })
}

async function init() {
    newTargetForm.addEventListener("submit", handleSubmit);
    
    try {
        await fetchTargets()

        // check fetched targets & reset count on appropriate targets (i.e. those with passed due dates)
        await checkTargets(targets)

        // fetch potentially updated list of targets
        await fetchTargets()

        // finally render the list of targets
        renderTargets(targets)
    } catch (err) {
        console.log(err.message)
    }
}

init()