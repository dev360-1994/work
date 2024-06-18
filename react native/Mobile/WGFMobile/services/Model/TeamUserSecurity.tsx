export class TeamUserSecurity {
    teamId: number = 0;
    userId: number = 0;
    action: string = "";
    value: boolean = false;
};

export class TeamSecurity {
    actionDesc: string = "";
    administrator: number = 0;
    athlete: number = 0;
    categoryDesc: string = "";
    coach: number = 0;
    dateCreated?: Date = undefined;
    dateUpdated?: Date = undefined;
    parent: number = 0;
    press: number = 0;
    referee: number = 0;
    teamAction: string = "";
    teamId: number = 0;
    teamSecurityId: number = 0;
}

export class SecurityPost {
    actionDesc: string = "";
    administrator: number = 0;
    athlete: number = 0;
    coach: number = 0;
    parent: number = 0;
    press: number = 0;
    referee: number = 0;
    teamId: number = 0;
    userId: number = 0;
    teamSecurityId: number = 0;
}