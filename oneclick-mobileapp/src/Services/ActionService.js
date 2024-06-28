import axios from 'axios';
import account from '../Utility/URIConstants/Account';
import utils from '../Utility/constants';
import Constants from 'expo-constants';

export default class ActionService {

    static async getActions(actionfilter, page, pageSize,initialize, token , apiType ,overDueAction) {
        if(apiType == "excelfile"){
            return await axios.get(`${this.config.apiEndPoint}${account.ACTION_EXPORT_EXCEL}`, {
                params: { model:actionfilter},
                headers: { 'Content-Type': 'application/json', 'Authorization': token, 'charset': 'UTF-8' }
            })
                .then((response) => {
                    return response
                })
                .catch(function (error) {
                    return Promise.reject(error);
                });
        }
        else if (apiType == "openActionOverdue"){
            return await axios.get(`${this.config.apiEndPoint}${account.Get_Open_Action_Overdue}`,
            {
                params: {initialData: initialize,page: page, pageSize: pageSize ,overDueAction:overDueAction },
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            },
        )
            .then((response) => {
               
                return response
            })
            .catch(function (error) {
               
                return Promise.reject(error);
            });}
        else{
        return await axios.get(`${this.config.apiEndPoint}${account.SEARCH_ACTION}`,
            {
                params: { model:actionfilter,initialData: initialize, page: page, pageSize: pageSize  },
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            },
        )
            .then((response) => {
               
                return response
            })
            .catch(function (error) {
               
                return Promise.reject(error);
            });}
    }
    static async GetChildBusinessUnits( id ,token) {
        return await axios.get(`${this.config.apiEndPoint}${account.GET_CHILDBUSINESSUNITS}`,
            {
                params: { bussinessUnitId:id ,IncludeInActive: false},
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            },
        )
            .then((response) => {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static async GetChildSites(id, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.GET_CHILDSITES}`,
            {
                params: {siteId:id , IncludeInActive:false },
                headers: { 'Content-Type': 'application/json', 'Authorization': token }
            },
        )
            .then((response) => {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
    static get config() {
        return Constants.manifest.extra;
    }
}