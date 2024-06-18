export function getUserRole(roleId: any) {
    let userRole = "";
    switch (roleId) {
        case 0:
            userRole = "Owner";
            break;
        case 1:
            userRole = "Administrator";
            break;
        case 2:
            userRole = "Coach";
            break;
        case 3:
            userRole = "Athlete";
            break;
        case 4:
            userRole = "Parent";
            break;
        case 5:
            userRole = "Referee";
            break;
        case 6:
            userRole = "Media";
            break;
        case 7:
            userRole = "Member";
            break;
    }
    return userRole;
}