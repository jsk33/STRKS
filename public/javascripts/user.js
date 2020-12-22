const newTargetForm = document.querySelector(".newTargetForm-js");
const newTargetNameTextField = newTargetForm.querySelector("#targetName");
const newTargetDescriptionTextField = newTargetForm.querySelector("#targetDescription");
const targetList = document.querySelector(".targetList-js");

let targets = [];

async function handleSubmit(event) {
    event.preventDefault();

    const newTargetName = newTargetNameTextField.value;
    const newTargetDescription = newTargetDescriptionTextField.value;
    const endpoint = "http://localhost:8000/api/targets";

    const postedData = await postData(endpoint, { name: newTargetName, description: newTargetDescription });
    console.log(postedData);
    await fetchTargets();
    targetList.innerHTML = '';
    renderTargets(targets);

    newTargetNameTextField.value = '';
    newTargetDescriptionTextField.value = '';
}

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}

async function handleComplete(event) {
    console.log("This item is complete. The count will increment by 1.");

    // update the completed target item using its id and count
    targetID = event.target.parentNode.id;
    const endpointID = `http://localhost:8000/api/targets/${targetID}`;
    const newCount = parseInt(event.target.parentNode.className) + 1;
    
    // updateData(endpointID, [{ propName: "count", value: newCount }, { propName: "due", value: new Date(new Date().setHours(48, 0, 0, 0)) }]).then((data) => {
    //     console.log(data);
    //     targetList.innerHTML = '';
    //     fetchTargets();
    //     renderTargets(targets);
    // });

    const updatedData = await updateData(endpointID, [{ propName: "count", value: newCount }, { propName: "due", value: "placeholder" }]);
    console.log(updatedData);
    await fetchTargets();
    targetList.innerHTML = '';
    renderTargets(targets);
}

async function updateData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}

async function handleDelete(event) {
    // delete the target item using its id
    const targetID = event.target.parentNode.id;
    const endpointID = `http://localhost:8000/api/targets/${targetID}`;

    // deleteData(endpointID).then((data) => {
    //     console.log(data);
    //     targetList.innerHTML = '';
    //     fetchTargets();
    //     renderTargets(targets);
    // });

    const deletedData = await deleteData(endpointID);
    console.log(`${deletedData} has been deleted`);
    await fetchTargets();
    targetList.innerHTML = '';
    renderTargets(targets);
}

async function deleteData(url='') {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        }
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}

function renderTargets(targets) {
    // create a new list item for each target and append to the list
    targets.forEach(target => {
        const listItem = document.createElement("li");
        const deleteBtn = document.createElement("button");
        const completeBtn = document.createElement("button");
        const span = document.createElement("span");

        listItem.id = target._id;
        listItem.className = target.count;

        deleteBtn.innerText = "❌";
        deleteBtn.addEventListener("click", handleDelete);

        completeBtn.innerText = "✅"
        completeBtn.addEventListener("click", handleComplete);

        span.innerText = `name: ${target.name} \n description: ${target.description} \n count: ${target.count} \n`;

        listItem.appendChild(span);
        listItem.appendChild(completeBtn);
        listItem.appendChild(deleteBtn);

        targetList.appendChild(listItem);
    });

    console.log('rendered targets');
}

async function fetchTargets() {
    const res = await fetch('http://localhost:8000/api/targets');
    const data = await res.json();
    targets = data;
    console.log(targets);
}

// async function checkTargets(targets) {
//     // for each target, check if due date has passed
//     targets.forEach(target => {
//         if (new Date(target.due) < new Date()) {
//             // due date has passed -> set its count to zero and its due date to midnight tonight
//             const targetID = target._id;
//             const endpointID = `http://localhost:8000/api/targets/${targetID}`;
//             const data = { message: "overdue" }


//             const response = await fetch(endpointID, {
//                 method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
//                 headers: {
//                   'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(data)
//             });

//             const updatedData = await response.json();
//             console.log(updatedData);


//             // updateData(endpointID, [{ propName: "count", value: 0 }, { propName: "due", value: new Date(new Date().setHours(24, 0, 0, 0)) }])
//             //     .then((data) => {
//             //         console.log(data);
//             //         console.log(`${target.name}'s streak count has been reset to zero`);
//             //     });
//         }
//     });

//     console.log("checked targets");
// }

async function init() {
    newTargetForm.addEventListener("submit", handleSubmit);
    await fetchTargets();
    //await checkTargets(targets);
    await fetchTargets();
    renderTargets(targets);
}

init();