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
    const targetListElement = event.target.parentElement
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
    const targetListElement = event.target.parentElement
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
        const deleteBtn = document.createElement("button")
        const completeBtn = document.createElement("button")
        const span = document.createElement("span")

        listItem.id = target._id
        listItem.className = target.count

        deleteBtn.innerText = "❌"
        deleteBtn.addEventListener("click", handleDelete)

        completeBtn.innerText = "✅"
        completeBtn.addEventListener("click", handleComplete)
        if (target.status == true) {
            completeBtn.setAttribute("disabled", true)
        }

        span.innerText = `name: ${target.name} \n description: ${target.description} \n count: ${target.count} \n`

        listItem.appendChild(span)
        listItem.appendChild(completeBtn)
        listItem.appendChild(deleteBtn)

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
        
        if (new Date(target.due) < new Date()) {
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
        } else if (new Date() < new Date(target.due) && new Date() > new Date(target.due).setDate()-1) {
            // right now: somewhere in the 24 hour window immediately before the due date
            // status should be false so that the activity may be completed
            const dataToUpdate = { status: false }
            
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