const loginMessages = {
    login_success: 'Login successful.',
    email_empty: 'The Email field is required.',
    password_empty: 'The Password field is required.',
    password_length: 'The Password length should be 6 character long.',
    confirmpassword_empty: 'The confirm password field is required.',
    wrong_email: 'The Email Address field is not a valid e-mail address.',
    new_password: "We have sent a reset password link to your email address. Please follow the instructions in the email to reset your password.",
    wrong_credentials: "Invalid username or password.",
    mismatch_password: "Password mismatch",
    firstName_empty: 'The first name field is required.',
    lastName_empty: 'The last name field is required.',
    companyName_empty: 'The company name field is required.',
    newuser_success: 'User created successfully.',
    phone_length:'Phone number should be contain minimum 10 charcter.'
}
const incidentMessages = {
    searchtext_length: 'Please enter at least 3 characters for search..',
    newoption_length: 'Option should have minimum 4 characters.',
    empty_incidentsearch: 'Please enter incident number or any keyword to get search results',
    special_keyword: "Keyword can't contains the special characters",
    no_result: "No result found...",
    upload_docs: "Now uploading documents. Please wait.."
}
const permissionErrors = {
    custom_Permission: "Please provide the camera roll and camera permission to the application by going setting of device.",
}

const net_connection = 'No internet connection found.';
const internal_error = "Internal server error. Please try again later.";
const timeout_error = "Network timeout error. Please try again later.";
const page_not_found_error = "Page not found. Please try again later.";
const required = " field is required";
const min_Date = new Date("2011-05-01");
const image_extension = ['gif', 'jpg', 'jpeg', 'png'];
const docs_extension = ['docx', 'doc', 'pdf', 'xlsx', 'xlsm', 'xltx', 'txt', 'msg', 'htm', 'bmp', 'ppt', 'pptx', 'XLS'];
const invalid_image = "Image type not supported.";
const invalid_docs = "Document type not supported.";
const undefined_extension = "Document you have selected is not valid document."

const errorMessage = {
    "1description": 'Description',
    "2selectedSite": 'Site',
    "3selectedBussinessUnit": 'Business Unit',
    "4selectedImpacts": 'Impacts',
    "5selectedActivities": 'Activities',
    email: 'Email ID',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    company: 'Company',
    'Reason': 'Reason',
    'Site': 'Site',
    'Business Unit': 'Business Unit',
    'description': 'Description',
    'date': 'Due date',
    "impactsId": 'Impact ',
    'Email': 'Email',
    currentPassword:'Current Password',  
    newPassword:'New Password',
    confirmnewPassword:'Confirm Password',
}

const actionMessage = {
    "responsibleUser": 'Responsible user is required.',
    "checkerUser": 'Checker user is required.',
    'Reason': 'Reason is required.',
    'Site': 'Site is required.',
    'Business': 'Business Unit is required.',
    'message': 'Action is added successfully',
    'LongTermReason':'Long Term Reason is required.'
}

const impactMessage = {
    'actualConsequence': 'Actual consequence is required.',
    'consequence': 'Max Reasonable consequence is required.',
    'likehood': 'Max Reasonable likelihood is required.',
    'actualConsequenceCheck': 'Max Reasonable consequence cannot be lower than the Actual consequence.'
}

const additionalPageError = {
    'contractorTypesListSelected': 'Type of Contractor',
    'contractorVendorsListSelected': 'Vendor Involved',
    'newcontractorVendorsListSelected': 'Vendor Involved',
    'contractorInvolvementSelected': 'Level of Involvement',
    'spillTypesListSelected': 'Spill Type',
    'spillCausesListSelected': 'Spill Cause',
    'spillSourcesListSelected': 'Spill Source ',
    'unitOfMeasuresListSelected1': 'Spill Amount Unit',
    'unitOfMeasuresListSelected2': 'Amount Recovered Unit',
    'vehicleTypesListSelected': 'Vehicle Type ',
    'vehicleTypesListSelected': 'Vehicle Type ',
    'SpillAmount':'Spill Amount',
    'SpillAmountRecovered':'Amount Recovered',
    'ReportableTosListSelected':'Reportable To '

}



export default {
    loginMessages, incidentMessages, permissionErrors, net_connection, internal_error, required, min_Date, image_extension,
    docs_extension, invalid_image, invalid_docs, page_not_found_error, timeout_error, errorMessage, undefined_extension, impactMessage, actionMessage,
    additionalPageError
};
