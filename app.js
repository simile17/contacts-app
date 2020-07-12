const maxContactsCount = 1;
const maxFirstNameLength = 15;
const maxLastNameLength = 30;
const maxAddressLength = 60;

var currentKey = null;
var currentEmail = null;
var lastSortIndex = 0;
var lastForceAsc = true;

function openForm(key) {
    var obj = JSON.parse(localStorage.getItem(key));
    if (key == null) {
        if (localStorage.length >= maxContactsCount) {
            alert('Maximum number of contacts reached, please buy premium version');
            return;
        }
        document.getElementById("form").reset();
    } else {
        fillFormWithObj(key, obj);
    }
    document.getElementById("new-contact").style.display = "block";
    currentKey = key;
    currentEmail = obj.email;
}

function fillFormWithObj(key, obj) {
    document.getElementById("firstName").value = obj.firstName;
    document.getElementById("lastName").value = obj.lastName;
    document.getElementById("dateOfBirth").value = obj.dateOfBirth;
    document.getElementById("email").value = obj.email;
    document.getElementById("address").value = obj.address;
    document.getElementById("phoneNumber").value = key;
}

function closeForm() {
    document.getElementById("new-contact").style.display = "none";
    currentKey = null;
}

function submitForm() {
    var email = document.getElementById("email").value;
    var key = document.getElementById("phoneNumber").value;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var address = document.getElementById("address").value;
    var dateOfBirth = document.getElementById("dateOfBirth").value;
    if (currentKey != key && !isPhoneUnique(key)) {
        alert('This phone number is already existing');
        return;
    }
    if (currentEmail != email && !isEmailUnique(email)) {
        alert('This email address is already existing');
        return;
    }
    if (!validateEmail(email)) {
        alert('This email format is invalid');
        return;
    }
    if (!validatePhoneNumber(key)) {
        alert('This phone number format is invalid');
        return;
    }
    if (firstName.length > maxFirstNameLength) {
        alert('Too long name!');
        return;
    }
    if (lastName.length > maxLastNameLength) {
        alert('Too long last name!');
        return;
    }
    if (address.length > maxAddressLength) {
        alert('Too long address!');
        return;
    }
    if (new Date(dateOfBirth) > new Date()) {
        alert('App does not support people from the future. Sorry for any inconvenience caused.');
        return;
    }
    localStorage.removeItem(currentKey);
    localStorage.setItem(
        key,
        JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            dateOfBirth: dateOfBirth,
            address: address,
        })
    );
    clearTable();
    showContacts();
    closeForm();
}

function clearTable() {
    var table = document.getElementById("contactsTable");
    var i = table.rows.length - 1;
    for (i; i > 0; i--) {
        table.deleteRow(i);
    }
}

function deleteContact(key) {
    if (confirm('Do you really wish to remove contact?')) {
        localStorage.removeItem(key);
        clearTable();
        showContacts();
    }
}

function showContacts() {
    var i;
    for (i = 0; i < localStorage.length; i++) {
        var trNode = document.createElement("tr");
        var tdNode = document.createElement("td");
        var key = localStorage.key(i);
        var obj = JSON.parse(localStorage.getItem(key));
        var textNode = document.createTextNode(obj.firstName);
        tdNode.appendChild(textNode);
        trNode.appendChild(tdNode);

        textNode = document.createTextNode(obj.lastName);
        tdNode = document.createElement("td");
        tdNode.appendChild(textNode);
        trNode.appendChild(tdNode);

        textNode = document.createTextNode(obj.dateOfBirth);
        tdNode = document.createElement("td");
        tdNode.appendChild(textNode);
        trNode.appendChild(tdNode);

        textNode = document.createTextNode(key);
        tdNode = document.createElement("td");
        tdNode.appendChild(textNode);
        trNode.appendChild(tdNode);

        textNode = document.createTextNode(obj.email);
        tdNode = document.createElement("td");
        tdNode.appendChild(textNode);
        trNode.appendChild(tdNode);

        textNode = document.createTextNode(obj.address);
        tdNode = document.createElement("td");
        tdNode.appendChild(textNode);
        trNode.appendChild(tdNode);

        var button = document.createElement("button");
        var textButton = document.createTextNode("Edit");
        button.appendChild(textButton);
        trNode.appendChild(button);
        button.setAttribute("onclick", "openForm('" + key + "')");

        button = document.createElement("button");
        textButton = document.createTextNode("Remove");
        button.appendChild(textButton);
        trNode.appendChild(button);
        button.setAttribute("onclick", "deleteContact('" + key + "')");

        document.getElementById("contactsTable").appendChild(trNode);
    }
    sortTable(lastSortIndex, lastForceAsc);
}

//function given below is taken from https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable(n, forceAsc) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("contactsTable");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc" && !forceAsc) {
                dir = "desc";
                switching = true;
            }
        }
    }
    lastSortIndex = n;
    lastForceAsc = forceAsc;
}

function isPhoneUnique(key) {
    return localStorage.getItem(key) === null;
}

function isEmailUnique(email) {
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var obj = JSON.parse(localStorage.getItem(key));
        if (email == obj.email) {
            return false;
        }
    }
    return true;
}

//below given function is taken from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePhoneNumber(number) {
    const re = /^(\+\d+)|\d+$/;
    return re.test(String(number));
}
