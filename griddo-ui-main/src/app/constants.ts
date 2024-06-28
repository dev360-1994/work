import { ActivatedRouteSnapshot } from "@angular/router";
import { User } from "./models/user.model";

export class CONSTANT {
  public static userTokenKey = "79ads89asd7asd9as8d";
  public static setUser = (user: any) => {
    user = { ...user, ...CONSTANT.getRole(user) }
    window.localStorage.setItem(CONSTANT.userTokenKey, window.btoa(JSON.stringify(user)));
  }

  public static getRole = (user) => {
    return {
      superadmin: user?.roles?.map(i => i.toLowerCase()).includes('MasterAdmin'.toLowerCase()),
      builder: user?.roles?.map(i => i.toLowerCase()).includes('Builder'.toLowerCase()),
      agent: user?.roles?.map(i => i.toLowerCase()).includes('Agent'.toLowerCase()),
      agency: user?.roles?.map(i => i.toLowerCase()).includes('Agency'.toLowerCase()),
      buyer: user?.roles?.map(i => i.toLowerCase()).includes('Buyer'.toLowerCase()),
    }
  }

  public static rememberme = (rememberme) => {
    if (rememberme) {
      localStorage.setItem('rememberme', 'true');
    }
  }

  public static check_rememberme = (): boolean => localStorage.getItem('rememberme') === 'true';


  public static getUser = (): User => {
    const userTokenInfo = window.localStorage.getItem(CONSTANT.userTokenKey);
    if (userTokenInfo) {
      return JSON.parse(window.atob(userTokenInfo)) as User;
    }
    return null as unknown as User;
  }

  public static updateCurrentRole = (role: any) => {
    const userTokenInfo = window.localStorage.getItem(CONSTANT.userTokenKey);
    if (userTokenInfo) {
      var user = JSON.parse(window.atob(userTokenInfo)) as User;
      user.role = role;
      window.localStorage.setItem(CONSTANT.userTokenKey, window.btoa(JSON.stringify(user)));
    }
    return true;
  }

  public static logout() {
    window.localStorage.clear();
    window.location.href = '/';
  }

  public static find_params_in_activated_route = (name: string, snapshot: ActivatedRouteSnapshot, fromChilde = false): any => {
    if (!fromChilde) {
      if (name && snapshot?.params && snapshot?.params[name]) {
        return snapshot?.params[name];
      } else if (name && snapshot.parent) {
        return CONSTANT.find_params_in_activated_route(name, snapshot.parent, fromChilde);
      }
      return '';
    } else {
      if (name && snapshot?.params && snapshot?.params[name]) {
        return snapshot?.params[name];
      } else if (name && snapshot?.children?.length && snapshot.children[0]?.firstChild) {
        return CONSTANT.find_params_in_activated_route(name, snapshot.children[0]?.firstChild, fromChilde);
      }
      return '';
    }
  }

  public static capitalizeFirstLetter = (str: string): string => (str || '')?.charAt(0)?.toUpperCase() + (str || '')?.slice(1)

  public static buildFormData = (formData: FormData, data: any, parentKey?: any) => {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach(key => {
        const __key: any = CONSTANT.capitalizeFirstLetter(key);
        let _key = `.${__key}`;
        if (!isNaN(__key)) {
          _key = `[${__key}]`;
        }
        CONSTANT.buildFormData(formData, data[key], parentKey ? `${parentKey}${_key}` : key);
      });
    } else if (parentKey) {
      let value = data == null ? '' : data;
      if (data instanceof Date) {
        value = (data as Date).toISOString();
      }
      const __parentKey: any = CONSTANT.capitalizeFirstLetter(parentKey);
      formData.append(__parentKey, value);
    }
  }

  public static jsonToFormData = (data: any, formData?: FormData): FormData => {
    formData = formData ?? new FormData();
    CONSTANT.buildFormData(formData, data);
    return formData;
  }

  /**
 * prevent enter key
 * @param e - keyboard key down event
 */
  public static KEY_DOWN_EVENT_PREVENT_ENTER_KEY(e) {
    if (e?.keyCode == 13) {
      // alert("enter pressed");
      e?.preventDefault();
    }
  }
}

export const DOC_TYPE = {
  1: 'APS',
  2: 'Worksheet',
  3: 'Amendment 1',
  4: 'Amendment 2'
}

// 0001-01-01T00:00:00+00:00
export const checkNullValueAsStringAndReplaceWithNull = (obj) => {

  if (obj && typeof obj === 'object' && Object.keys(obj).length) {
    Object.keys(obj).forEach(k => {
      if (obj[k] === 'null') {
        obj[k] = null;
      } else if (obj[k] && typeof obj[k] === 'string' && obj[k].startsWith('0001-01')) {
        obj[k] = null;
      } else if (obj[k] === '0') {
        obj[k] = null;
      } else if (typeof obj[k] === 'object' || Array.isArray(obj[k])) {
        obj[k] = checkNullValueAsStringAndReplaceWithNull(obj[k])
      }
    });
  } else if (obj && Array.isArray(obj) && obj.length) {
    obj.forEach(i => {
      if (i === 'null') {
        i = null;
      } else if (i && typeof i === 'string' && i.startsWith('0001-01')) {
        i = null;
      } else if (i === '0') {
        i = null;
      } else if (typeof i === 'object' || Array.isArray(i)) {
        i = checkNullValueAsStringAndReplaceWithNull(i)
      }
    })
  }
  return obj;
}

export const getQueryParameterByName = (name, url = location.href) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  let query = decodeURIComponent(results[2].replace(/\+/g, ' '));
  return query;
}