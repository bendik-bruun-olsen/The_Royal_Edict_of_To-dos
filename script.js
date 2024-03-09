const inputForm = document.querySelector("#input-form");
const input = document.querySelector("#text-input");
const emptyNotifyText = document.querySelector("#empty-list");
const wrapper = document.querySelector("#wrapper");
const hideCompleted = document.querySelector("#hide-completed");
const showNumbers = document.querySelector("#show-num")

const generateID = () => Math.round(Math.random() * Date.now()).toString(16);

hideCompleted.checked = localStorage.getItem("hideCompleted") === "true";
showNumbers.checked = localStorage.getItem("showNumbers") === "true";

let originalList = [];
const storedList = localStorage.getItem("originalList");
if (storedList) {
    originalList = JSON.parse(storedList);
    generateList(sortList());
};

inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.length > 0) {
        const newItem = {
            id: generateID(),
            text: input.value, 
            checked: false
        };

        originalList.unshift(newItem);
        input.value = "";
        generateList(sortList());
        input.focus();
    }
    else input.placeholder = "The Field of Input Yearns for Letters!";
});

showNumbers.addEventListener("change", () => {
    generateList(sortList());
});

hideCompleted.addEventListener("change", () => {
    generateList(sortList());
});

function generateList(arr) {
    const previousItems = document.querySelectorAll(".item-container")
    previousItems.forEach(e => e.remove());

    arr.forEach((e, i) => {

        const item = document.createElement("div");
        const iconContainer = document.createElement("div");
        const arrowsContainer = document.createElement("div")
        const itemText = document.createElement("p");
        const btnRemove = document.createElement("i");
        const checkedIcon = document.createElement("i");
        const arrowUp = document.createElement("i");
        const arrowDown = document.createElement("i");

        item.classList.add("item-container");
        itemText.classList.add("item-text");
        iconContainer.classList.add("icon-container");
        arrowsContainer.classList.add("arrows-container");
        btnRemove.classList.add("fas", "fa-minus-circle", "remove-btn");
        checkedIcon.classList.add("far", "fa-check-circle", "notChecked");
        arrowUp.classList.add("fas", "fa-caret-up", "arrow-up");
        arrowDown.classList.add("fas", "fa-caret-down", "arrow-down");

        itemText.textContent = showNumbers.checked ? `${i+1}. ${e.text}` : e.text;

        arrowsContainer.append(arrowUp, arrowDown)
        iconContainer.append(checkedIcon, btnRemove, arrowsContainer);
        item.append(itemText, iconContainer);
        wrapper.append(item);

        btnRemove.addEventListener("click", () => {
            originalList.splice(i, 1);
            generateList(sortList());
        });
    
        checkedIcon.addEventListener("click", () => {
            e.checked = !e.checked;
            handleCheck(item, e.checked);
            generateList(sortList());
        });

        arrowUp.addEventListener("click", () => generateList(sortList(e.id, "moveUp")));
        arrowDown.addEventListener("click", () => generateList(sortList(e.id, "moveDown")));

        if (e.checked) handleCheck(item, e.checked);
        if (i < arr.length - 1) item.style.borderBottom = "1px solid gray"; 
 
    });
    arr.length === 0 ? emptyNotifyText.style.display = "block" : emptyNotifyText.style.display = "none";
};

function handleCheck(item, isChecked) {
    const icon = item.querySelector(".fa-check-circle");
    const itemText = item.querySelector(".item-text");

    if (isChecked) {
        icon.classList.remove("notChecked", "far");
        icon.classList.add("checked", "fas");
        itemText.style.textDecoration = "line-through";
        itemText.style.opacity = "25%"
    }
    else {
        icon.classList.remove("checked", "fas");
        icon.classList.add("notChecked", "far");
        itemText.style.textDecoration = "none";
        itemText.style.opacity = "100%";
    };
};

function sortList(id, movement) {
    if (movement) {
        let i = originalList.findIndex(e => e.id === id);

        if (!hideCompleted.checked) {
            // Move items in originalList
            if (movement === "moveUp" && i > 0) moveItemUp(i);
            else if (movement === "moveDown" && i < originalList.length - 1) moveItemDown(i);

        }
        else {
            // Move items in originalList when modifiedList is displayed/rendered.
            if (movement === "moveUp" && i > 0) {
                while (originalList[i-1].checked && i > 0) { // Move past the checked(thus hidden) items.
                    moveItemUp(i);
                    i--;
                    if (i === 0) break; // Break to avoid checking "originalList[i-1].checked" if i is 0, which will return undefined.
                };
                if (i > 0) moveItemUp(i);
            }
            else if (movement === "moveDown" && i < originalList.length - 1) {
                while (originalList[i+1].checked && i < originalList.length - 1) {
                    moveItemDown(i);
                    i++;
                    if (i === originalList.length - 1) break;
                };
                if (i < originalList.length - 1) moveItemDown(i);
            };
        };
    };
    saveList();
    let modifiedList = originalList.filter(e => hideCompleted.checked ? !e.checked : e);
    return hideCompleted.checked ? modifiedList : originalList;
};

function moveItemUp(i) {
    const temp = originalList[i];
    originalList[i] = originalList[i-1];
    originalList[i-1] = temp;
};

function moveItemDown(i) {
    const temp = originalList[i];
    originalList[i] = originalList[i+1];
    originalList[i+1] = temp;
};


function saveList() {
    localStorage.setItem("originalList", JSON.stringify(originalList));
    localStorage.setItem("hideCompleted", hideCompleted.checked);
    localStorage.setItem("showNumbers", showNumbers.checked);
};