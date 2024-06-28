
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
    towerParkingId:number;
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
export interface ProjectUnitFlat1 {
     
    price: number;
    unitTypeId: number;
     unitType:string;
    interiorSize: number;
    unitName: string;
    balconySize: number;
    ceilingHeight: number;
    floorPremium: number;
    view: number;
    livingRoomSize: number;
    diningRoomSize: number;
    noOfBedroom: number;
    nOofBaths: number;
    terrace: number;
    noofBalcony: number;
    noofDen: number;
    flatStatus: string;
    isSkip: boolean;
    flatBedRooms: FlatBedRoom[];
    flatbathroomSizes: FlatbathroomSize[];
    flatterraceSizes: FlatterraceSize[];
    flatbalconysizes: Flatbalconysize[];
    flatProjectUnitAdditionalFeatures: FlatprojectUnitAdditionalFeature[];
    floorPlanFile:string;
    PlanSchedlePath:string;
    flatdenSizes: FlatdenSize[];
    
}
export interface ProjectUnitFlat {
    unitNo: number;
    price: number;
    unitTypeId: number;
    unitType: string;
    isMultipleStackSelected:boolean;
    interiorSize: number;
    unitName: string;
    balconySize: number;
    ceilingHeight: number;
    inActiveStatus: number;
    projectFloorDetailsFloorId:number;
    floorPremium: number;
    view: number;
    livingRoomSize: number;
    diningRoomSize: number;
    noOfBedroom: number;
    nOofBaths: number;
    terrace: number;
    noofBalcony: number;
    noofDen: number;
    flatId: number;
    flatNo: number;
    flatStatus: string;
    isSingleStackSelected: boolean;
    isSkip: boolean;
    flatBedRooms: FlatBedRoom[];
    flatbathroomSizes: FlatbathroomSize[];
    flatterraceSizes: FlatterraceSize[];
    flatbalconysizes: Flatbalconysize[];
    flatProjectUnitAdditionalFeatures: FlatprojectUnitAdditionalFeature[];
    floorPlanFile:string;
    PlanSchedlePath:string;
    flatdenSizes: FlatdenSize[];
    assignAgentId:number;
    floorNo:number;
}

export interface ProjectFloorDetail {
    floorId: number;
    floorNo: number;
    projectBlockBlockId:number;
    isFloorSelected:boolean;
    projectUnitFlats: ProjectUnitFlat[];
    blockUnitPriceId: number;
}

export interface ProjectBlock {
    blockId: number;
    blockNo:number;
    towerNo:number;
    floorPremium:number;
    projectTowerTowerId:number;
    blockName: string;
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
    unitTypeOptions: string;
    unitTypeValues: any;
    numberOfParkingSlots: number;
    name: string;
    price: number;
    amount: number;
    availableto: string;
    unitSizeinSqft: string;
    included: boolean;
    eligible: boolean;
    towerId: number;
}

export interface ProjectTowerLocker {
    towerLockerId: number;
    unitTypeOptions: string;
    unitTypeValues: any;
    numberOfLockerSlots: number;
    name: string;
    price: number;
    amount: number;
    availableto: string;
    unitSizeinSqft: string;
    included: boolean;
    eligible: boolean;
    towerId: number;
}

export interface ProjectTower {
    towerId: number;
    towerNo:number;
    towerName: string;
    numberofFloors: number;
    numberofUniqueBlocks: number;
    totalUnits: number;
    numberOfUnits:number;
    projectTowerUnitTypes: ProjectTowerUnitType[];
    sameCeilingHeight: boolean;
    ceilingHeight: number;
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
    assignAgentId:number;
    flatId:number;
    flatNo:number;
    projectId: number;
    unitTypeId:number;
    flatStatus:string;
    isSkip:boolean;
    isSingleStackSelected:boolean;
    isMultipleStackSelected:boolean;
    unitNo: number;
    price:number;
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
    view: number;
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
    numberofTowers:number;
    projectGeneralSettingId:number;
    priceInclusiveTaxes:boolean;
    towerIndex:number;
    blockIndex:number;
    projectName: string;
    builderid: number;
    builderName: string;
    skipFloor:number;
    skipUnit:number;
    
    generalSetting: GeneralSetting;
    projectGridColors: ProjectGridColor[];
    projectTax: ProjectTax[];
    projectUnit: ProjectUnit;
    projectTower: ProjectTower[];
    
    
    
 

    completed?: boolean;

}

export interface ProjectRes {
    isSuccess: boolean;
    message: string;
    validationErrors: string[];
    data: ProjectModel;
}
export interface ProjectTowerForBuildGrid {
    towerId: number;
    numberofTowers?:number;
    towerIndex?:number;
    blockIndex?:number;
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

