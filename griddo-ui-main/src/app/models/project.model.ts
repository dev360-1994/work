



export interface IskipUnits {
    id?: number;
    projectId?: number;
    skiptext?: string,
    skipId: number,
    f: string,
    startFrom: boolean,
    endFrom: boolean,
    number: number,
    has:boolean,
    type?: 'stack' | 'floor',
    checked?: boolean
}
export class Project {
    projectId!: number;
    projectName!: string;
    builderName!: string;
    projectType!: string;
    address!: string;
    city!: string;
    country!: string;
    zipCode!: string;
    email!: string;
    phoneNumber!: string;
    workingHour!: string;
    logo!: string;
    heroImage!: string;
    startDate!: Date;
    completionDate!: Date;
    buildingHeight!: string;
    buildingHeightUnit!: string;
    province!: string;
    buildingDescription!: string;
    websiteUrl!: string;
    miniSiteURL!: string;
    projectStatus!: string;
    currentIncentive!: string;
    landscaping!: Landscaping[];
    architects!: Architect[];
    interiorDesigners!: InteriorDesigner[];
    marketingCompany!: MarketingCompany[];
    addAgency!: AddAgency[];
    amenities!: Amenity[];
    featuresAndFinishes!: FeaturesAndFinish[];
}
class Architect {
    createdBy!: string;
    createdDate!: Date;
    lastModifiedBy!: string;
    lastModifiedDate!: Date;
    architectId!: number;
    projectId!: number;
    email!: string;
}

class InteriorDesigner {
    projectId!: number;
    interiorDesignerId!: number;
    email!: string;
    createdBy!: string;
    createdDate!: Date;
    lastModifiedBy!: string;
    lastModifiedDate!: Date;
}

class MarketingCompany {
    marketingCompanyId!: number;
    email!: string;
    projectId!: number;
    createdBy!: string;
    createdDate!: Date;
    lastModifiedBy!: string;
    lastModifiedDate!: Date;

}

class Landscaping {
    landscapingId!: number;
    email!: string;
    projectId!: number;
    createdBy!: string;
    createdDate!: Date;
    lastModifiedBy!: string;
    lastModifiedDate!: Date;
}

class AddAgency {
    addAgencyId!: number;
    email!: string;
    projectId!: number;
    createdBy!: string;
    createdDate!: Date;
    lastModifiedBy!: string;
    lastModifiedDate!: Date;
}

class Amenity {
    addAgencyId!: number;
    items!: string;
    projectId!: number;
    createdBy!: string;
    createdDate!: Date;
    lastModifiedBy!: string;
    lastModifiedDate!: Date;
}

class FeaturesAndFinish {
    featuresAndFinishesId!: number;
    items!: string;
    projectId!: number;
    createdBy!: string;
    createdDate!: Date;
    lastModifiedBy!: string;
    lastModifiedDate!: Date;
}
class DepositStructure {
    projectDepositStructureId?: number;
    projectid?: number;
    depositType?: string;
    unitType?: string;
    typeOfDeposit?: string;
    amount?: string;
    time?: string;
    dueOn?: Date;
    installmentType?: string;
    numOfInstallments?: string;
}
class projectUnit {
    projecUnitDetailId?: number;
    projectId?: number;
    totalNumberOfUnits?: number;
    numberOfParking?: number;
    numberOfLockers?: number;
    numberOfBikeStorage?: number;
    numberOfFloors?: number;
    typeOfUnit?: number;
    totalFloorPlans?: number;
}
class ProjectUnitDetails {
    projecUnitId?: number;
    projectId?: number;
    unitno?: number;
    legalNo?: string;
    legalfloor?: number;
    floorplanname?: string;
    size?: number;
    balconysize?: number;
    terracesize?: number;
    noBalcony?: number;
    julietBalcony?: number;
    totalSize?: number;
    bedrooms?: number;
    bathrooms?: number;
    bedroomSize?: number;
    livingRoomSize?: number;
    diningRoomSize?: number;
    denSize?: number;
    view?: string;
    ceilingHeight?: number;
    barrierFree?: number;
    floorPremium?: number;
    floors?: number;
    level?: number;
    openingPrice?: number;
    currentPrice?: number;
    eligibleForParking?: boolean;
    eligibleForlocker?: boolean;
    eligibleForstorage?: boolean;
    uploadFloorPlanJPGPath?: string;
    uploadFloorPlanPDFPath?: string;
}

class depositStructure {
    projectDepositStructureId?: number;
    projectid?: number;
    depositType?: string;
    unitType?: string;
    typeOfDeposit?: string;
    amount?: string;
    time?: string;
    dueOn?: Date;
    installmentType?: string;
    numOfInstallments?: string;
}


