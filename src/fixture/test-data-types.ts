export type DateTime = {
    date: string
    projectFormattedDate: string
    time: string
    runStamp: string,
    currentTime: Function
}

export type UserData = {
    userName: string,
    password: string,
    role?: string,
    dateAdded?: string,
    status?: string
}

/* Type to set test run defaults. Use these fields to overrride them in playwright config for differenct projects
 * https://playwright.dev/docs/test-fixtures#fixtures-options 
 */
export type FixtureOptions = {
    userRole: string
};