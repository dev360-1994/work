import { ExtraAvailableType } from "../enums/allEnum.enum";

export class PriceCalculation {

    static extraUnitPriceArr: any = [];

    public static UnitPriceCalculation(projectData: any) {

        this.extraUnitPriceArr = [];

        projectData?.unitTower?.projectTowerLockers?.forEach(item => {
            this.checkExtraPriceCondition(item, projectData);
        });
        projectData?.unitTower?.projectTowerParkings?.forEach(item => {
            this.checkExtraPriceCondition(item, projectData);
        });

        const extraPriceTotal = this.extraUnitPriceArr?.reduce((accum, item) => item.isSelected ? accum + parseFloat(item.amount) : accum, 0)
        let amount = 0;
        let taxAmount = 0;
        let taxTotal = 0;
        amount = (projectData?.flatDetail?.price ?? 0) + (projectData?.flatDetail?.floorPremium ?? 0) + extraPriceTotal;

        taxTotal = projectData?.project?.projectTax?.reduce((accum, item) => accum + parseFloat(item.value), 0)
        if (taxTotal > 0) {
            taxAmount = parseInt(((amount / 100) * taxTotal).toFixed());
            amount += taxAmount;
        }
        return { amount, taxAmount, taxTotal, extraUnitPriceArr: this.extraUnitPriceArr };
    }

    public static checkExtraPriceCondition(item: any, projectData: any) {
        let isConditionMatched = false;
        if (item.availableto === ExtraAvailableType.AllUnit) {
            isConditionMatched = true;
        } else if (item.availableto === ExtraAvailableType.UnitType) {
            const unitTypeOptions = item.unitTypeOptions.split(',');
            if (unitTypeOptions.some(x => x == projectData?.flatDetail?.unitType)) {
                isConditionMatched = true;
            }
        } else if (item.availableto === ExtraAvailableType.UnitSizeAbove) {
            if (((projectData.flatDetail?.balconySize ?? 0) + (projectData.flatDetail?.interiorSize ?? 0)) > item.unitSizeinSqft) {
                isConditionMatched = true;
            }
        } else if (item.availableto === ExtraAvailableType.PriceAbove) {
            if (projectData?.flatDetail?.price > item.price) {
                isConditionMatched = true;
            }
        }

        if (isConditionMatched) {
            if (item.included) item.isSelected = true;
            this.extraUnitPriceArr.push(item);
        }
    }
}