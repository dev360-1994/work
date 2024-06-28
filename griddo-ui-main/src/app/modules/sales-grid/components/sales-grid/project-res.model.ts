
export interface Architect {
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    architectId: number;
    projectId: number;
    email: string;
}

export interface InteriorDesigner {
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    interiorDesignerId: number;
    projectId: number;
    email: string;
}

export interface MarketingCompany {
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    marketingCompanyId: number;
    projectId: number;
    email: string;
}

export interface Landscaping {
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    landscapingId: number;
    projectId: number;
    email: string;
}

export interface AddAgency {
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    addAgencyId: number;
    projectId: number;
    email: string;
}

export interface Amenity {
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    amenitiesId: number;
    projectId: number;
    amenityValue: number;
}

export interface FeaturesAndFinish {
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    featuresAndFinishesId: number;
    projectId: number;
    items: string;
}

export interface ProjectSkipType {
    id: number;
    skipId: number;
    projectId: number;
}

export interface GeneralSetting {
    projectGeneralSettingId: number;
    numberofTowers: number;
    numberofFloors: number;
    numberofUniqueBlocks: number;
    totalUnits: number;
    sameCeilingHeight: boolean;
    ceilingHeight: string;
    skipFloor: number;
    skipUnit: number;
    projectSkipType: ProjectSkipType[];
    projectId: number;
}

export interface ProjectGridColor {
    id: number;
    colorId: number;
    colorTitle: string;
    colorCode: string;
    colorCodeStatus: string;
    projectId: number;
}

export interface ProjectTax {
    id: number;
    taxType: string;
    value: string;
    isCustomTax: boolean;
    projectId: number;
}

export interface ProjectUnit {
    projecUnitDetailId: number;
    projectId: number;
    totalNumberOfUnits: number;
    numberOfParking: number;
    numberOfLockers: number;
    numberOfBikeStorage: number;
    numberOfFloors: number;
    typeOfUnit: number;
    totalFloorPlans: number;
}

export interface ProjectTowerUnitType {
    unitTypeId: number;
    unitType: string;
    towerId: number;
    isSelected?:boolean;
}

export interface FlatBedRoom {
    bedRoomsId: number;
    flatId: number;
    number: number;
    size: number;
}

export interface FlatbathroomSize {
    bathsId: number;
    flatId: number;
    number: number;
    size: number;
}

export interface FlatterraceSize {
    terraceId: number;
    flatId: number;
    number: number;
    size: number;
}

export interface Flatbalconysize {
    balconyId: number;
    flatId: number;
    number: number;
    size: number;
}

export interface FlatprojectUnitAdditionalFeature {
    additionalFeatureId: number;
    flatId: number;
    name: string;
    isEligible: boolean;
    isIncluded: boolean;
}

export interface FlatdenSize {
    denId: number;
    flatId: number;
    number: number;
    size: number;
}

export interface ProjectUnitFlat {
    unitNo: number;
    price: number;
    interiorSize: number;
    unitName: string;
    balconySize: number;
    floorPremium: number;
    view: number;
    livingRoomSize: number;
    diningRoomSize: number;
    noOfBedroom: number;
    nOofBaths: number;
    terrace: number;
    noofBalcony: number;
    noofDen: number;
    floorPlanJPGPath: string;
    planSchedlePath: string;
    flatId: number;
    flatNo: number;
    flatStatus: string;
    isSingleStackSelected: boolean;
    isSkip: boolean;
    flatBedRooms: FlatBedRoom[];
    flatbathroomSizes: FlatbathroomSize[];
    flatterraceSizes: FlatterraceSize[];
    flatbalconysizes: Flatbalconysize[];
    flatprojectUnitAdditionalFeatures: FlatprojectUnitAdditionalFeature[];
    flatdenSizes: FlatdenSize[];

    // extra
    assignAgentId: number;
    agentName?: string;
    selected?: boolean;
    bgColor?: string;
    visibilityHidden?: boolean;
    floorId?: any
    floorNo?: any
}

export interface ProjectFloorDetail {
    floorId: number;
    floorNo: number;
    projectUnitFlats: ProjectUnitFlat[];
    blockUnitPriceId: number;
}

export interface ProjectBlock {
    blockId: number;
    blockName: string;
    blockNo: number;
    stackName: string;
    isCustomBlock: boolean;
    numberUnitsPerFloor: number;
    startingFloor: number;
    toFloor: number;
    ceilingHeight: number;
    projectFloorDetails: ProjectFloorDetail[];
    projectId: number;
    towerId: number;

    //extra
    count?: string;
}

export interface ProjectTowerParking {
    towerParkingId: number;
    numberOfParkingSlots: number;
    name: string;
    price: number;
    availableto: string;
    unitSizeinSqft: string;
    included: boolean;
    eligible: boolean;
    towerId: number;
}

export interface ProjectTowerLocker {
    towerLockerId: number;
    numberOfLockerSlots: number;
    name: string;
    price: number;
    availableto: string;
    unitSizeinSqft: string;
    included: boolean;
    eligible: boolean;
    towerId: number;
}

export interface ProjectTower {
    towerId: number;
    numberofTowers:number;
    towerIndex:number;
    blockIndex:number;
    towerName: string;
    numberofFloors: number;
    numberofUniqueBlocks: number;
    totalUnits: number;
    projectTowerUnitTypes: ProjectTowerUnitType[];
    sameCeilingHeight: boolean;
    ceilingHeight: string;
    skipFloor: number;
    skipUnit: number;
    projectBlocks: ProjectBlock[];
    projectTowerParkings: ProjectTowerParking[];
    projectTowerLockers: ProjectTowerLocker[];
    projectId: number;
}

export interface BalconySize {
    balconyId: number;
    projectUnitId: number;
    number: number;
    size: number;
}

export interface TerraceSize {
    terraceId: number;
    projectUnitId: number;
    number: number;
    size: number;
}

export interface BedRoomSize {
    bedRoomsId: number;
    projectUnitId: number;
    number: number;
    size: number;
}

export interface BathSize {
    bathsId: number;
    projectUnitId: number;
    number: number;
    size: number;
}

export interface DenSize {
    id: number;
    projectUnitId: number;
    number: number;
    size: number;
}

export interface ProjectSalesOfficeDetails {
    projectSalesOfficeDetailId: number;
    address: string;
    email: string;
    city: string;
    country: string;
    postal: string;
    zipCode: string;
    phoneNumber: {
        projectSalesOfficeDetailId: number;
        projectSalePhoneId: number;
        number: string;
        internationalNumber: string;
        nationalNumber: string;
        e164Number: string;
        countryCode: string;
        dialCode: string;
    }
    workingHours: Array<{
        id: number;
        day: string;
        startTime: string;
        endTime: string;
        timeZone: string;
        projectSalesOfficeDetailId: string;
    }>
}

export interface ProjectUnitDetail {
    projectUnitId: number;
    projectId: number;
    unitno: number;
    legalNo: string;
    legalfloor: number;
    floorplanname: string;
    size: number;
    noOfBalcony: number;
    noOfTerrace: number;
    julietBalcony: number;
    totalSize: number;
    noOfBedrooms: number;
    noOfBathrooms: number;
    noOfDen: number;
    livingRoomSize: number;
    diningRoomSize: number;
    view: string;
    ceilingHeight: number;
    barrierFree: number;
    floorPremium: number;
    floors: number;
    level: number;
    openingPrice: number;
    currentPrice: number;
    eligibleForParking: boolean;
    eligibleForlocker: boolean;
    eligibleForstorage: boolean;
    uploadFloorPlanJPGPath: string;
    uploadFloorPlanPDFPath: string;
    uploadFloorJPGFile: string;
    uploadFloorPDFFile: string;
    balconySizes: BalconySize[];
    terraceSizes: TerraceSize[];
    bedRoomSizes: BedRoomSize[];
    bathSizes: BathSize[];
    denSizes: DenSize[];
}

export interface ProjectDepositStructureDetail {
    projectDepositStructureDetailId: number;
    projectDepositStructureId: number;
    unitType: string;
    typeOfDeposit: any;
    amount: number;
    percentage: number;
    time: string;
    dueOn: Date;
    installmentType: string;
    numOfInstallments: string;
    dollarValue: number;
    balanceto: number;
    fixedDate: string;
    datefromAgreement: string;
}

export interface DepositStructure {
    projectDepositStructureId: number;
    projectid: number;
    depositName: string;
    description: string;
    projectDepositStructureDetails: ProjectDepositStructureDetail[];
}

export interface ProjectWorkSheetAndBuyer {
    projectWorkSheetAndBuyerId: number;
    projectId: number;
    numberofChoicesWorksheet: number;
    unitOfMeasurement: string;
    coolingOffDays: number;
    numberofPurchasersAllowedPerBuyer: number;
    numberOfBuyersPerWorksheet: number;
}

export interface ProjectSalesAgency {
    projectSalesAgencyId: number;
    projectInternalSalesTeamId: number;
    agencyName: string;
    brokerageCommission: string;
}

export interface AssignedBuilderToProject {
    builderAssignedId: number;
    builderid: number;
    fullName: string;
    companyLogoPath: string;
    projectInternalSalesTeamId: number;
}

export interface ProjectInternalSalesTeam {
    projectInternalSalesTeamId: number;
    projectId: number;
    projectSalesAgencies: ProjectSalesAgency[];
    assignedBuilderToProject: AssignedBuilderToProject[];
}

export interface ProjectExternalTeamBroker {
    externalTeamBrokerId: number;
    projectExternalSalesTeamId: number;
    fullName: string;
}

export interface ProjectExternalSalesTeam {
    projectExternalSalesTeamId: number;
    projectId: number;
    brokerGroupName: string;
    brokerCommission: string;
    isProjectAccess: boolean;
    projectExternalTeamBroker: ProjectExternalTeamBroker[];
}

export interface ProjectBrokerDetail {
    brokerDetailId: number;
    projectBrokerId: number;
    brokerEmail: string;
    brokerCommission: number;
}

export interface ProjectBroker {
    projectBrokerId: number;
    projectId: number;
    projectAccess: number;
    projectBrokerDetails: ProjectBrokerDetail[];
}

export interface ProjectDocument {
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    documentId: number;
    projectId: number;
    documentType: number;
    documentText: string;
}

export interface ProjectMarketingAsset {
    projectAssestsId: number;
    projectId: number,
    makeItPublic: boolean,
    assetsFile: string,
    assetsFilePath: string,
    folderName: string
}

export interface ProjectModel {
    projectId: number;
    projectName: string;
    builderid: number;
    builderName: string;
    projectType: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
    email: string;
    phoneNumber: string;
    workingHour: string;
    logo: string;
    heroImage: string;
    startDate: Date;
    completionDate: Date;
    buildingHeight: string;
    buildingHeightUnit: string;
    province: string;
    buildingDescription: string;
    websiteUrl: string;
    miniSiteURL: string;
    projectStatus: string;
    currentIncentive: string;
    landscaping: Landscaping[];
    architects: Architect[];
    interiorDesigners: InteriorDesigner[];
    marketingCompany: MarketingCompany[];
    addAgency: AddAgency[];
    amenities: Amenity[];
    featuresAndFinishes: FeaturesAndFinish[];
    generalSetting: GeneralSetting;
    projectGridColors: ProjectGridColor[];
    projectTax: ProjectTax[];
    projectUnit: ProjectUnit;
    projectTower: ProjectTower[];
    projectUnitDetails: ProjectUnitDetail[];
    depositStructure: DepositStructure[];
    projectWorkSheetAndBuyer: ProjectWorkSheetAndBuyer;
    projectInternalSalesTeam: ProjectInternalSalesTeam;
    projectExternalSalesTeam: ProjectExternalSalesTeam[];
    projectBroker: ProjectBroker[];
    projectDocument: ProjectDocument[];
    projectSalesOfficeDetails: ProjectSalesOfficeDetails;
    projectMarketingAssets: ProjectMarketingAsset[]

    completed?: boolean;

}

export interface ProjectRes {
    isSuccess: boolean;
    message: string;
    validationErrors: string[];
    data: ProjectModel;
}
 

