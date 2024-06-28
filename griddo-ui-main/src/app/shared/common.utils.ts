export class Util {

    public static ConvertDateTime = (date) => {
        var dt = new Date(date);
        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
        return dt;
    }

    public static GetISODate(val: any) {
        let date = Util.ConvertDateTime(val);
        return date.toISOString();
    }
}