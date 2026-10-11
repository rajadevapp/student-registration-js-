const list = document.querySelectorAll('.list');
const add_new = document.querySelectorAll('.add_new');
const form = document.getElementById('studentForm');

add_new.forEach((element) => {
    element.style.display = 'none';
});

list.forEach((element) => {
    element.style.display = 'none';
});   
document.addEventListener("DOMContentLoaded", function () {
    const studentTable = document.getElementById("no_data_row");
    if (!studentTable) {
        console.error("studentTable element not found in HTML!");
        return;
    }
    studentTable.innerHTML = `<td colspan="20" class="no-data">No Records found</td>`;
    hideShowBlock('block', 'none');
});


function hideShowBlock(listDisplay, addDisplay){
    if(listDisplay == 'block'){
        resetForm();
    }
    add_new.forEach((element) => {
        element.style.display = addDisplay;
    });

    list.forEach((element) => {
        element.style.display = listDisplay;
    });   
    modelOpenClose('none');
}

function resetForm() {
    form.querySelectorAll('input, select, textarea').forEach((field) => {
        field.value = '';
    });
     document.querySelectorAll('.error').forEach((element) => {
        element.innerText = '';
    });
}
function validation(){
    var isValidationCount= 0;

    let fname  = fieldCheck('fname','fname_err', 'First name is required');
    if(fname > 0){
        isValidationCount++;
    }
    let dob  = fieldCheck('dob','dob_err', 'Date of birth is required');
    if(dob > 0){
        isValidationCount++;
    }
    let gender  = fieldCheck('gender','gender_err', 'Gender is required');
    if(gender > 0){
        isValidationCount++;
    }
    let contact_number  = fieldCheck('contact_number','contact_number_err', 'Contact number is required');
    if(contact_number > 0){
        isValidationCount++;
    }
    let email  = fieldCheck('email','email_err', 'Email is required');
    if(email > 0){
        isValidationCount++;
    }
    return isValidationCount;
}

function fieldCheck(fieldName, errorElement, errorMessage){
    var field = document.getElementById(fieldName);
    var error_field = document.getElementById(errorElement)
    error_field.innerText = '';

    if(field.value == '' || !field && fieldName != 'address'){
        error_field.innerText = errorMessage;
        return 1;
    }else{
        const phonePattern = /^[0-9]{10}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!phonePattern.test(field.value) && fieldName == 'contact_number') {
            error_field.innerText = "Phone number must contain exactly 10 digits.";
            return 1;
        }
        if (!emailPattern.test(field.value) && fieldName == 'email') {
            error_field.innerText = "Please enter a valid email address.";
            return 1;
        }
        if(fieldName == 'address'){
            if (field.value.length > 200) {
                error_field.innerText = errorMessage;
                return 1;
            }
        }
    
    }
    return 0;
}
var data = [];
var count = 0;
var editIndex = undefined;
form.addEventListener("submit", function (event) {
    event.preventDefault();
    let message = 'Record added successfully';
    let isValid = validation();
    if(isValid > 0){
        return;
    }
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    const not_data_row =document.getElementById("no_data_row");  
    if(data.length <= 0){
        not_data_row.remove();
    }
    if(editIndex != undefined){
        data.splice(editIndex,1);
        message = 'Record updated successfully'
    }
    data.push(values);
    appendTableData(data);
    resetForm();
    hideShowBlock('block', 'none');
    document.getElementById('model-content').innerText = message;
    modelOpenClose('block');
});

function appendTableData(tableData){
    const studentTable = document.getElementById('tbody');  
    var html = ``;
    tableData.map((values,index) => {
        html += `<tr>
        <td>${index+1}</td>
        <td>${values.fname}</td>
        <td>${values.lname}</td>
        <td>${values.dob}</td>
        <td>${values.gender}</td>
        <td>${values.contact_number}</td>
        <td>${values.email}</td>
        <td>${values.address}</td>
        <td> 
            <div class="action">
            <button class="action-btn action-btn-edit" onclick="editRecord(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /> <path d="M18.5 2.5a2.1 2.1 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /> </svg>
            </button>   
            <button class="action-btn action-btn-delete" onclick="deleteRecord(${index})">   
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M3 6h18" /> <path d="M8 6V4h8v2" /> <path d="M19 6l-1 14H6L5 6" /> <path d="M10 11v6" /> <path d="M14 11v6" /> </svg>
            </button>
            </div>
        </td>
        </tr>`
    })
    studentTable.innerHTML = html;
}

function modelOpenClose(type){
    const modelOverlay = document.querySelector('.overlay');
    modelOverlay.style.display = type;
}
function deleteRecord(index){

    const studentTable = document.getElementById("tbody"); 
    const updatedRows = data.filter((_, i) => i !== index);
    appendTableData(updatedRows);
    data.splice(index,1);
    if(data.length <= 0){
        let row =`<tr id="no_data_row"><td colspan="10" style="text-align:center">No Records found</td></tr>` 
        studentTable.innerHTML = row;
    }
    document.getElementById('model-content').innerText = 'Record deleted successfully';
    modelOpenClose('block');
}

function editRecord(index){
    const editData = data[index];
    const field = ['fname', 'lname', 'dob', 'gender', 'contact_number', 'email', 'address'];
    editIndex = index;
    console.log('edit data: ', editData);
    field.map((element) => (  assignValue(element, editData[element])));
    hideShowBlock('none','block');
}
function assignValue(fieldName, value){
    document.getElementById(fieldName).value = value;
}