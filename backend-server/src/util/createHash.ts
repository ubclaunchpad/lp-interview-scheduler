export function createHash(
    lead1: string,
    lead2: string,
    intervieweeEmail: string
) {
    return lead1 + lead2 + intervieweeEmail;
}