import message from './Message';
export default class Validation {
    static resultModel = { message: '', status: false };
    static errorfound = false;
    static checkFieldIsNullOrEmpty(model) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        for (let values in model) {
            const value = model[values];
            switch (typeof value) {
                case 'string':
                    if (value == null || value == "") {
                        this.resultModel.message = `${message.errorMessage[values]}` + " is requried field."
                        this.errorfound = true
                        break;
                    } 
                     if ((values.indexOf("mail") > -1) && (reg.test(value) === false)) {
                        this.resultModel.message = `${message.errorMessage[values]}` + " is not a valid address."
                        this.errorfound = true
                        break;
                    }
                    break;
                case 'number':
                    if (value == null || value == "" || value == 0) {
                        this.errorfound = true
                        break;
                    }
                    break;
                case 'array':
                    if (value.length == null || value.length == "" || value.length == 0) {
                        this.resultModel.message = `${message.errorMessage[values]}` + " is requried field."
                        this.errorfound = true
                        break;
                    }
                    break;
                case 'object':
                    if (value.length == null || value.length == "" || value.length == 0) {
                        this.resultModel.message = "Please select " + `${message.errorMessage[values]}`;
                        this.errorfound = true
                        break;
                    }
                    break;
                default:
                    break;
            }
            if (this.errorfound)
                break;
        }

        this.resultModel.status = this.errorfound ? false : true;
        this.errorfound = false
        return this.resultModel;

    }


    static checkFieldIsUndefinedOrEmpty(model) {
        for (let values in model) {
            const value = model[values];
            if (value == undefined || value.length < 0 || value== "" || value == null) {
                this.resultModel.message = `${message.additionalPageError[values]}` + " is required.";
                this.errorfound = true
            }
            if (this.errorfound)
                break;
        }
        this.resultModel.status = this.errorfound ? false : true;
        this.errorfound = false
        return this.resultModel;

    }
}