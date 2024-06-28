import axios from 'axios';
import account from '../Utility/URIConstants/Account'
import Constants from 'expo-constants';
import moment from 'moment';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { combineReducers } from 'redux';

export default class IncidentService {

    static async inidentIntialzie(token, tenantid, languageid, userid) {
        return await axios.get(`${this.config.apiEndPoint}${account.INCIDENT_INTIALIZE}`,
            {
                params: { tenantId: tenantid, languageId: languageid, userId: userid },
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }

    // static async uploadIncidentDocuments(id, formdata, userid, tenant) {
    //     return await axios({
    //         url: `${this.config.apiEndPoint}${account.INCIDENT_DOCS}`, method: 'POST',
    //         headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/x-www-form-urlencoded' },
    //          params: { incidentID: id, userId: userid, tenantId: tenant }, data: formdata
    //     })
    //     .then((response) => {return response})
    //     .catch(function(error) {
    //        return Promise.reject(error); 
    //       });
    // }


    static async uploadIncidentDocuments(id, formdata, userid, tenant) {
        return axios.post(`${this.config.apiEndPoint}${account.INCIDENT_DOCS}`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }, params: { incidentID: id, userId: userid, tenantId: tenant }
        })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }

    static async getIncidentSites(userid, tenantid, languageid, searchkey, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.INCIDENT_SITES}`,
            {
                params: { userId: userid, tenantId: tenantid, languageId: languageid, searchKey: searchkey },
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            },
        )
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }

    static async getIncidentBUnits(userid, tenantid, languageid, searchkey, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.INCIDENT_BUNITS}`,
            {
                params: { userId: userid, tenantId: tenantid, languageId: languageid, searchKey: searchkey },
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            },
        )
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }

    static async saveIncident(incidentID, token, desc, inidentdate, inidenttime, sites, bunit, impacts, activity, newsite, newbunit, newactivity, activityname, Latitude, Longitude ,ParentBusinessUnitID ,ParentSiteID ,HasMapCoordinates) {
        const bunitparamerter = newbunit ? "BusinessUnitName" : "BusinessUnitId";
        const siteparamerter = newsite ? "SiteName" : "SiteId"
        var info = {
            IncidentID: incidentID, ShortDescription: desc,
            Date: inidentdate, Time: inidenttime, [siteparamerter]: sites, [bunitparamerter]: bunit, Impact: impacts, Activity: activity, IsNewSite: newsite, IsNewBUnit: newbunit,
            IsNewActivity: newactivity, ActivityName: activityname,
            Latitude: Latitude,
            Longitude: Longitude,
            ParentBusinessUnitID,
            ParentSiteID,
            HasMapCoordinates:HasMapCoordinates
        }
        return await axios.post(`${this.config.apiEndPoint}${account.ADD_UPDATE_INCIDENT}`, info, {
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
        })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }


    static async saveIncidentAdditionalDetails(modal ,token) {
        var info = modal
        return await axios.post(`${this.config.apiEndPoint}${account.ADD_ADDITIONAL_DETAIL}`, info , {
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
        })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }


    static async getIncidents(incidentid, searchkeyword, startDate, endDate, impacts, selectedImpacts, status, selectedStatus, pageno, pagesize, initialize, token,
        businessUnit, selectedbusinessUnit, site, selectedsite, significant, selectedSignificant,
        injuryandIllnessType,selectedinjuryandIllnessType,category,selectedcategory,hazard,selectedhazard ,hazardType , selectedHazardType ,apiType ,openIncident
    ) {
        console.log("avvavavava")
        parameter = ["Permanent Damage", "Contractor", "Spill", "Vehicle", "Incident Locked"];
        if (incidentid > 0)
            parameter.push("IncidentId");

        if (searchkeyword.length > 0)
            parameter.push("Keyword");

        if (startDate.trim() !== '')
            parameter.push("Incident Date");

        if (status.trim() !== '')
            parameter.push("Status");

        if (impacts.length > 0)
            parameter.push("Impact");

        if (businessUnit.length > 0)
            parameter.push("Business Unit");

        if (site.length > 0)
            parameter.push("Site");

        if (significant.length > 0)
            parameter.push("Is Significant");
        if (injuryandIllnessType.length > 0)
            parameter.push("Type");
        if (category.length > 0)
            parameter.push("Injury Category");
        if (hazardType.length > 0)
            parameter.push("Hazard Type");
         if (hazard.length > 0)
            parameter.push("Hazard");    
        const filterarray = [];
        var hazardValues= ""
        var siteValues= ""

        for (let index = 0; index < parameter.length; index++) {
            const model = {
                Name: '',
                Values: [],
                DisplayValues: []
            };
            const valueobject = {};
            const displayObject = {}
            switch (parameter[index]) {
                case "IncidentId":
                    valueobject = parseInt(incidentid);
                    displayObject = parseInt(incidentid);
                    break;
                case "Keyword":
                    valueobject = searchkeyword;
                    displayObject = searchkeyword;
                    break;
                case "Incident Date":

                    displayObject = moment(startDate, 'DD/MM/YYYY').format('DD MMMM YYYY') + " - " +
                        moment(endDate, 'DD/MM/YYYY').format('DD MMMM YYYY');

                    let startDateUtcFormat = moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    startDateUtcFormat = (new Date(startDateUtcFormat)).toISOString();
                    let endDateUtcFormat = moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    endDateUtcFormat = (new Date(endDateUtcFormat)).toISOString();
                    model.Values[0] = startDateUtcFormat;
                    model.Values[1] = endDateUtcFormat;
                    break;
                case "Impact":
                    for (let item = 0; item < selectedImpacts.length; item++) {
                        valueobject = selectedImpacts[item];
                        model.Values[item] = parseInt(valueobject);
                    }
                    displayObject = impacts.toString();
                    break;
                case "Status":
                    for (let statusValue = 0; statusValue < selectedStatus.length; statusValue++) {
                        valueobject = parseInt(selectedStatus[statusValue]);
                        model.Values[statusValue] = valueobject;
                    }
                    displayObject = status.toString();
                    break;
                case "Business Unit":
                    for (let bunit = 0; bunit < selectedbusinessUnit.length; bunit++) {
                        valueobject = parseInt(selectedbusinessUnit[bunit]);
                        model.Values[bunit] = valueobject;
                    }
                    displayObject = businessUnit.toString();
                    break;
                case "Site":
                    if (apiType != "MapView") {
                        for (let i = 0; i < selectedsite.length; i++) {
                            valueobject = parseInt(selectedsite[i]);
                            model.Values[i] = valueobject;
                        }
                        displayObject = site.toString();
                    }else{
                         siteValues = selectedsite.join(', ').toString();
                        // displayObject = site.toString();
                    }
                    
                     break;
                case "Is Significant":
                    for (let i = 0; i < selectedSignificant.length; i++) {
                        valueobject = parseInt(selectedSignificant[i]);
                        model.Values[i] = valueobject;
                    }
                    displayObject = significant.toString();
                    break;
                case "Type":
                    for (let i = 0; i < selectedinjuryandIllnessType.length; i++) {
                        valueobject = parseInt(selectedinjuryandIllnessType[i]);
                        model.Values[i] = valueobject;
                    }
                    displayObject = injuryandIllnessType.toString();
                    break;
                case "Injury Category":
                    for (let i = 0; i < selectedcategory.length; i++) {
                        valueobject = parseInt(selectedcategory[i]);
                        model.Values[i] = valueobject;
                    }
                    displayObject = category.toString();
                    break;
                case "Hazard Type":
                    for (let i = 0; i < selectedHazardType.length; i++) {
                        valueobject = parseInt(selectedHazardType[i]);
                        model.Values[i] = valueobject;
                    }
                    displayObject = hazardType.toString();
                    break;
                case "Hazard":
                    hazardValues = selectedhazard.join(', ').toString();
                    displayObject = hazardType.toString();
                    break;

                default:
                    valueobject = 2;
                    displayObject = 'Any,'
            }
            // 
            model.Name = parameter[index];
            model.DisplayValues.push(displayObject);
            if (model.Name !== "Hazard" && model.Name !== "Type" && model.Name !== "Injury Category" && model.Name !== "Hazard Type" && model.Name !== "Is Significant" &&  model.Name !== "Status" && model.Name !== "Business Unit" && model.Name !== "Site"  && (model.Name !== "Impact" && model.Name !== "Incident Date")) {
                model.Values.push(valueobject);
            }
            parameter[index] == "IncidentId" ? model.ValueSelected = true : false;
            filterarray.push(model);
        }

        console.log(apiType ,filterarray)
        if(apiType == "excelfile"){
            return await axios.get(`${this.config.apiEndPoint}${account.EXPORT_EXCEL}`, {
                params: {
                    filterArray: filterarray,hazardValues :hazardValues
                },
                headers: { 'Content-Type': 'application/json', 'Authorization': token, 'charset': 'UTF-8' }
            })
                .then((response) => {
                    return response
                })
                .catch(function (error) {
                    return Promise.reject(error);
                });
        }
        else if (apiType == "MapView"){
            const IsClusterMapData = filterarray.length == 5 ? false : true
           //const totalResuit = 0
            return await axios.get(`${this.config.apiEndPoint}${account.GET_CLUSTER_MAP_INCIDENTS}`, {
                params: {
                    filterArray: filterarray,hazardValues :hazardValues , totalResuit:0 
                    ,IsClusterMapData :IsClusterMapData ,siteValues:siteValues
                },
                headers: { 'Content-Type': 'application/json', 'Authorization': token, 'charset': 'UTF-8' }
            })
                .then((response) => {
                    return response
                })
                .catch(function (error) {
                    return Promise.reject(error);
                });
        }
        else{
            return await axios.get(`${this.config.apiEndPoint}${account.SEARCH_INCIDENT}`, {
                params: {
                    filterArray: filterarray, page: pageno, pageSize: pagesize,
                    initialData: initialize ,hazardValues :hazardValues ,openIncident:openIncident
                },
                headers: { 'Content-Type': 'application/json', 'Authorization': token, 'charset': 'UTF-8' }
            })
                .then((response) => {
                    return response
                })
                .catch(function (error) {
                    return Promise.reject(error);
                });
        }
    }

    static async getIncidentById(incidentID, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.GET_INCIDENT}`,
            {
                params: { id: incidentID},
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async getAdditionalDetails(incidentID, token ) {
        return await axios.get(`${this.config.apiEndPoint}${account.GET_ADDITIONAL_DETAIL}`,
            {
                params: { incidentId: incidentID},
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    } 
    static async deleteIncidentDocuments(incidentDocumentID, documentID, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.DELETE_DOCUMENT}`,
            {
                params: {
                    incidentDocumentID: incidentDocumentID, documentID: documentID,
                },
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async IncidentClosed(incidentID, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.INCIDENT_CLOSED}`,
            {
                params: {
                    incidentID: incidentID
                },
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async impactDetailData(token, IncidentId) {
        return await axios.get(`${this.config.apiEndPoint}${account.IMPACT_DETAILS_DATA}`,
            {
                params: {
                    IncidentId: IncidentId
                },
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            },
        )
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async saveImpact(token, Impactmodelvalues, incidentId) {
        return await axios.get(`${this.config.apiEndPoint}${account.ADD_UPDATE_IMPACT}`,
            {
                params: { model: Impactmodelvalues, incidentId: incidentId },
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            },
        )
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async actionList(incidentId, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.ACTION_LIST}`,
            {
                params: { Id: incidentId, type: 1 },
                headers: { 'Content-Type': 'application/json', 'Authorization': token },
            })
            .then((response) => {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async actionData(incidentId, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.ACTION_DATA}`,
            {
                params: { Id: incidentId, type: 1 },
                headers: { 'Content-Type': 'application/json', 'Authorization': token },
            })
            .then((response) => {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async getAction(incidentId, actionid, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.GET_ACTION}`,
            {
                params: { actionId: actionid, type: 1, Id: incidentId },
                headers: { 'Content-Type': 'application/json', 'Authorization': token },
            })
            .then((response) => {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async searchUsers(FirstName, LastName, Email, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.SEARCH_USER}`,
            {
                params: { FirstName: FirstName, LastName: LastName, Email: Email },
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async AddAction(actionModal, modal, incidentId, actionid, token ,type ,sitename,BUnit,IsNewSite,IsNewBUnit) {
        var hierarchyOfControlsIdvalue;
        var impactsIdModal = [];
        if (actionModal.hierarchyOfControlsId === undefined || actionModal.hierarchyOfControlsId.length == 0) {
            hierarchyOfControlsIdvalue = 0
        } else {
            hierarchyOfControlsIdvalue = actionModal.hierarchyOfControlsId
        }
        if (actionModal.actionid > 0) {

            for (index in modal.impactsId) {
                var findIndex = actionModal.oldActionImpacts.findIndex(x => x.Id == modal.impactsId[index]);
                if (findIndex == -1) {
                    impactsIdModal.push({
                        Id: modal.impactsId[index],
                        IsAdded: true
                    })
                }
                else {
                    impactsIdModal.push({
                        Id: modal.impactsId[index],
                        IsAdded: false
                    })
                }
            }
        } else {
            for (index in modal.impactsId) {
                impactsIdModal.push({
                    Id: modal.impactsId[index],
                    IsAdded: true
                })
            }
        }
       var id = Number.isNaN(parseInt(incidentId)) ? 0 :incidentId;
        return await axios.get(`${this.config.apiEndPoint}${account.ADD_ACTION}`,
            {
                params: { IncidentID: parseInt(id), actionid: parseInt(actionid), Description: modal.description, ResponsibleUserID: parseInt(actionModal.ResponsibleUserID), ResponsibleUser: actionModal.ResponsibleUser, CheckerUserID: parseInt(actionModal.CheckerUserID), CheckerUser: actionModal.CheckerUser, DueDate: actionModal.datatime, HierarchyOfControlID: parseInt(hierarchyOfControlsIdvalue), impactsId: impactsIdModal, ActionSourceID: actionModal.ActionSourceID ,IsLongTerm: false ,LongTermReasonID: parseInt(actionModal.LongTermReasonID[0]),type, sitename:sitename,BUnit:BUnit,ActionReason: actionModal.descriptionAction,IsNewSite:IsNewSite,IsNewBUnit:IsNewBUnit,BusinessUnitName:BUnit,SiteID: parseInt(actionModal.selectedSite) ,BusinessUnitID: parseInt(actionModal.selectedBussinessUnit) , ParentBusinessUnitID:parseInt(actionModal.ParentBusinessUnitID)  ,ParentSiteID:parseInt(actionModal.ParentSiteID) },
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async updateActionProgress(ActionProgressvalues, type,token) {
        return await axios.get(`${this.config.apiEndPoint}${account.ADD_UPDATE_ACTIONPROGRESS}`, {
            params: { model :ActionProgressvalues ,type:type},
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
        })
            .then((response) => {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });

    }
    static async getInvolvedPersonList(incidentID, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.GET_INVOLVED_PERSONS}`,
            {
                params: {incidentId: incidentID},
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async getInvolvedPersonRoles(token) {
        return await axios.get(`${this.config.apiEndPoint}${account.GET__INVOLVED_PERSON_ROLES}`,
            {
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async addInvolvedPerson(modal ,token) {
        var info = modal
        return await axios.post(`${this.config.apiEndPoint}${account.ADD_INVOLVED_PERSONS}`, info , {
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
        })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async addNewVendor(modal ,token) {
        var info = modal
        return await axios.post(`${this.config.apiEndPoint}${account.SAVEVENDOR}`, info , {
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
        })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async investigationData(incidentID, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.INVESTIGATION_DATA}`,
            {
                params: { incidentID: parseInt(incidentID)},
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async addUpdateinvestigation(modal ,token) {
        var info = modal
        return await axios.post(`${this.config.apiEndPoint}${account.ADD_UPDATE_INVESTIGATION}`, info , {
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
        })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async injuryAndIllnessUserlist(incidentID, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.INJURYANDILLNESSUSER_LIST}`,
            {
                params: { incidentID: parseInt(incidentID)},
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async injuryAndIllnessIntialize(incidentID, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.INJURYANDILLNESS_INTIALIZE}`,
            {
                params: { incidentID: parseInt(incidentID)},
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async getInjuryAndIllness(injuryillId,incidentID, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.GET_INJURYANDILLNESS}`,
            {
                params: {injuryillId:parseInt(injuryillId) ,incidentID: parseInt(incidentID)},
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async addUpdateInjuryIllness(modal ,token) {
        var info = modal
        return await axios.post(`${this.config.apiEndPoint}${account.ADD_UPDATE_INJURYANDILLNESS}`, info , {
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
        })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async deleteInjuryAndIllness(injuryillId,incidentID, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.DELETE_INJURYANDILLNESSUSER}`,
            {
                params: {injuryillID:parseInt(injuryillId) ,incidentID: parseInt(incidentID)},
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            })
            .then((response) => { return response })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static get config() {
        return Constants.manifest.extra;
    }
}

